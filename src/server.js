/*
 *
 * Copyright (C) Jamii Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * Contributors:
 *  -> Patryk Jaworski <regalis@regalis.com.pl>
 *
 */

var sys = require("sys");
var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

var http_server = http.createServer(function(request, response) {
	var requested_path = url.parse(request.url).pathname;
	if (requested_path == "/" || requested_path.startsWith("../") || requested_path.startsWith("/..") || requested_path.startsWith("//")) {
		requested_path = "/index.xhtml";
	}
	console.info("New file request: " + requested_path);
	var server_path = path.join(process.cwd(), "/srv/http", requested_path);
	console.info("server_path: " + server_path);
	fs.exists(server_path, function(exists) {
		if (!exists) {
			response.writeHeader(404, {"Content-type": "text/html"});
			response.write("<h1>404 Not found</h1>\n");
			response.end();
		} else {
			fs.readFile(server_path, "binary", function(err, file) {
				if (err) {
					response.writeHeader(500, {"Content-type": "text/html"});
					response.write("<h1>500 Internal server error... Or bad request...</h1>\n");
					response.end();
				} else {
					response.writeHeader(200);
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
})

var io = require("socket.io").listen(http_server);

io.sockets.on("connection", function(socket) {
	console.info("Got new WebSocket connection...");
	socket.on('ping', function(data) {
		console.log("Got ping command from client...");
		socket.emit("pong", data);
		console.log("Sending pong...");
	});
});

http_server.listen(9393);
