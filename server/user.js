const {query} = require('./query.js');

class User {

	constructor(userID) {
		this.userID = userID;
	}

	getUserInfo(cb) {
		if (parseInt(this.userID) > 0) {
			query("SELECT Email, FirstName, LastName, TimeCreated FROM Users WHERE ID = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				}
				if (parseInt(result.rowCount) == 1) {
					cb(result.rows[0]);
				} else {
					cb({});
				}
			});
		} else {
			cb({});
		}
	}
	
	addToCart(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null) {
			query("SELECT id FROM Cart WHERE userid = $1 AND productid = $2;", [this.userID, parameters.product], (error, result) => {
				if (error) {
					console.log(error);
					cb("Sorry an error occured please try adding to your cart again");
					return;
				}
				if (parseInt(result.rowCount) == 0) {
					query("INSERT INTO Cart (userid, productid) VALUES ($1, $2);", [this.userID, parameters.product], (err, res) => {
						if (err) {
							console.log(err);
							cb("Sorry an error occured please try adding to your cart again");
							return;
						}
						cb("The item was successfully added to your cart");
					});
				} else {
					cb("You already have added that item to your cart. If you would like to increase your quantity of that item you can do so at checkout by clicking on the cart icon");
				}
			});
		} else {
			cb("please supply more information");
		}
	}
	
	getNumCartItems(cb) {
		if (parseInt(this.userID) > 0) {
			query("SELECT id FROM Cart WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("0");
					return;
				}
				cb(result.rowCount);
			});
		} else {
			cb("-1");
		}
	}
	
	getCartItemInfo(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null && parseInt(parameters.index) >= 0) {
			query("SELECT id, userid, productid FROM Cart WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				} 
				if (parseInt(result.rowCount) > parameters.index) {
					query("SELECT * FROM Merchandise WHERE id = $1;", [result.rows[parameters.index].productid], (err, res) => {
						if (err) {
							console.log(err);
							cb({});
							return;
						}
						if (parseInt(res.rowCount) > 0) {
							let data = res.rows[0];
							data.id = result.rows[parseInt(parameters.index)].id;
							data.userid = result.rows[parseInt(parameters.index)].userid;
							data.productid = result.rows[parseInt(parameters.index)].productid;
							cb(data);
						} else {
							cb({});
						}
					});
				} else {
					cb({});
				}
			});
		} else {
			cb({});
		}
	}
	
	removeCartItem(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null && parameters.id != null) {
			query("DELETE FROM Cart WHERE userid = $1 AND id = $2;", [this.userID, parameters.id], (error, result) => {
				if (error) {
					console.log(error);
					cb(false);
					return;
				}
				if (parseInt(result.rowCount) > 0) {
					cb(true);
				} else {
					cb(false);
				}
			});
		} else {
			cb(false);
		}
	}
	
	getOrderTotal(cb) {
		if (parseInt(this.userID) > 0) {
			query("SELECT price FROM Merchandise WHERE id = (SELECT productid FROM Cart WHERE userid = $1);", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("-1");
					return;
				}
				let total = 0;
				for (let i = 0; i < result.rowCount; ++i) {
					total += parseInt(result.rows[i].price);
				}
				cb(total);
			});
		} else {
			cb("-1");
		}
	}
	
	addAddress(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null) {
			query("SELECT id FROM Addresses WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("Sorry an error occured please try adding your address again");
					return;
				}
				if (parseInt(result.rowCount) < 5) {
					query("INSERT INTO Addresses (userid, receiver, addressline1, addressline2, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7);", [this.userID, parameters.receiver, parameters.addressLine1, parameters.addressLine2, parameters.city, parameters.state, parameters.zip], (err, res) => {
						if (err) {
							console.log(err);
							cb("Sorry an error occured please try adding your address again");
							return;
						}
						cb("The address was successfully added to your list");
					});
				} else {
					cb("You can't add more than 5 different addresses under the same account");
				}
			});
		} else {
			cb("Must supply more information");
		}
	}
	
	getNumAddresses(cb) {
		if (parseInt(this.userID) > 0) {
			query("SELECT id FROM Addresses WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("0");
					return;
				}
				cb(result.rowCount);
			});
		} else {
			cb("-1");
		}
	}
	
	getAddressInfo(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null && parseInt(parameters.index) >= 0) {
			query("SELECT * FROM Addresses WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				}
				if (parseInt(result.rowCount) > parameters.index) {
					cb(result.rows[parameters.index]);
				} else {
					cb({});
				}
			});
		} else {
			cb({});
		}
	}
	
	removeAddress(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null && parameters.id != null) {
			query("DELETE FROM Addresses WHERE userid = $1 AND id = $2;", [this.userID, parameters.id], (error, result) => {
				if (error) {
					console.log(error);
					cb(false);
					return;
				}
				if (parseInt(result.rowCount) > 0) {
					cb(true);
				} else {
					cb(false);
				}
				client.end();
			});
		} else {
			cb(false);
		}
	}
	
	completeOrder(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null) {
			query("DELETE FROM Cart WHERE userid = $1 RETURNING productid;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("Sorry an error occured please try adding your Order again");
					return;
				}
				if (parseInt(result.rowCount) > 0) {
					let completionCount = 0;
					for (let i = 0; i < result.rows.length; ++i) {
						query("INSERT INTO Orders (userid, productid, payment) VALUES ($1, $2, $3);", [this.userID, result.rows[i].productid, parameters.payment], (err, res) => {
							if (err) {
								console.log(err);
								cb("Sorry an error occured please try adding your order again");
								return;
							}
							++completionCount;
							if (completionCount >= result.rows.length) {
								cb("The order was successfully created");
							}
						});
					}
				} else {
					cb("There is nothing in your cart to finalize an order for");
				}
			});
		} else {
			cb("Must supply more information");
		}
	}
	
	getNumUserOrders(cb) {
		if (parseInt(this.userID) > 0) {
			query("SELECT id FROM Orders WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb("0");
					return;
				}
				cb(result.rowCount);
			});
		} else {
			cb("-1");
		}
	}
	
	getOrderInfo(parameters, cb) {
		if (parseInt(this.userID) > 0 && parameters != null && parseInt(parameters.index) >= 0) {
			query("SELECT * FROM Orders WHERE userid = $1;", [this.userID], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				}
				if (parseInt(result.rowCount) > parameters.index) {
					cb(result.rows[parameters.index]);
				} else {
					cb({});
				}
				client.end();
			});
		} else {
			cb({});
		}
	}
}

module.exports = {User};
