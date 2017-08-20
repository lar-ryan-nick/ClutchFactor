const http = require('http');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const {checkUsername, checkPassword, getUserInfo} = require('./databaseFunctions.js');

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

var sessions = {};
//keep cookies as a global var to prevent scoping issues within the switch statement
var cookies = null;

const server = http.createServer(function (request, response) {
	console.log(request.headers.cookie);
	console.log(sessions);
	const path = url.parse(request.url).pathname;
	cookies = parseCookie(request.headers.cookie);
	switch (path) {
		case '/checkUsername':
			checkUsername(url.parse(request.url).query, (taken) => {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write("" + taken);
				response.end();
			});
			break;
		case '/checkPassword':
			let body = "";
			request.on("data", (data) => { body += data; });
			request.on("end", function() {
				checkPassword(body, (userID, valid) => {
					if ((cookies == null || (cookies != null && cookies.sessionid == null) || (cookies != null && cookies.sessionid != null && sessions[cookies.sessionid] == null)) && parseInt(userID) > 0 && valid) {
						let sessionID = crypto.randomBytes(Math.floor(Math.random() * 50 + 1)).toString('hex');
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
