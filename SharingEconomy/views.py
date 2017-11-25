from flask import Flask, render_template, request, url_for, redirect, make_response, flash, session, Response
from sqlalchemy import func
from SharingEconomy.models import Vote
import datetime
from SharingEconomy import app, db

@app.route('/' , methods = ['GET', 'POST'])
def main():
	if request.method == 'POST':
		stakeholder = request.json['stakeholder']
		vote = request.json['vote']
		new_vote = Vote(stakeholder = stakeholder, vote = vote)
		db.session.add(new_vote)
		db.session.commit()
		db.session.close()

	votes = {'uber':{'Win':0, 'Lose':0}, 'taxi':{'Win':0, 'Lose':0}, 'consumer':{'Win':0, 'Lose':0}, 'worker':{'Win':0, 'Lose':0}}
	votes_raw = db.session.query(Vote.stakeholder, Vote.vote, func.count(Vote.stakeholder)).group_by(Vote.stakeholder, Vote.vote).all()
	for vote in votes_raw:
		votes[vote[0]][vote[1]] = vote[2]
	return render_template('index.html', votes = votes)