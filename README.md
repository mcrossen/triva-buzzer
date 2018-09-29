# triva-buzzer
quck and hacky website to replace trivia buzzers for group games

## Installation
On Ubuntu, install vlc media player and npm:
`sudo apt-get install vlc npm`

Build the frontend:
`cd frontend && npm run build && cd ..`

Then install the repository dependencies:
`sudo pip3 install -r backend/requirements.txt`

## Usage
run `./backend/server.py 2>/dev/null`

then visit [http://localhost:8080](http://localhost:8080) for the buzzer.

When players hit the buzzer, their names will appear on the console for the reader judge.
