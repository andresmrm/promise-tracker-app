#!/usr/bin/env python3
# coding: utf-8

import os
import pickle
import datetime
from flask import (Flask, request, render_template, send_file,
                   send_from_directory)

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True
app.jinja_env.line_statement_prefix = '#'

datadir = os.environ.get('OPENSHIFT_DATA_DIR')
if not datadir:
    datadir = '.'

try:
    with open(os.path.join(datadir, 'data'), 'rb') as f:
        received = pickle.load(f)
except FileNotFoundError:
    received = []


@app.route("/")
def list():
    return render_template('list.html', registers=received[::-1])


@app.route("/post", methods=['POST'])
def receive():
    for item in request.get_json():
        item['date'] = datetime.datetime.now().strftime('%c')
        received.append(item)
    with open(os.path.join(datadir, 'data'), 'wb') as f:
        pickle.dump(received, f)
    return '{}'


@app.route("/app")
def jsapp():
    return render_template('app.html')


@app.route("/manifest")
def manifest():
    return send_file('manifest.appcache', mimetype='text/cache-manifest',
                     cache_timeout=0)


@app.route('/<path:path>')
def arquivos(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(host='10.0.0.11', debug=True)
