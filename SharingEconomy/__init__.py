from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://sifqjaodovjwvo:79526da93f13743a222badeada6d3cf6cd558fba65cf8afa721d0a5b9439aa6b@ec2-54-83-48-188.compute-1.amazonaws.com:5432/d3bkol96g9kokf'
db = SQLAlchemy(app)
db.create_all()
import SharingEconomy.views

if os.environ.get('HEROKU') is not None:
    import logging
    stream_handler = logging.StreamHandler()
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('sharing_economy startup')