#!/usr/bin/env python3
from flask import Flask, request
import click


DEFAULT_HOST='0.0.0.0'
DEFAULT_PORT=8080
app = Flask(__name__)

@click.command()
@click.option('--host', default=DEFAULT_HOST, help='What host to broadcast')
@click.option('--port', default=DEFAULT_PORT, help='What port to bind to')
def run_server(host: str, port: int):
    """easy web interface to control gate and garage doors"""
    app.run(host=host, port=port)


@app.route("/")
@app.route("/index")
def index():
    with open('index.html', 'r') as file:
        return file.read()


@app.route("/buzz", methods = ['POST'])
def buzz():
    click.echo(request.form.get('player'))
    return "BUZZ!"


if __name__ == '__main__':
    run_server()
