import logging

from cassandra.cluster import Cluster
import uuid, time, base64, hashlib

# URL to id
def urls_to_ids (urls):
    return [ int(hashlib.sha1(url.encode("utf-8")).hexdigest(), 16) >> 96 for url in urls ]

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
            WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};")
        # set keyspace
        session.set_keyspace('logging')

    return session

def get_log_index (session, database_name=None, url=None, html=None, is_deleted=0):
    # fetch index table
    # Query
    query = "SELECT * FROM content_index_by_database WHERE is_deleted=" + str(is_deleted)
    if database_name != None:
        query += " and database_name='" + database_name + "'"
    if url != None:
        query += " and url='" + url + "'"
    if html != None:
        query += " and html='" + base64.b64encode(html.encode("utf-8")).decode("utf-8") + "'"
    query += " ALLOW FILTERING;"

    try:
        return [r for r in session.execute(query)]
    except Exception as e:
        logging.error(e)
        return []

def get_all_url (session, database_name, page=0, limit=100, is_deleted=0):
    # fetch all non deleted urls by page
    # Query
    if database_name != None:
        query = "SELECT * FROM content_index_by_database WHERE is_deleted = " + str(is_deleted) + " and database_name = '" + database_name + "' ALLOW FILTERING;"

        try:
            urllst =  [{ "timestamp": r.timestamp, "url": r.url } for r in session.execute(query)]

            # IMP TODO: remove below sorting and do sorting within DB itself
            return sorted(urllst, key=lambda x: x["timestamp"], reverse=True)
        except Exception as e:
            logging.error(e)
            return []
    else:
        return []

def put_log_index (session, database_name, url, html, is_deleted=0):
    id_ = uuid.uuid1().int>>64
    query = "INSERT INTO content_index_by_database (id_, database_name, url, html, timestamp, is_deleted) \
            VALUES({}, '{}', '{}', '{}', {}, {});".format(id_, database_name, url, base64.b64encode(html.encode("utf-8")).decode("utf-8"), int(time.time()), is_deleted)
    try:
        session.execute(query)
    except Exception as e:
        logging.error(e)
        return False

    return True

def get_url_summary (session, db_name, urls_list):
    # fetch url summary
    ret_list = []
    # Query
    # ids_list = urls_to_ids(urls_list)
    if len(urls_list) > 0:
        for url in urls_list:
            query = "SELECT * FROM content_metadata_by_database WHERE url='" + str(url)
            query += "' AND database_name='"+db_name+"' LIMIT 1 ALLOW FILTERING;"

            try:
                # merge results
                ret_list += [{ \
                    "title": r.title, \
                    "author": r.author, \
                    "url": r.url, \
                    "coverimg": r.coverimg, \
                    "summary": base64.b64decode(r.summary.encode("utf-8")).decode("utf-8"), \
                    "outlinks": r.outlinks } \
                        for r in session.execute(query)]
            except Exception as e:
                logging.error(e)

    return ret_list

def put_url_summary (session, database_name, url, title, author, coverimg, outlinks, summary):
    # create summary table for urls
    # precaution
    if not title:
        title = ""
    if not author:
        author = ""
    if not coverimg:
        coverimg = ""
    if not outlinks:
        outlinks = ""

    id_ = urls_to_ids([url])[0]
    query = "INSERT INTO content_metadata_by_database (id_, database_name, url, coverimg, title, author, timestamp, outlinks, summary) \
            VALUES({}, '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}');".format(id_, database_name, url, coverimg, title, author, int(time.time()), outlinks, base64.b64encode(summary.encode("utf-8")).decode("utf-8"))
    try:
        session.execute(query)
    except Exception as e:
        logging.error(e)
        return False

    return True

def get_log_search (session, database_name=None, query=None, url=None):
    # fetch search table
    # Query
    query_ = "SELECT * FROM search_history_by_database"

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
        logging.error(e)
        return []

def put_log_search (session, database_name, query, url):
    id_ = uuid.uuid1().int>>64
    query_ = "INSERT INTO search_history_by_database (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(id_, database_name, query, url, int(time.time()))
    try:
        session.execute(query_)
    except Exception as e:
        logging.error(e)
        return False

    return True

def get_log_correct (session, database_name=None, query=None, url=None):
    # fetch correct table
    # Query
    query_ = "SELECT * FROM search_correction_by_database"

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
        logging.error(e)
        return []

def put_log_correct (session, database_name, query, url):
    id_ = uuid.uuid1().int>>64
    query_ = "INSERT INTO search_correction_by_database (id_, database_name, query, url, timestamp) \
            VALUES({}, '{}', '{}', '{}', {});".format(id_, database_name, query, url, int(time.time()))
    try:
        session.execute(query_)
    except Exception as e:
        logging.error(e)
        return False

    return True

