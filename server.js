const http = require('http');
const url = require('url');
const fs = require('fs');
const {checkUsername} = require('./databaseFunctions.js');

const server = http.createServer(function (request, response) {
	const path = url.parse(request.url).pathname;
	const query = url.parse(request.url).query.split('&');
	const parameters = [];
	for (var i = 0; i < query.length; ++i) {
		parameters[query[i].split('=')[0]] = query[i].split('=')[1];
	}
	switch (path) {
		case '/checkUsername':
			checkUsername(parameters["username"], (taken) => {
				response.writeHead(200);
				response.write("" + taken);
				response.end();
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
