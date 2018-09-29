#!/usr/bin/env python3
from flask import Flask, request, jsonify, Response
from cachetools.func import ttl_cache
from os import path
from queue import Queue
from threading import Thread
import click
import subprocess


SERVER_DIR = path.abspath(path.dirname(__file__))
DEFAULT_HOST='0.0.0.0'
DEFAULT_PORT=8080
DEFAULT_LANDING_PAGE=path.join(SERVER_DIR, "../frontend/dist/index.html")
DEFAULT_SCOREBOARD_PAGE=path.join(SERVER_DIR,
    "../frontend/dist/scoreboard.html")
DEFAULT_BUZZ_SOUND=path.join(SERVER_DIR, "ding.mp3")
app = Flask(__name__)
buzz_queue = Queue()
scores = {}


@click.command()
@click.option('--host', default=DEFAULT_HOST, help='What host to broadcast')
@click.option('--port', default=DEFAULT_PORT, help='What port to bind to')
@click.option('--landing-page', 'page',
    default=DEFAULT_LANDING_PAGE,
    help='html page to serve up')
@click.option('--scoreboard-page', 'score',
    default=DEFAULT_SCOREBOARD_PAGE,
    help='html file for the scoreboard')
@click.option('--buzz-sound', 'sound',
    default=DEFAULT_BUZZ_SOUND,
    help='audio to play when player buzzes')
def run_server(host: str, port: int, page: str, score: str, sound: str) -> None:
    """easy web interface to control gate and garage doors"""
    app.config['index'] = page
    app.config['score'] = score
    app.config['sound'] = sound
    app.run(host=host, port=port)


@app.route("/")
@app.route("/index")
def index() -> str:
    """ return the contents of index.html in the response body """
    with open(app.config.get("index"), 'r') as file:
        return file.read()


@app.route("/scoreboard")
def scoreboard() -> str:
    """ return the contents of scoreboard.html in the response body """
    with open(app.config.get("scoreboard"), 'r') as file:
        return file.read()


@ttl_cache(ttl=5) # memoize for 5 seconds to prevent spamming
def ding() -> str:
    """ play a sound when someone buzzes in """
    # sudo apt-get install cvlc
    cmd = "cvlc --play-and-exit {sound} 2> /dev/null".format(
        sound=app.config.get("sound")
    )
    subprocess.Popen(cmd, shell=True) # non-blocking


@app.route("/buzz", methods = ['POST'])
def buzz() -> str:
    """ someone just clicked the buzzer """
    buzz_queue.put(request.args.get('player'))
    ding()
    return "BUZZ!!"


@app.route("/score")
def score() -> Response:
    return jsonify(scores)


if __name__ == '__main__':
    server = Thread(target=run_server, daemon=True)
    server.start()

    try:
        while True:
            player = buzz_queue.get()
            if click.confirm("did player ({player}) answer correctly?".format(
                player=player,
            )):
                scores[player] = scores.get(player, 0) + 100
                with buzz_queue.mutex:
                    buzz_queue.queue.clear()
                click.echo("{player} score now {score}".format(
                    player=player,
                    score=scores.get(player, 0),
                ))
    except KeyboardInterrupt:
        exit(0)
