# this script is used to migrate data from old aquilaDB databases to new ones 
# when a new ML encoder model is added in aquila hub.

from cassandra.cluster import Cluster

from ..index import create_database

import base58, uuid, time

# create a cassandra reader session
def create_session (clusters_arr, kspace):
    cluster = Cluster(clusters_arr)
    # try connecting
    try:
        session = cluster.connect()
    except Exception as e:
        print(e)
        return None
    # try setting keyspace
    try:
        session.set_keyspace(kspace)
    except Exception as e:
        print(e)
        # create session keyspace
        session.execute("CREATE KEYSPACE "+kspace+" \
            WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};")
        # set keyspace
        session.set_keyspace(kspace)

    return session

def create_temp_dbs (session):
    query1 = "CREATE TABLE IF NOT EXISTS content_index_by_database_t ( \
            id_ varint, \
            database_name varchar, \
            url text, \
            html text, \
            timestamp varint, \
            is_deleted int, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"

    query2 = "CREATE TABLE IF NOT EXISTS content_metadata_by_database_t ( \
            id_ varint, \
            database_name varchar, \
            url text, \
            coverimg text, \
            title text, \
            author text, \
            timestamp varint, \
            outlinks text, \
            summary text, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"

    query3 = "CREATE TABLE IF NOT EXISTS search_history_by_database_t ( \
            id_ varint, \
            database_name varchar, \
            query text, \
            url text, \
            timestamp varint, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"

    query4 = "CREATE TABLE IF NOT EXISTS search_correction_by_database_t ( \
            id_ varint, \
            database_name varchar, \
            query text, \
            url text, \
            timestamp varint, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"

    query5 = "CREATE TABLE IF NOT EXISTS search_index_by_user_t ( \
            usecret varchar, \
            aquila_database_name varchar, \
            pub_db_id varchar, \
            pub_enabled int, \
            is_deleted int, \
            timestamp varint, \
            PRIMARY KEY ((usecret), timestamp, aquila_database_name) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, aquila_database_name ASC );"

    query6 = "CREATE TABLE IF NOT EXISTS user_profile_by_email_t ( \
            usecret varchar, \
            email varchar, \
            name varchar, \
            title text, \
            avatar_url text, \
            is_deleted int, \
            timestamp varint, \
            PRIMARY KEY ((email), timestamp, usecret) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, usecret ASC );"

    query7 = "CREATE TABLE IF NOT EXISTS public_subscribe_list_by_user_t ( \
            usecret varchar, \
            is_deleted int, \
            timestamp varint, \
            pub_db_id varchar, \
            PRIMARY KEY ((usecret), timestamp, pub_db_id) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, pub_db_id ASC );"
            
    try:
        session.execute(query1)
        session.execute(query2)
        session.execute(query3)
        session.execute(query4)
        session.execute(query5)
        session.execute(query6)
        session.execute(query7)

        return True
    except Exception as e:
        print(e)
        return False

def copy_to_temp_dbs (session):
    try:
        # direct copy contents
        res = session.execute("SELECT * FROM user_profile_by_email;")
        for r in res:
            session.execute("INSERT INTO user_profile_by_email_t (usecret, email, name, title, avatar_url, is_deleted, timestamp) \
                VALUES('{}', '{}', '{}', '{}', '{}', {}, {});".format(r.usecret, r.email, r.name, r.title, r.avatar_url, r.is_deleted, r.timestamp))
        
        res = session.execute("SELECT * FROM public_subscribe_list_by_user;")
        for r in res:
            session.execute("INSERT INTO public_subscribe_list_by_user_t (usecret, pub_db_id, is_deleted, timestamp) \
            VALUES('{}', '{}', {}, {});".format(r.usecret, r.pub_db_id, r.is_deleted, r.timestamp))

        # create new db name
        seed = base58.b58encode(uuid.uuid4().bytes)[:-14].decode("utf-8")+str(int(time.time()))
        db_name, status = create_database(seed)
        if not status:
            return False
        
        res = session.execute("SELECT * FROM search_index_by_user;")
        for r in res:
            session.execute("INSERT INTO search_index_by_user_t (usecret, aquila_database_name, pub_db_id, pub_enabled, is_deleted, timestamp) \
            VALUES('{}', '{}', '{}', {}, {}, {});".format(r.usecret, db_name, r.pub_db_id, r.pub_enabled, r.is_deleted, r.timestamp))
        
        res = session.execute("SELECT * FROM content_index_by_database;")
        for r in res:
            session.execute("INSERT INTO content_index_by_database_t (id_, database_name, url, html, timestamp, is_deleted) \
            VALUES({}, '{}', '{}', '{}', {}, {});".format(r.id_, db_name, r.url, r.html, r.timestamp, r.is_deleted))
        
        res = session.execute("SELECT * FROM content_metadata_by_database;")
        for r in res:
            session.execute("INSERT INTO content_metadata_by_database_t (id_, database_name, url, coverimg, title, author, timestamp, outlinks, summary) \
            VALUES({}, '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}');".format(r.id_, db_name, r.url, r.coverimg, r.title, r.author, r.timestamp, r.outlinks, r.summary))
        
        res = session.execute("SELECT * FROM search_history_by_database;")
        for r in res:
            session.execute("INSERT INTO search_history_by_database_t (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(r.id_, db_name, r.query, r.url, r.timestamp))
        
        res = session.execute("SELECT * FROM search_correction_by_database;")
        for r in res:
            session.execute("INSERT INTO search_correction_by_database_t (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(r.id_, db_name, r.query, r.url, r.timestamp))
        
        return True
    except Exception as e:
        print(e)
        return False


def drop_old_dbs (session):
    pass

def rename_temp_dbs (session):
    pass

if __name__ == "__main__":
    session = create_session(["164.52.214.80"], 'logging')
    print(create_temp_dbs(session))
    print(copy_to_temp_dbs(session))
    print(drop_old_dbs(session))
    print(rename_temp_dbs(session))
