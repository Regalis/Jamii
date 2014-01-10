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

/*** Clients block ***/

var clients = {};

var clients_register = function(client_id) {
	clients[client_id] = false;
}

var clients_authenticate = function(client_id, user_id) {
	clients[client_id] = user_id;
}

var clients_exists = function(client_id) {
	return (client_id in clients);
}

var clients_is_authenticated = function(client_id) {
	return (clients_exists(client_id) && clients[client_id] != false);
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

/*** Users block ***/

function User() {
	this.id = null;
	this._login = null;
	this._first_name = null;
	this._last_name = null;
	this._password = null;
	this._email = null;
	this._friends_list = [];
	this._requests_list = [];
	this._avatar = null;
	this.availability = null;

	this.export_to_json = function() {
		var json = {};
		for (x in this)  {
			if (x.startsWith('_'))
				json[x.substring(1)] = this[x];
		}
		return JSON.stringify(json);
	}
}

var new_user_from_json = function(json) {
	var obj = JSON.parse(json);
	var user = new User();
	for (x in obj) {
		user['_' + x] = obj[x];
	}
	return user;
}

/*** Database block ***/

/** Class for manipulating users database
 *
 * Used directories:
 *   -> var/users/
 * Used files:
 *   -> var/users/$ID
 *   -> var/users/logins
 */
function UsersDatabase() {
	var db_path = path.join(process.cwd(), "/var/users");
	var validate_user = function(user) {
		// TODO: perform full validation
		if (isNaN(user.id))
			throw "Bad user id";
	}

	this.save_user_data = function(user) {
		validate_user(user);
		fs.writeFileSync(path.join(db_path, user.id.toString()), user.export_to_json(), 'utf8', function(err) {
			if (err)
				throw err;
		});
		return true;
	}
	
	this.read_user_data = function(user_id) {
		var json = fs.readFileSync(path.join(db_path, user_id.toString()), 'utf8');
		if (!json)
			throw "Unable to read user data...";
		if (Buffer.isBuffer(json))
			json = json.toString('utf8');
		return new_user_from_json(json);
	}

}

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
	console.info("Got new WebSocket connection (" + socket.id + ")...");
	clients_register(socket.id);
	socket.on('ping', function(data) {
		console.log("Got ping command from client...");
		socket.emit("pong", data);
		console.log("Sending pong...");
	});
	
});

http_server.listen(9393);
