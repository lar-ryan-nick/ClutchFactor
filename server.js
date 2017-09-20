const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const braintree = require('braintree');
const {accountManager} = require('./server/accountManager.js');
const {Admin} = require('./server/admin.js');
const {merchandiseManager} = require('./server/merchandiseManager.js');
const {User} = require('./server/user.js');

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.CLUTCH_FACTOR_EMAIL,
		pass: process.env.CLUTCH_FACTOR_EMAIL_PASSWORD
	}
});

const gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "rg9qk5pr8gxzrjtv",
	publicKey: "f253vqj59cdsj9pj",
	privateKey: "9663ac111bcb05346919975681960d75"
});

function parseCookie(cookie) {
	if (cookie != null) {
		let vals = cookie.split(";");
		let parsed = {};
		for (let i = 0; i < vals.length; ++i) {
			if (i > 0) {
				parsed[vals[i].split("=")[0].substr(1)] = vals[i].split("=")[1];
			} else {
				parsed[vals[i].split("=")[0]] = vals[i].split("=")[1];
			}
		}
		return parsed;
	}
	return {};
}

function parseQuery(parameterString) {
	if (parameterString != null) {
		let params = parameterString.split('&');
		let parameters = {};
		for (let i = 0; i < params.length; ++i) {
			parameters[params[i].split('=')[0]] = params[i].split('=')[1];
		}
		return parameters;
	}
	return {};
}

function parseBody(parameterString) {
	if (parameterString != null) {
		return qs.parse(parameterString);
	}
	return {};
}

var sessions = {};
var accountIDs = {};
var inverseAccountIDs = {};

const server = http.createServer(function (request, response) {
	//console.log(sessions);
	let cookies = parseCookie(request.headers.cookie);
	console.log(cookies.cart);
	console.log(cookies);
	if (sessions[cookies.sessionid] != null) {
		clearTimeout(sessions[cookies.sessionid].timeout);
		sessions[cookies.sessionid].timeout = setTimeout(function(sessionid) { delete sessions[sessionid]; }, 3600000, cookies.sessionid);
	}
	let parameters = parseQuery(url.parse(request.url).query);
	let body = "";
	request.on("data", (data) => { body += data; });
	const path = url.parse(request.url).pathname;
	switch (path) {
		case '/createAccount':
			if (parameters != null && accountIDs[parameters.accountID] != null) {
				accountManager.createAccount(accountIDs[parameters.accountID], function(success) {
					if (success) {
						inverseAccountIDs[accountIDs[parameters.accountID].email] = null;
						accountIDs[parameters.accountID] = null;
						response.writeHead(301, {"Location": "/account.html"});
					} else {
						response.writeHead(200, {"Content-Type": "text/plain",});
						response.write("Sorry your account was not created properly please try again.");
					}
					response.end();
				});
			} else {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write("Sorry this link has either expired please try creating your account again");
				response.end();
			}
			break;
		case '/sendAccountCreationEmail':
			request.on("end", function() {
				body = parseBody(body);
				if (body.email != null && body.password != null && body.password.length >= 8 && (cookies.sessionid == null || sessions[cookies.sessionid] == null)) {
					if (inverseAccountIDs[body.email] != null) {
						accoundIDs[inverseAccountIDs[body.email]] = null;
						inverseAccountIDs[body.email] = null;
					}
					let accountID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
					while (accountIDs[accountID] != null) {
						accountID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
					}
					accountIDs[accountID] = body;
					inverseAccountIDs[body.email] = accountID;
					setTimeout((id) => {
						if (accountIDs[id] != null) {
							inverseAccountIDs[accountIDs[id].email] = null;
							accountIDs[id] = null;
						}
					}, 1800000, accountID);
					let firstName = body.firstName;
					if (firstName == null) {
						firstName = "";
					} else {
						firstName = " " + firstName;
					}
					let lastName = body.lastName;
					if (lastName == null) {
						lastName = "";
					} else {
						lastName = " " + lastName;
					}
					let mailOptions = {
						from: 'ryanl.wiener@gmail.com',
						to: body.email,
						subject: 'Creating your ClutchFactor Account',
						html: `
							<p>Hello` + firstName + lastName + `,</P>
							<a href=\"https://clutchfactor.herokuapp.com/createAccount?accountID=` + accountID + `\">Click here to finish creating your account</button>
						`
					}
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							response.writeHead(404);
							console.log(error);
						} else {
							response.writeHead(200, {"Content-Type": "text/plain",});
							console.log('Email sent: ' + info.response);
						}
						response.end();
					});
				} else {
					response.writeHead(404);
					console.log("Email and password not valid");
					response.end();
				}
			});
			break;
		case '/getClientToken':
			response.writeHead(200, {"Content-Type": "text/plain"});
			gateway.clientToken.generate({}, function(error, res) {
				if (error != null) {
					console.log(error);
				} else {
					response.write(res.clientToken);
				}
				response.end();
			});
			break;
		case '/checkout':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				request.on("end", function() {
					body = parseBody(body);
					let payload = JSON.parse(body.payload);
					sessions[cookies.sessionid].user.getOrderTotal(function(total) {
						if (total > 0) {
							gateway.transaction.sale({
								amount: total,
								paymentMethodNonce: payload.nonce,
								options: {
									submitForSettlement: true
								}
							}, function (error, res) {
								if (error != null) {
									console.log(error);
								} else {
									console.log(res);
									if (res.success) {
										response.write("successful. User has been charged $" + total);
									} else {
										response.write("We were unable to charge your card properly. Please try again");
									}
								}
								response.end();
							});
						}
					});
				});
			} else {
				response.end();
			}
			break;
		case '/checkEmail':
			response.writeHead(200, {"Content-Type": "text/plain"});
			let pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
			if (pattern.test(parameters.email)) {
				accountManager.checkEmail(parameters, (taken) => {
					if (taken) {
						response.write("That email has already been registered");
					} else {
						response.write("That email has not been registered yet");
					}
					response.end();
				});
			} else {
				response.write("Please enter a valid email address");
				response.end();
			}
			break;
		case '/checkPassword':
			request.on("end", function() {
				body = parseBody(body);
				accountManager.checkPassword(body, (userID, valid) => {
					if ((cookies.sessionid == null || sessions[cookies.sessionid] == null) && parseInt(userID) > 0 && valid) {
						let sessionID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
						while (sessions[sessionID] != null) {
							sessionID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
						}
						let user = new User(userID);
						let timeOut = setTimeout(function(sessionid) {delete sessions[sessionid];}, 3600000, sessionID);
						sessions[sessionID] = {
							user: user,
							timeout: timeOut
						};
						if (cookies.cart != null) {
							cookies.cart = JSON.parse(cookies.cart);
							let completed = 0;
							for (let i = 0; i < cookies.cart.length; ++i) {
								user.addToCart({productid: cookies.cart[i]}, (result) => {
									++completed;
									if (completed >= cookies.cart.length) {
										user.getCart((cart) => {
											response.writeHead(200, {
												"Content-Type": "text/plain",
												"Set-Cookie": "cart=" + JSON.stringify(cart) + "; HttpOnly; Max-Age=2592000",
												"Set-Cookie": "sessionid=" + sessionID + "; HttpOnly"
											});
											response.write("" + valid);
											response.end();
										});
									}
								});
							}
							if (cookies.cart.length == 0) {
								user.getCart((cart) => {
									response.writeHead(200, {
										"Content-Type": "text/plain",
										"Set-Cookie": "cart=" + JSON.stringify(cart) + "; HttpOnly; Max-Age=2592000",
										"Set-Cookie": "sessionid=" + sessionID + "; HttpOnly"
									});
									response.write("" + valid);
									response.end();
								});
							}
						} else {
							response.writeHead(200, {
								"Content-Type": "text/plain",
								"Set-Cookie": "sessionid=" + sessionID + "; HttpOnly" 
							});
							response.write("" + valid);
							response.end();
						}
					} else {
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write("" + valid);
						response.end();
					}
				});
			});
			break;
		case '/getUserInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				sessions[cookies.sessionid].user.getUserInfo((info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else {
				response.write(JSON.stringify({}));
				response.end();
			}
			break;
		case '/getNumCartItems':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				sessions[cookies.sessionid].user.getNumCartItems((num) => {
					response.write("" + num);
					response.end();
				});
			} else if (cookies.cart != null) {
			   cookies.cart = JSON.parse(cookies.cart);
			   response.write("" + cookies.cart.length);
			   response.end();
			} else {
				response.write("0");
				response.end();
			}
			break;
		case '/getCartItemInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && parameters != null && parseInt(parameters.index) >= 0) {
				sessions[cookies.sessionid].user.getCartItemInfo(parameters, (info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else if (cookies.cart != null && cookies.cart.length > parameters.index) {
				cookies.cart = JSON.parse(cookies.cart);
				parameters.id = cookies.cart[parameters.index];
				merchandiseManager.getProductInfo(parameters, (info) => {
					info.productid = info.id;
					info.id = null;
					response.write(JSON.stringify(info));
					response.end();
				});			
			} else {
				response.write(JSON.stringify({}));
				response.end();
			}
			break;
		case '/addToCart':
			if (cookies.cart != null) {
				cookies.cart = JSON.parse(cookies.cart);
				cookies.cart.push(parameters.productid);
				response.writeHead(200, {
					"Content-Type": "text/plain",
					"Set-Cookie": "cart=" + JSON.stringify(cookies.cart) + "; HttpOnly; Max-Age=2592000"
				});
			} else {
				response.writeHead(200, {
					"Content-Type": "text/plain",
					"Set-Cookie": "cart=" + JSON.stringify([parameters.productid]) + "; HttpOnly; Max-Age=2592000"
				});
			}
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && parameters != null && parameters.productid != null) {
				sessions[cookies.sessionid].user.addToCart(parameters, (result) => {
					response.write(result);
					response.end();
				});
			} else {
				response.write("The item was successfully added to your cart");
				response.end();
			}
			break;
		case '/removeCartItem':
			if (cookies.cart != null) {
				cookies.cart = JSON.parse(cookies.cart);
				for (let i = 0; i < cookies.cart.length; ++i) {
					if (cookies.cart[i] == parameters.productid) {
						cookies.cart.splice(i, 1);
						break;
					}
				}
				response.writeHead(200, {
					"Content-Type": "text/plain",
					"Set-Cookie": "cart=" + JSON.stringify(cookies.cart) + "; HttpOnly; Max-Age=2592000"
				});
			} else {
				response.writeHead(200, {"Content-Type": "text/plain"});
			}
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && parameters != null && parameters.productid != null) {
				sessions[cookies.sessionid].user.removeCartItem(parameters, (deleted) => {
					if (deleted) {
						response.write("Removed the cart item successfully");
					} else {
						response.write("Was not able to remove from the cart");
					}
					response.end();
				});
			} else {
				response.write("Removed the cart item successfully");
				response.end();
			}
			break;
		case '/getNumMerchandise':
			response.writeHead(200, {"Content-Type": "text/plain"});
			merchandiseManager.getNumMerchandise((num) => {
				response.write("" + num);
				response.end();
			});
			break;
		case '/getMerchandiseInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (parameters != null) {
				merchandiseManager.getMerchandiseInfo(parameters, (info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else {
				response.write("Please enter the correct information");
				response.end();
			}
			break;
		case '/getProductInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (parameters != null) {
				merchandiseManager.getProductInfo(parameters, (info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else {
				response.write("Please enter the correct information");
				response.end();
			}
			break;
		case '/getNumAddresses':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				sessions[cookies.sessionid].user.getNumAddresses((num) => {
					response.write("" + num);
					response.end();
				});
			} else {
				response.write("-1");
				response.end();
			}
			break;
		case '/getAddressInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && parameters != null && parseInt(parameters.index) >= 0) {
				sessions[cookies.sessionid].user.getAddressInfo(parameters, (info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else {
				response.write(JSON.stringify({}));
				response.end();
			}
			break;
		case '/addAddress':
			response.writeHead(200, {"Content-Type": "text/plain"});
			request.on("end", function() {
				body = parseBody(body);
				if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && body != null) {
					sessions[cookies.sessionid].user.addAddress(body, (result) => {
						response.write(result);
						response.end();
					});
				} else {
					response.write("You must log in first to add an address");
					response.end();
				}
			});
			break;
		case '/removeAddress':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null && parameters != null && parameters.id != null) {
				sessions[cookies.sessionid].user.removeAddress(parameters, (deleted) => {
					if (deleted) {
						response.write("Removed the address successfully");
					} else {
						response.write("Was not able to remove the address");
					}
					response.end();
				});
			} else {
				response.write("Please log in or enter a valid address");
				response.end();
			}
			break;
		case '/logOut':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				delete sessions[cookies.sessionid];
				response.write("Logged Out");
			} else {
				response.write("Not Logged in. Can't Log out");
			}
			response.end();
			break;
		case '/':
			fs.readFile(__dirname + "/client/html/index.html", function(error, data){
				if (error) {
					response.writeHead(404);
					response.write("Sorry this page does not exist")
					response.end();
				} else {
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			});
			break;
		default:
			let folder = "/" + path.substr(path.lastIndexOf(".") + 1);
			if (folder == "/jpg" || folder == "/jpeg" || folder == "/png") {
				folder = "/images";
			}
			folder = "/client" + folder;
			fs.readFile(__dirname + folder + path, function(error, data){
				if (error) {
					response.writeHead(404);
					response.write("Sorry this page does not exist")
					response.end();
				} else {
					let type = path.substr(path.lastIndexOf(".") + 1);
					if (type == "js") {
						type = "text/javascript";
					} else if (type == "jpeg" || type == "png") {
						type = "image/" + type;
					} else if (type == "jpg") {
						type = "image/jpeg"
					} else if (type == "jsx") {
						type = "text/plain";
					} else {
						type = "text/" + type;
					}
					response.writeHead(200, {"Content-Type": type});
					response.write(data, "utf8");
					response.end();
				}
			});
			break;
	}
});

server.listen((process.env.PORT || 8000));

console.log("Port: " + (process.env.PORT || 8000));
