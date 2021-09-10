# this script is used to setup initial tables for logging of user behaviours

from cassandra.cluster import Cluster

# create a cassandra session
def create_session (clusters_arr):
    cluster = Cluster(clusters_arr)
    # try connecting
    try:
        session = cluster.connect()
    except Exception as e:
        print(e)
        return None
    # try setting keyspace
    try:
        session.set_keyspace('logging')
    except Exception as e:
        print(e)
        # create session keyspace
        session.execute("CREATE KEYSPACE logging \
            WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};")
        # set keyspace
        session.set_keyspace('logging')

    return session

def create_content_index_by_database (session):
    query = "CREATE TABLE IF NOT EXISTS content_index_by_database ( \
            id_ varint, \
            database_name varchar, \
            url text, \
            html text, \
            timestamp varint, \
            is_deleted int, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"
            
    try:
        return session.execute(query)
    except Exception as e:
        print(e)
        return False

def create_content_metadata_by_database (session):
    query = "CREATE TABLE IF NOT EXISTS content_metadata_by_database ( \
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
            
    try:
        return session.execute(query)
    except Exception as e:
        print(e)
        return False

def create_search_history_by_database (session):
    query = "CREATE TABLE IF NOT EXISTS search_history_by_database ( \
            id_ varint, \
            database_name varchar, \
            query text, \
            url text, \
            timestamp varint, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"
            
    try:
        return session.execute(query)
    except Exception as e:
        print(e)
        return False

def create_search_correction_by_database (session):
    query = "CREATE TABLE IF NOT EXISTS search_correction_by_database ( \
            id_ varint, \
            database_name varchar, \
            query text, \
            url text, \
            timestamp varint, \
            PRIMARY KEY ((database_name), timestamp, id_) ) \
            WITH CLUSTERING ORDER BY ( timestamp DESC, id_ ASC );"

    try:
        return session.execute(query)
    except Exception as e:
        print(e)
        return False

if __name__ == "__main__":
    session = create_session(["164.52.214.80"])
    print(create_content_index_by_database(session))
    print(create_content_metadata_by_database(session))
    print(create_search_history_by_database(session))
    print(create_search_correction_by_database(session))
