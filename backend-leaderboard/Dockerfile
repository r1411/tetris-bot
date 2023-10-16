FROM python:3.9
COPY . /leaderboard
WORKDIR /leaderboard
RUN pip3 install --upgrade pip -r requirements.txt

CMD python init_db.py ; gunicorn -w 2 -b 0.0.0.0:8766 'main:app'
