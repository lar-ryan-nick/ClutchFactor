const pg = require('pg');

const config = {
	"user": "abkqttfnvdbkyi",
	"password": "2e0e89d1e55bafaf04a9eea0045827e5fc0724e8d865796e7796ac3b79534b41",
	"database": "dcccv3fip4tsjm",
	"port": 5432,
	"host": "ec2-107-22-211-182.compute-1.amazonaws.com",
	"ssl": true
}

function checkEmail(parameters, cb) {
	if (parameters) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("SELECT ID FROM Users WHERE Email = '" + parameters.email + "';", (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (parseInt(result.rowCount) == 1) {
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

function checkPassword(parameters, cb) {
	if (parameters) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("SELECT ID FROM Users WHERE Email = '" + parameters.email + "' AND Password = '" + parameters.password + "';", (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (parseInt(result.rowCount) == 1) {
					cb(result.rows[0].id, true);
				} else {
					cb(0, false);
				}
			}
			client.end();
		});
	} else {
		cb(0, false);
	}
}

function getUserInfo(userID, cb) {
	userID = parseInt(userID);
	if (userID != NaN) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("SELECT Email, FirstName, LastName, TimeCreated FROM Users WHERE ID = " + userID + ";", (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (parseInt(result.rowCount) == 1) {
					cb(result.rows[0]);
				} else {
					cb({});
				}
			}
			client.end();
		});
	} else {
		cb({});
	}
}

function createAccount(parameters, cb) {
	if (parameters != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
			}
		});
		client.query("INSERT INTO Users (Email, Password, FirstName, LastName) VALUES ('" + parameters.email + "', '" + parameters.password + "', '" + parameters.firstName + "', '" + parameters.lastName + "');", (error, result) => {
			if (error) {
				console.log(error);
				cb(false);
			} else {
				cb(true);
			}
			client.end();
		});
	} else {
		cb(false);
	}
}

module.exports =  {checkEmail, checkPassword, getUserInfo, createAccount};
