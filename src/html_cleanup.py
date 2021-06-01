import requests
import json

readability_server = "http://mercury:5009"
trim_server = "http://txtpick:5008"

def process_html (html, url):
    payload = {
        "html": html,
        "url": url
    }

    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", readability_server+"/process", headers=headers, data=json.dumps(payload))

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

    response = requests.request("POST", trim_server+"/process", headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        return response.json()
    else:
        return None