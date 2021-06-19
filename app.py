# -*- coding: utf-8 -*-

from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

import logging

import ast

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__, instance_relative_config=True)

# from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
# from sumy.summarizers.luhn import LuhnSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
from bs4 import BeautifulSoup

import nltk
nltk.download('punkt')
LANGUAGE = "english"

def get_paragraphs(html_doc):
    soup = BeautifulSoup(html_doc, 'html.parser')
    paras = []
    counter = 0
    for para in soup.find_all("p"):
        text_data = para.text
        for txt in text_data.split("\n"):
            if txt.strip() != "":
                counter += 1
                paras.append(" ".join(txt.strip().split()))
    return paras, counter

def extract_request_params (request):
    if not request.is_json:
        logging.error("Cannot parse request parameters")

        # request is invalid
        return {}

    # Extract JSON data
    data_ = request.get_json()

    return data_

@app.route("/process", methods=['POST'])
def process ():
    """
    Process html content
    """

    # get parameters
    html = None
    
    if extract_request_params(request).get("html"):
        html = extract_request_params(request)["html"]

    if not html:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    # process logic
    text_in, nlines = get_paragraphs(html)
    sentances_ret = []

    parser = PlaintextParser.from_string("\n".join(text_in), Tokenizer(LANGUAGE))
    stemmer = Stemmer(LANGUAGE)

    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words(LANGUAGE)

    SENTENCES_COUNT = int(nlines * 0.2)
    if SENTENCES_COUNT > 100:
        SENTENCES_COUNT = 100
    if SENTENCES_COUNT < 1:
        SENTENCES_COUNT = nlines
        
    for sentence in summarizer(parser.document, SENTENCES_COUNT):
        sentances_ret.append(sentence._text)

    # Build response
    return {
            "success": True,
            "result": sentances_ret
        }, 200


# Server starter
def flaskserver ():
    """
    start server
    """
    app.run(host='0.0.0.0', port=5008, debug=False)

# Enable CORS
CORS(app)


if __name__ == "__main__":
    flaskserver()
