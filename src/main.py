from services import logging as slog

# # decode html from base64 encoding
# import base64
# base64.b64decode(bytes(html, "utf-8")).decode("utf-8")

if __name__ == "__main__":
    session = slog.create_session(["192.168.1.105"])
    if session != None:
        status = slog.put_log_index(session, "db1", "google.com", "<html></html>", 0)
        if status:
            print("added index data")
        status = slog.put_log_search(session, "db1", "google search", "google.com")
        if status:
            print("added search data")
        status = slog.put_log_correct(session, "db1", "google search", "google.com")
        if status:
            print("added correct data")


        result = slog.get_log_index(session)
        if len(result) > 0:
            print(len(result), [r.url for r in result])
        result = slog.get_log_search(session)
        if len(result) > 0:
            print(len(result), [r.id_ for r in result])
        result = slog.get_log_correct(session)
        if len(result) > 0:
            print(len(result), [r.timestamp for r in result])
    else:
        print("DB connection error")

