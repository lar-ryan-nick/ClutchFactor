const pg = require('pg');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

const config = {
	"user": "abkqttfnvdbkyi",
	"password": "2e0e89d1e55bafaf04a9eea0045827e5fc0724e8d865796e7796ac3b79534b41",
	"database": "dcccv3fip4tsjm",
	"port": 5432,
	"host": "ec2-107-22-211-182.compute-1.amazonaws.com",
	"ssl": true
}

function checkEmail(parameters, cb) {
	if (parameters != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb(false);
			} else {
				client.query("SELECT ID FROM Users WHERE Email = '" + parameters.email + "';", (err, result) => {
					if (err) {
						console.log(err);
						cb(false);
					} else {
						if (parseInt(result.rowCount) == 1) {
							cb(true);
						} else {
							cb(false);
						}
					}
					client.end();
				});
			}
		});
	} else {
		cb(false);
	}
}

function checkPassword(parameters, cb) {
	if (parameters != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb(0, false);
			} else {
				client.query("SELECT ID, Password FROM Users WHERE Email = '" + parameters.email + "';", (err, result) => {
					if (err) {
						console.log(err);
						cb(0, false);
					} else {
						if (parseInt(result.rowCount) == 1) {
							bcrypt.compare(parameters.password, result.rows[0].password, function(er, res) {
								if (er) {
									console.log(er);
									cb(0, false);
								} else {
									cb(parseInt(result.rows[0].id), res);
								}
							});
						} else {
							cb(0, false);
						}
					}
					client.end();
				});
			}
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
				cb({});
			} else {
				client.query("SELECT Email, FirstName, LastName, TimeCreated FROM Users WHERE ID = " + userID + ";", (error, result) => {
					if (error) {
						console.log(error);
						cb({});
					} else {
						if (parseInt(result.rowCount) == 1) {
							cb(result.rows[0]);
						} else {
							cb({});
						}
					}
					client.end();
				});
			}
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
				cb(false);
			} else {
				bcrypt.genSalt(saltRounds, function(err, salt) {
					if (err) {
						console.log(err);
						cb(false);
					} else {
						bcrypt.hash(parameters.password, salt, () => {}, function(er, hash) {
							if (er) {
								console.log(er);
								cb(false);
							} else {
								client.query("INSERT INTO Users (Email, Password, FirstName, LastName) VALUES ('" + parameters.email + "', '" + hash + "', '" + parameters.firstName + "', '" + parameters.lastName + "');", (e, result) => {
									if (e) {
										console.log(error);
										cb(false);
									} else {
										cb(true);
									}
									client.end();
								});
							}
						});
					}
				});
			}
		});
	} else {
		cb(false);
	}
}

function getMerchandiseInfo(parameters, cb) {
	if (parameters != null && parameters.index != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb({});
			} else {
				client.query("SELECT DISTINCT modelname FROM Merchandise;", (err, result) => {
					if (err) {
						console.log(error);
						cb({});
					} else {
						if (parseInt(result.rowCount) > parameters.index) {
							client.query("SELECT * FROM Merchandise WHERE modelname = '" + result.rows[parameters.index].modelname + "';", (er, res) => {
								if (er) {
									console.log(error);
									cb({});
								} else {
									if (parseInt(res.rowCount) > 0) {
										let data = res.rows[0];
										let colors = [];
										let ids = [];
										for (let i = 0; i < res.rows.length; ++i) {
											colors[i] = res.rows[i].color;
											ids[i] = res.rows[i].id;
										}
										data.colors = colors;
										data.ids = ids;
										delete data.color;
										cb(data);
									} else {
										cb({});
									}
								}
								client.end();
							});
						} else {
							console.log("Fuck");
							cb({});
						}
					}
				});
			}
		});
	} else {
		console.log("Ass");
		cb({});
	}
}

function getProductInfo(parameters, cb) {
	if (parameters != null && parameters.id != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb({});
			} else {
				client.query("SELECT * FROM Merchandise WHERE id = " + parameters.id + ";", (err, result) => {
					if (err) {
						console.log(error);
						cb({});
					} else {
						if (parseInt(result.rowCount) > 0) {
							client.query("SELECT id, color FROM Merchandise WHERE modelname = '" + result.rows[0].modelname + "';", (er, res) => {
								if (er) {
									console.log(error);
									cb({});
								} else {
									if (parseInt(res.rowCount) > 0) {
										let data = result.rows[0];
										let colors = [];
										let ids = [];
										for (let i = 0; i < res.rows.length; ++i) {
											colors[i] = res.rows[i].color;
											ids[i] = res.rows[i].id;
										}
										data.colors = colors;
										data.ids = ids;
										cb(data);
									} else {
										cb({});
									}
								}
								client.end();
							});
						} else {
							console.log("Fuck");
							cb({});
						}
					}
				});
			}
		});
	} else {
		console.log("Ass");
		cb({});
	}
}

function addToCart(userID, parameters, cb) {
	if (parseInt(userID) > 0 && parameters != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb("Sorry an error occured please try adding to your cart again");
			} else {
				client.query("SELECT id FROM Orders WHERE userid = " + userID + " AND productid = " + parameters.product + ";", (err, result) => {
					if (err) {
						console.log(err);
						cb("Sorry an error occured please try adding to your cart again");
					} else if (parseInt(result.rowCount) == 0) {
						client.query("INSERT INTO Orders (userid, productid) VALUES ('" + userID + "', '" + parameters.product + "');", (er, res) => {
							if (er) {
								console.log(er);
								cb("Sorry an error occured please try adding to your cart again");
							} else {
								cb("The item was successfully added to your cart");
							}
							client.end();
						});
					} else {
						cb("You already have added that item to your cart. If you would like to increase your quantity of that item you can do so at checkout by clicking on the cart icon");
					}
				});
			}
		});
	} else {
		cb(false);
	}
}

function getCartItemInfo(userID, parameters, cb) {
	if (parseInt(userID) > 0 && parameters != null && parseInt(parameters.index) >= 0) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb({});
			} else {
				client.query("SELECT productid FROM Orders WHERE userid = " + userID + ";", (err, result) => {
					if (err) {
						console.log(err);
						cb({});
					} else if (parseInt(result.rowCount) > parameters.index) {
						client.query("SELECT * FROM Merchandise WHERE id = " + result.rows[parameters.index].productid + ";", (er, res) => {
							if (er) {
								console.log(er);
								cb({});
							} else if (parseInt(res.rowCount) > 0) {
								cb(res.rows[0]);
							} else {
								cb({});
							}
							client.end();
						});
					} else {
						cb({});
					}
				});
			}
		});
	} else {
		cb(false);
	}
}

function removeCartItem(userID, parameters, cb) {
	if (parseInt(userID) > 0 && parameters != null && parameters.productID != null) {
		let client = new pg.Client(config);
		client.connect((error) => {
			if (error) {
				console.log(error);
				cb(false);
			} else {
				client.query("DELETE FROM Orders WHERE userid = " + userID + " AND productid = " + parameters.productID + ";", (err, result) => {
					if (err) {
						console.log(err);
						cb(false);
					} else {
						cb(true);
					}
					client.end();
				});
			}
		});
	} else {
		cb(false);
	}
}

module.exports =  {checkEmail, checkPassword, getUserInfo, createAccount, getMerchandiseInfo, getProductInfo, addToCart, getCartItemInfo, removeCartItem};
