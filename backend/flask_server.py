#!/usr/bin/env python3

"""
Flask API which serves the frontend of the application
and has different functionalities based on different
requests

"""

from flask import Flask

app = Flask(__name__)


"""
Stores users into database with correct fields

"""
@app.route("/rapidserve/api/v1.0/users", methods=['POST'])
def store_users():
    return "Hello, World!"


if __name__ == '__main__':
    app.run(host="0.0.0.0")
