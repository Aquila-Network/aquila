import requests
import json

def process_html (html, url):
    payload = {
        "html": html,
        "url": url
    }

    headers = {
    'Content-Type': 'application/json'
    }

    # conn.request("POST", "localhost:5009/process", json.dumps(payload), headers)
    response = requests.request("POST", "http://localhost:5009/process", headers=headers, data=json.dumps(payload))
    # res = conn.getresponse()
    # data = response.text()

    if response.status_code == 200:
        return response.json()
    else:
        return None

def trim_content (html):
    payload = {
        "html": html
    }

    headers = {
    'Content-Type': 'application/json'
    }

    # conn.request("POST", "localhost:5009/process", json.dumps(payload), headers)
    response = requests.request("POST", "http://localhost:5008/process", headers=headers, data=json.dumps(payload))
    # res = conn.getresponse()
    # data = response.text()

    if response.status_code == 200:
        return response.json()
    else:
        return None

if __name__ == "__main__":
    readablity = process_html("<html><h1>Bitcoin</h1><p>Bitcoin is invented by satoshi nakomoto</p><br/><p>it is powered by <a href='google.com'>mining</a></p></html>", "https://google.com")
    print(readablity)
    content_lines = trim_content(readablity["data"]["content"])
    if content_lines["success"] == True:
        print(content_lines["result"])