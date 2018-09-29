#!/usr/bin/env python3
from flask import Flask, request
from cachetools.func import ttl_cache
from os import path
import click
import subprocess


SERVER_DIR = path.abspath(path.dirname(__file__))
DEFAULT_HOST='0.0.0.0'
DEFAULT_PORT=8080
DEFAULT_LANDING_PAGE=path.join(SERVER_DIR, "../frontend/index.html")
DEFAULT_BUZZ_SOUND=path.join(SERVER_DIR, "ding.mp3")
app = Flask(__name__)


@click.command()
@click.option('--host', default=DEFAULT_HOST, help='What host to broadcast')
@click.option('--port', default=DEFAULT_PORT, help='What port to bind to')
@click.option('--landing-page', 'page',
    default=DEFAULT_LANDING_PAGE,
    help='html page to serve up')
@click.option('--buzz-sound', 'sound',
    default=DEFAULT_BUZZ_SOUND,
    help='audio to play when player buzzes')
def run_server(host: str, port: int, page: str, sound: str) -> None:
    """easy web interface to control gate and garage doors"""
    app.config['index'] = page
    app.config['sound'] = sound
    app.run(host=host, port=port)


@app.route("/")
@app.route("/index")
def index() -> str:
    """ return the contents of index.html in the response body """
    with open(app.config.get("index"), 'r') as file:
        return file.read()


@ttl_cache(ttl=5) # memoize for 5 seconds to prevent spamming
def ding() -> str:
    """ play a sound when someone buzzes in """
    # sudo apt-get install cvlc
    cmd = "cvlc --play-and-exit " + app.config.get("sound")
    subprocess.Popen(cmd, shell=True) # non-blocking


@app.route("/buzz", methods = ['POST'])
def buzz() -> str:
    """ someone just clicked the buzzer """
    click.echo(request.form.get('player'))
    ding()
    return "BUZZ!!"


if __name__ == '__main__':
    run_server()
