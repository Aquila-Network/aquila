from cassandra.cluster import Cluster
import uuid, time, base64

# create a cassandra session
def create_session (clusters_arr):
    cluster = Cluster(clusters_arr)
    # try connecting
    try:
        session = cluster.connect()
    except Exception as e:
        return None
    # try setting keyspace
    try:
        session.set_keyspace('logging')
    except Exception as e:
        # create session keyspace
        session.execute("CREATE KEYSPACE logging \
            WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3};")
        # set keyspace
        session.set_keyspace('logging')

    return session

def get_log_index (session, database_name=None, url=None, html=None, is_deleted=0):
    # fetch index table
    # Query
    query = "SELECT * FROM lindex WHERE is_deleted=" + str(is_deleted)
    if database_name != None:
        query += " and database_name='" + database_name + "'"
    if url != None:
        query += " and url='" + url + "'"
    if html != None:
        query += " and html='" + html + "'"
    query += " ALLOW FILTERING;"

    try:
        return [r for r in session.execute(query)]
    except Exception as e:
        print(e)
        return []

def put_log_index (session, database_name, url, html, is_deleted=0):
    # create index table if not available
    # Query
    query = "CREATE TABLE IF NOT EXISTS lindex (id_ varint PRIMARY KEY, \
            database_name text, \
            url text, \
            html text, \
            timestamp varint, \
            is_deleted int );"
    try:
        session.execute(query)
    except Exception as e:
        return False

    id_ = uuid.uuid1().int>>64
    query = "INSERT INTO lindex (id_, database_name, url, html, timestamp, is_deleted) \
            VALUES({}, '{}', '{}', '{}', {}, {});".format(id_, database_name, url, base64.b64encode(bytes(html, "utf-8")).decode("utf-8"), int(time.time()), is_deleted)
    try:
        session.execute(query)
    except Exception as e:
        return False

    return True

def get_log_search (session, database_name=None, query=None, url=None):
    # fetch search table
    # Query
    query_ = "SELECT * FROM lsearch"

    if database_name != None or query != None or url != None:
        query_ += " WHERE"

    counter = 0
    if database_name != None:
        counter += 1
        query_ += " database_name='" + database_name + "'"
    if url != None:
        if counter > 0:
            query_ += " and"
        counter += 1
        query_ += " url='" + url + "'"
    if query != None:
        if counter > 0:
            query_ += " and"
        query_ += " query='" + query + "'"
    query_ += " ALLOW FILTERING;"

    try:
        return [r for r in session.execute(query_)]
    except Exception as e:
        print(e)
        return []

def put_log_search (session, database_name, query, url):
    # create search table if not available
    # Query
    query_ = "CREATE TABLE IF NOT EXISTS lsearch (id_ varint PRIMARY KEY, \
            database_name text, \
            query text, \
            url text, \
            timestamp varint);"
    try:
        session.execute(query_)
    except Exception as e:
        return False

    id_ = uuid.uuid1().int>>64
    query_ = "INSERT INTO lsearch (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(id_, database_name, query, url, int(time.time()))
    try:
        session.execute(query_)
    except Exception as e:
        return False

    return True

def get_log_correct (session, database_name=None, query=None, url=None):
    # fetch correct table
    # Query
    query_ = "SELECT * FROM lcorrect"

    if database_name != None or query != None or url != None:
        query_ += " WHERE"

    counter = 0
    if database_name != None:
        counter += 1
        query_ += " database_name='" + database_name + "'"
    if url != None:
        if counter > 0:
            query_ += " and"
        counter += 1
        query_ += " url='" + url + "'"
    if query != None:
        if counter > 0:
            query_ += " and"
        query_ += " query='" + query + "'"
    query_ += " ALLOW FILTERING;"

    try:
        return [r for r in session.execute(query_)]
    except Exception as e:
        print(e)
        return []

def put_log_correct (session, database_name, query, url):
    # create correct table if not available
    # Query
    query_ = "CREATE TABLE IF NOT EXISTS lcorrect (id_ varint PRIMARY KEY, \
            database_name text, \
            query text, \
            url text, \
            timestamp varint);"
    try:
        session.execute(query_)
    except Exception as e:
        return False

    id_ = uuid.uuid1().int>>64
    query_ = "INSERT INTO lcorrect (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(id_, database_name, query, url, int(time.time()))
    try:
        session.execute(query_)
    except Exception as e:
        return False

    return True

