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
* -> Patryk Jaworski <regalis@regalis.com.pl>
* -> Aleksander Gajos <alek.gajos@gmail.com>
*/

var sys = require("sys");
var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");
var signaller = require("./signaller.js");
signaller();

/**
* Conference class
*/
function conference(conf_id) {

	this.id = conf_id;
	this.participants = [];
	this.is_active = false;
	
	this.add_participant = function(id) {
		this.participants.push(id);
		// TODO: abort if user already in a conference
// conferences[];
	}
	
}


var conf_counter = 0;
// userID : conferenceID
var conferences = {};


// var clients_register = function(client_id) {
// clients[client_id] = false;
// }

// var clients_authenticate = function(client_id, user_id) {
// // if user already had a socket, update it
// for (client in clients) {
// if (clients[client] == user_id) {
// delete clients[client];
// }
// }
// clients[client_id] = user_id;
// }

// var clients_exists = function(client_id) {
// return (client_id in clients);
// }

// var clients_is_authenticated = function(client_id) {
// return (clients_exists(client_id) && clients[client_id] != false);
// }

String.prototype.startsWith = function(prefix) {
return this.indexOf(prefix) === 0;
}

String.prototype.endsWith = function(suffix) {
return this.match(suffix+"$") == suffix;
};


// some "global" objects
var usersDatabase = require("./usersDatabase.js").UsersDatabase;
var User = require("./usersDatabase.js").User;
var udb = new usersDatabase();

var clientManager = require("./clientManager.js").clientManager;
var cm = new clientManager(udb);

var conferenceManager = require("./conferenceManager.js").conferenceManager;
var cfm = new conferenceManager(cm);

var clientHandlers = require("./clientHandlers.js").clientHandlers;
var ch = new clientHandlers(cm, udb, cfm);


// http server
var http_server = http.createServer(function(request, response) {
	var requested_path = url.parse(request.url).pathname;
	console.info("[HTTP] New request: " + requested_path);

	if (requested_path.startsWith("/get_file/")) {
		http_conference_share_file_handler(request, response);
	} else {
		http_static_file_handler(request, response);
	}

});

var http_parse_cookies = function(request) {
	var list = {}, rc = request.headers.cookie;

	rc && rc.split(';').forEach(function(cookie) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = unescape(parts.join('='));
	});

	return list;
}

var http_conference_share_file_handler = function(request, response) {
	var requested_path = url.parse(request.url).pathname;
	console.log("[HTTP] Requested conference file: " + requested_path);
	
	/* Parse request */
	var request_parts = requested_path.split("/");
	var conference_id = request_parts[2];
	var file_name = request_parts[3];

	console.log("request_parts: " + JSON.stringify(request_parts));
	console.log("[HTTP] Requested file '" + file_name + "' from conference #" + conference_id);
	
	/* Validate user */
	cookies = http_parse_cookies(request);
	if ((!"sessionID" in cookies) || (!"userID" in cookies)) {
		console.log("[HTTP] Invalid cookies");
		http_error_404(request, response);
		return;
	}
	/* TODO: Validate session! */

	/* Check if user is conference member */
	console.log("[HTTP] Cookies: " + JSON.stringify(cookies));					
	/* TODO: check specified conference ID! */
	/*if (!cfm.is_in_conf(cookies["userID"])) {
		console.log("[HTTP] User is not a conference member");
		http_error_404(request, response);
		return;
	}*/

	/* Check if file is available */
	if (!cfm.file_exists(conference_id, file_name)) {
		console.log("[HTTP] Requested file does not exist in conference");
		http_error_404(request, response);
		return;
	}
	
	/* Read file */
	var file_buffer = new Buffer(cfm.get_file(conference_id, file_name), "base64");

	/* Send file */
	/* TODO: get content-type from file */
	response.writeHeader(200, {
		"Content-type": "application/ocet-stream",
		"Content-length": file_buffer.length.toString(),
		"Content-Disposition": 'attachment; filename="' + file_name + '"'
		});
	response.write(file_buffer, "binary");
	response.end();
}

var http_error_404 = function(request, response) {
	response.writeHeader(404, {"Content-type": "text/html"});
	response.write("<h1>404 Not found</h1>\n");
	response.end();
}

var http_static_file_handler = function(request, response) {
	var requested_path = url.parse(request.url).pathname;
	if (requested_path == "/" || requested_path.startsWith("../") ||
			requested_path.startsWith("/..") || requested_path.startsWith("//")) {
		requested_path = "/index.xhtml";
	}
	console.log("[HTTP] Filtered static file request: " + requested_path);
	var server_path = path.join(process.cwd(), "/srv/http", requested_path);
	console.info("[HTTP] Server_path: " + server_path);
	fs.exists(server_path, function(exists) {
		if (!exists) {
			http_error_404(request, response);
		} else {
			fs.readFile(server_path, "binary", function(err, file) {
				if (err) {
					response.writeHeader(500, {"Content-type": "text/html"});
					response.write("<h1>500 Internal server error... Or bad request...</h1>\n");
					response.end();
				} else {
					headers = {};
					if (requested_path.endsWith("html")) {
						headers["Content-type"] = "text/html; charset=utf-8";
						headers["Content-type"] = "application/xhtml+xml; charset=utf-8";
						console.log("[HTTP] Serving html as application/xhtml+xml");
					}
					response.writeHeader(200, headers);
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
}

// sockets
var io = require("socket.io").listen(http_server);

io.sockets.on("connection", function(socket) {
	
	console.info("Got new WebSocket connection (" + socket.id + ")...");
	// do not do anything special on base connection
	
	// ping for testing
	socket.on('ping', function(data) {
		console.log("Got ping command from client...");
		socket.emit("pong", data);
		console.log("Sending pong...");
	});
	
	// set handlers for communication with clients
	
	// automatically find all handlers in the clientHandlers object, reject the "Handler" suffix and set them to handle respective packet names
	// for(var method in ch) {
	// var index = method.search(/Handler/);
	// if(index > 0) {
	// var packetName = method.substr(0, index);
	// console.log("assigning " + method + " to : " + packetName);
	// socket.on(packetName, function(data) {
	// console.log("handling "+packetName + "with: " + JSON.stringify(data));
	// ch[ method ](data, socket);
	// });
	// }
	// }


	socket.on("login", function(data) {
		ch.loginHandler(data, socket);
	});

	socket.on("whoAmI", function(data) {
		ch.whoAmIHandler(data, socket);
	});

	socket.on("register", function(data) {
		ch.registerHandler(data, socket);
	});

	socket.on("getUserDataFromId", function(data) {
		ch.getUserDataFromIdHandler(data, socket);
	});

	//temp
	socket.on("getUserDataFromId2", function(data) {
		ch.getUserDataFromIdHandler2(data, socket);
	});
	//end temp

	socket.on("searchFriends", function(data) {
		ch.searchFriendsHandler(data, socket);
	});

	socket.on("get_users_data", function(data) {
		ch.get_users_dataHandler(data, socket);
	});

	socket.on("chat_message", function(data) {
		ch.chat_messageHandler(data, socket);
	});

	socket.on("draw", function(data) {
		ch.drawHandler(data, socket);
	});

	socket.on("password_change", function(data) {
		ch.password_changeHandler(data, socket);
	});

	socket.on("account_change", function(data) {
		ch.account_changeHandler(data, socket);
	});

	socket.on("avatar_change", function(data) {
		ch.avatar_changeHandler(data, socket);
	});
	 
	socket.on("sendInvitation", function(data) {
		ch.sendInvitationHandler(data, socket);
	});

	socket.on("invitationResponse", function(data) {
		ch.invitationResponseHandler(data, socket);
	});

	socket.on("conference_start", function(data) {
		ch.conference_startHandler(data, socket);
	});

	socket.on("conference_invitation", function(data) {
		ch.conference_invitationtHandler(data, socket);
	});

	socket.on("conference_invitation_response", function(data) {
		ch.conference_invitation_responseHandler(data, socket);
	});

	socket.on("send_file", function(data) {
		ch.send_fileHandler(data, socket);
	});

	socket.on("removeFriend", function(data) {
		ch.removeFriendHandler(data, socket);
	});

	socket.on("remindPassword", function(data) {
		ch.remindPasswordHandler(data, socket);
	});
	
});

http_server.listen(9393);

/* vim: set ts=4 sw=4 ft=javascript noexpandtab: */
