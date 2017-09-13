const {query} = require('./query.js');

class Admin {

	constructor(userID) {
		this.userID = userID;
	}

	getNumOrders(userID, cb) {
		if (parseInt(userID) > 0) {
			let client = new pg.Client(config);
			client.connect((error) => {
				if (error) {
					console.log(error);
					cb("0");
				} else {
					client.query("SELECT id FROM Orders;", [], (err, result) => {
						if (err) {
							console.log(err);
							cb("0");
						} else {
							cb(result.rowCount);
						}
						client.end();
					});
				}
			});
		} else {
			cb("-1");
		}
	}
	
	getOrderInfo(userID, parameters, cb) {
		if (parseInt(userID) > 0 && parameters != null && parseInt(parameters.index) >= 0) {
			let client = new pg.Client(config);
			client.connect((error) => {
				if (error) {
					console.log(error);
					cb({});
				} else {
					client.query("SELECT * FROM Orders;", [], (err, result) => {
						if (err) {
							console.log(err);
							cb({});
						} else if (parseInt(result.rowCount) > parameters.index) {
							cb(result.rows[parameters.index]);
						} else {
							cb({});
						}
						client.end();
					});
				}
			});
		} else {
			cb({});
		}
	}
}

module.exports = {Admin};
