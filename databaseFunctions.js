const pg = require('pg');
const qs = require('querystring');

const config = {
	"user": "abkqttfnvdbkyi",
	"password": "2e0e89d1e55bafaf04a9eea0045827e5fc0724e8d865796e7796ac3b79534b41",
	"database": "dcccv3fip4tsjm",
	"port": 5432,
	"host": "ec2-107-22-211-182.compute-1.amazonaws.com",
	"ssl": true
}

function parseQuery(parameterString) {
	if (parameterString) {
		let params = parameterString.split('&');
		let parameters = [];
		for (let i = 0; i < params.length; ++i) {
			parameters[params[i].split('=')[0]] = params[i].split('=')[1];
		}
		return parameters;
	}
}

function parseBody(parameterString) {
	if (parameterString) {
		return qs.parse(parameterString);
	}
}

function checkUsername(parameterString, cb) {
	let parameters = parseQuery(parameterString);
	if (parameters) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("SELECT * FROM Users WHERE Username = '" + parameters.username + "';", (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (parseInt(result.rowCount) > 0) {
					cb(true);
				} else {
					cb(false);
				}
			}
			client.end();
		});
	} else {
		cb(false);
	}
}

function checkPassword(parameterString, cb) {
	let parameters = parseBody(parameterString);
	if (parameters) {
		console.log(parameters);
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("SELECT * FROM Users WHERE Username = '" + parameters.username + "' AND Password = '" + parameters.password + "';", (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (parseInt(result.rowCount) > 0) {
					cb(true);
				} else {
					cb(false);
				}
			}
			client.end();
		});
	} else {
		cb(false);
	}
}

module.exports =  {checkUsername, checkPassword};
