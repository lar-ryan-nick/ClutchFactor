const http = require('http');
const url = require('url');
const fs = require('fs');
const {checkUsername, checkPassword} = require('./databaseFunctions.js');

const server = http.createServer(function (request, response) {
	const path = url.parse(request.url).pathname;
	switch (path) {
		case '/checkUsername':
			checkUsername(url.parse(request.url).query, (taken) => {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write("" + taken);
				response.end();
			});
			break;
		case '/checkPassword':
			let body = "";
			request.on("data", (data) => { body += data; });
			request.on("end", function() {
				checkPassword(body, (valid) => {
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write("" + valid);
					response.end();
				});
			});
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

console.log((process.env.PORT || 8000));
