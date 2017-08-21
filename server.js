const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {checkEmail, checkPassword, getUserInfo, createAccount} = require('./databaseFunctions.js');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ryanl.wiener@gmail.com',
		pass: 'Patrick4'
	}
});

function parseCookie(cookie) {
	if (cookie) {
		let vals = cookie.split(";");
		let parsed = {};
		for (let i = 0; i < vals.length; ++i) {
			parsed[vals[i].split("=")[0]] = vals[i].split("=")[1];
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
}

function parseBody(parameterString) {
	if (parameterString) {
		return qs.parse(parameterString);
	}
}

var sessions = {};
//keep cookies as a global var to prevent scoping issues within the switch statement
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
			request.on("end", function() {
				console.log(body);
				body = parseBody(body);
				console.log(body);
				if (cookies != null && body != null && body.accountID == cookies.accountid) {
					createAccount(body, function(success) {
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write("" + success);
						response.end();				
					});
				} else {
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write("Sorry this link has expired please try creating an account again");
					response.end();				
				}
			});
			break;
		case '/sendAccountCreationEmail':
			request.on("end", function() {
				if (cookies == null || cookies.sessionid == null) {
					body = parseBody(body);
					let accountID = crypto.randomBytes(Math.floor(Math.random() * 50 + 5)).toString('hex');
					let mailOptions = {
						from: 'ryanl.wiener@gmail.com',
						to: body.email,
						subject: 'Creating your ClutchFactor Account',
						html: `
							<form action=\"https://clutchfactor.herokuapp.com/createAccount\" method=\"post\" target=\"_blank\">
								<input type=\"text\" name=\"accountID\" value=\"` + accountID + `\"/>
								<input type=\"text\" name=\"email\" value=\"` + body.email + `\"/>
								<input type=\"text\" name=\"password\" value=\"` + body.password + `\"/>
								<input type=\"text\" name=\"firstName\" value=\"` + body.firstName + `\"/>
								<input type=\"text\" name=\"lastName\" value=\"` + body.lastName + `\"/>
								<input type=\"submit\" name=\"submit\" value=\"Click here to finish making your account\"/>
							</form>
						`
					}
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							response.writeHead(404);
							console.log(error);
						} else {
							response.writeHead(200, {
								"Content-Type": "text/plain",
								"Set-Cookie": "accountid=" + accountID + "; HttpOnly; Max-Age=1800;"
							});
							console.log('Email sent: ' + info.response);
						}
						response.end();
					});
				} else {
					response.writeHead(404);
					response.end();
				}
			});
			break;
		case '/checkEmail':
			checkEmail(parameters, (taken) => {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write("" + taken);
				response.end();
			});
			break;
		case '/checkPassword':
			request.on("end", function() {
				console.log(body);
				body = parseBody(body);
				console.log(body);
				checkPassword(body, (userID, valid) => {
					if ((cookies == null || (cookies != null && cookies.sessionid == null) || (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] == null)) && parseInt(userID) > 0 && valid) {
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
			//keep response.end() separate to take care of callback function
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
