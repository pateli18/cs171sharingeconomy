from os import environ
from SharingEconomy import app

if __name__ == '__main__': 
	HOST = environ.get('SERVER_HOST', 'localhost')
	try:
		PORT = int(environ.get('SERVER_PORT', '5000'))
	except ValueError:
		PORT = 5000
	app.debug = True
	app.run(HOST, PORT)