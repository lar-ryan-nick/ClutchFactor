const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {checkEmail, checkPassword, getUserInfo, createAccount} = require('./databaseFunctions.js');

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'ryanl.wiener@gmail.com',
		pass: 'P@trick421'
	}
});

function parseCookie(cookie) {
	if (cookie) {
		let vals = cookie.split(";");
		let parsed = {};
		for (let i = 0; i < vals.length; ++i) {
			parsed[vals[i].split("=")[0].substr(1)] = vals[i].split("=")[1];
		}
		return parsed;
	}
	return null;
}

function parseQuery(parameterString) {
	if (parameterString) {
		let params = parameterString.split('&');
		let parameters = {};
		for (let i = 0; i < params.length; ++i) {
			parameters[params[i].split('=')[0]] = params[i].split('=')[1];
		}
		return parameters;
	}
	return null;
}

function parseBody(parameterString) {
	if (parameterString) {
		return qs.parse(parameterString);
	}
	return null;
}

var sessions = {};
var accountIDs ={};
var inverseAccountIDs = {};
var cookies = null;

const server = http.createServer(function (request, response) {
	console.log(request.headers.cookie);
	console.log(sessions);
	cookies = parseCookie(request.headers.cookie);
	let parameters = parseQuery(url.parse(request.url).query);
	let body = "";
	request.on("data", (data) => { body += data; });
	const path = url.parse(request.url).pathname;
	switch (path) {
		case '/createAccount':
			if (parameters != null && accountIDs[parameters.accountID] != null) {
				createAccount(accountIDs[parameters.accountID], function(success) {
					if (success) {
						inverseAcoountIDs[accountIDs[parameters.accountID].email] = null;
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
				if (body != null && body.email != null && body.password != null && body.password.length >= 8 && (cookies == null || cookies.sessionid == null || sessions[cookies.sessionid] == null)) {
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
		case '/checkEmail':
			response.writeHead(200, {"Content-Type": "text/plain"});
			let pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
			if (parameters != null && pattern.test(parameters.email)) {
				checkEmail(parameters, (taken) => {
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
				checkPassword(body, (userID, valid) => {
					if ((cookies == null || cookies.sessionid == null || sessions[cookies.sessionid] == null) && parseInt(userID) > 0 && valid) {
						let sessionID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
						while (sessions[sessionID] != null) {
							sessionID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
						}
						response.writeHead(200, {
							"Content-Type": "text/plain",
							"Set-Cookie": "sessionid=" + sessionID + "; HttpOnly" 
						});
						sessions[sessionID] = userID;
					} else {
						response.writeHead(200, {"Content-Type": "text/plain"});
					}
					response.write("" + valid);
					response.end();
				});
			});
			break;
		case '/getUserInfo':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				getUserInfo(sessions[cookies.sessionid], (info) => {
					response.write(JSON.stringify(info));
					response.end();
				});
			} else {
				response.write(JSON.stringify({}));
				response.end();
			}
			break;
		case '/logOut':
			response.writeHead(200, {"Content-Type": "text/plain"});
			if (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] != null) {
				sessions[cookies.sessionid] = null;
				response.write("Logged Out");
			} else {
				response.write("Not Logged in. Can't Log out");
			}
			response.end();
			break;
		case '/':
			fs.readFile(__dirname + "/index.html", function(error, data){
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
			fs.readFile(__dirname + path, function(error, data){
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
	}
});

server.listen((process.env.PORT || 8000));

console.log("Port: " + (process.env.PORT || 8000));
