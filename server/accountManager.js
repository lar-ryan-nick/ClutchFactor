const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
const {query} = require('./query.js');

class AccountManager {

	constructor() {
	}

	checkEmail(parameters, cb) {
		if (parameters.email != null) {
			query("SELECT ID FROM Users WHERE Email = $1;", [parameters.email], (error, result) => {
				if (error) {
					console.log(error);
					cb(false);
				} else {
					if (parseInt(result.rowCount) == 1) {
						cb(true);
					} else {
						cb(false);
					}
				}
			});
		} else {
			cb(false);
		}
	}
	
	checkPassword(parameters, cb) {
		if (parameters.email != null && parameters.password != null) {
			query("SELECT ID, Password FROM Users WHERE Email = $1;", [parameters.email], (error, result) => {
				if (error) {
					console.log(error);
					cb(0, false);
					return;
				}
				if (parseInt(result.rowCount) == 1) {
					bcrypt.compare(parameters.password, result.rows[0].password, (err, res) => {
						if (err) {
							console.log(err);
							cb(0, false);
							return;
						}
						cb(parseInt(result.rows[0].id), res);
					});
				} else {
					cb(0, false);
				}
			});
		} else {
			cb(0, false);
		}
	}

	createAccount(parameters, cb) {
		if (parameters.email != null && parameters.password != null) {
			bcrypt.genSalt(saltRounds, function(error, salt) {
				if (error) {
					console.log(error);
					cb(false);
					return;
				}
				bcrypt.hash(parameters.password, salt, () => {}, function(err, hash) {
					if (err) {
						console.log(err);
						cb(false);
						return;
					}
					query("INSERT INTO Users (Email, Password, FirstName, LastName) VALUES ($1, $2, $3, $4);", [parameters.email, hash, parameters.firstName, parameters.lastName], (er, result) => {
						if (er) {
							console.log(er);
							cb(false);
							return;
						}
						cb(true);
					});
				});
			});
		} else {
			cb(false);
		}
	}
}

const accountManager = new AccountManager();

module.exports = {accountManager};
