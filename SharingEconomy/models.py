import datetime
from SharingEconomy import app, db

class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key = True, nullable = False)
    stakeholder = db.Column(db.Enum('uber', 'taxi', 'consumer', 'worker', name='stakeholders'), nullable = False)
    date_added = db.Column(db.DateTime, default=datetime.datetime.today())
    vote = db.Column(db.Enum('Win', 'Lose', name = 'vote_tag'), nullable = False)

    