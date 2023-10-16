import sqlite3

connection = sqlite3.connect('/etc/leaderboard-data/leaderboard.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

connection.commit()
connection.close()