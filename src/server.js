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
 *	-> Patryk Jaworski <regalis@regalis.com.pl>
 *	-> Aleksander Gajos <alek.gajos@gmail.com>
 */

var sys = require("sys");
var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");


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
	//        conferences[];
    }
    
}


var conf_counter = 0;
// userID : conferenceID
var conferences = {};


// var clients_register = function(client_id) {
// 	clients[client_id] = false;
// }

// var clients_authenticate = function(client_id, user_id) {
//     // if user already had a socket, update it
//     for (client in clients) {
//         if (clients[client] == user_id) {
//             delete clients[client];
//         }
//     }
// 	clients[client_id] = user_id;
// }

// var clients_exists = function(client_id) {
// 	return (client_id in clients);
// }

// var clients_is_authenticated = function(client_id) {
// 	return (clients_exists(client_id) && clients[client_id] != false);
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
var cm = new clientManager( udb );

var conferenceManager = require("./conferenceManager.js").conferenceManager;
var cfm = new conferenceManager( cm );

var clientHandlers = require("./clientHandlers.js").clientHandlers;
var ch = new clientHandlers( cm, udb, cfm );


// http server
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
    // for( var method in ch ){
    // 	var index = method.search(/Handler/);
    // 	if( index > 0 ){
    // 	    var packetName = method.substr(0, index);
    // 	    console.log("assigning " + method + " to : " + packetName);
    // 	    socket.on( packetName, function(data){
    // 		console.log("handling "+packetName + "with: " + JSON.stringify( data ) );
    // 		ch[ method ]( data, socket );
    // 	    });
    // 	}
    // }


    socket.on("login", function(data){
	ch.loginHandler( data, socket );
    } );

    socket.on("whoAmI", function(data){
	ch.whoAmIHandler( data, socket );
    } );

    socket.on("register", function(data){
	ch.registerHandler( data, socket );
    } );

    socket.on("getUserDataFromId", function(data){
	ch.getUserDataFromIdHandler( data, socket );
    } );

    // temp
    socket.on("getUserDataFromId2", function(data){
	ch.getUserDataFromId2Handler( data, socket );
    } );
    // end temp

    socket.on("searchFriends", function(data){
	ch.searchFriendsHandler( data, socket );
    } );

    socket.on("getFriendsData", function(data){
	ch.getFriendsDataHandler( data, socket );
    } );

    socket.on("chat", function(data){
	ch.chatHandler( data, socket );
    } );

    socket.on("draw", function(data){
	ch.drawHandler( data, socket );
    } );

    
    socket.on("password_change", function(data){
	ch.password_changeHandler( data, socket );
    } );

    socket.on("account_change", function(data){
	ch.account_changeHandler( data, socket );
    } );
     
    socket.on("sendInvitation", function(data){
	ch.sendInvitationHandler( data, socket );
    } );

    socket.on("conf_create", function(data){
	ch.conf_createHandler( data, socket );
    } );
    
    socket.on("conf_request", function(data){
	ch.conf_requestHandler( data, socket );
    } );

    
});

http_server.listen(9393);

/* vim: set ts=4 sw=4 ft=javascript noexpandtab: */
