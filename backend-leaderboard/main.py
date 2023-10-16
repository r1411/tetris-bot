from flask import Flask
from flask import request
from flask import jsonify
from flask import g
import sqlite3

DATABASE = '/etc/leaderboard-data/leaderboard.db'
app = Flask(__name__)


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = make_dicts
    return db

def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route("/top")
def get_leaderboard():
    cur = get_db().cursor()
    res = cur.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    items = res.fetchall()
    return successful_response({"items": items})

@app.route("/getscore")
def get_score():
    if not 'username' in request.args:
        return error_response('Missing "username" URL parameter')
    
    username = request.args['username']

    cur = get_db().cursor()

    res = cur.execute("SELECT username, score FROM leaderboard WHERE username=?", (username,))
    row = res.fetchone()
    if row is None:
        return error_response('User not found')
    
    return successful_response(row)


@app.route("/setscore", methods=["POST"])
def set_score():
    data = request.json
    if not data:
        return error_response('Invalid JSON posted')

    if not 'username' in data:
        return error_response('No "username" key')
    
    if not 'score' in data:
        return error_response('No "score" key')
    
    if not isinstance(data['score'], int):
        return error_response('Score should be integer')
    
    username = data['username']
    score = int(data['score'])
    
    cur = get_db().cursor()

    cur.execute("""INSERT INTO leaderboard(username, score) VALUES(?, ?) ON CONFLICT(username) DO UPDATE SET score=MAX(score, excluded.score)""", (username, score))
    get_db().commit()

    return successful_response({"message": "User score updated"})

def successful_response(data):
    resp = {'response': data, 'success': True}
    return jsonify(resp)

def error_response(error_text):
    resp = {'error': error_text, 'success': False}
    return jsonify(resp)
    
if __name__ == "__main__":
    app.run(port=8766)
