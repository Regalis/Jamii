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

/*** Clients block ***/

var clients = {};

var sessionCounter = 0;
// dict: sessionID : socketID
var sessions = {};

/**
 * Conference class
*/
function conference(conf_id){

    this.id = conf_id;
    this.participants = [];
    this.is_active = false;
    
    this.add_participant = function(id){
        this.participants.push( id );
        // TODO: abort if user already in a conference
//        conferences[];
    }
    
}


var conf_counter = 0;
// userID : conferenceID
var conferences = {};



var  start_session = function(socket_object){
	sessionCounter++;
	sessions[ sessionCounter ] =  socket_object;
	return sessionCounter;
}

var get_user_by_session = function( session_id ){
	return clients[sessions[session_id].id]; 
}


/** 
	Function to retreieve data object from object received by a socket
	Could do some additional checking for session ID if necesary.

	@param cargo object received directly by a socket
	@return data object taken from cargo object
*/
var  strip_data_object = function(cargo){
	var data = cargo["data"];
	return data;
}

/** 
	dummy function imitating checking login data

	@param data data object received with the "login" packet
	@return userID if user exists and login OK, -1=no user with login, -2=wrong passwd
*/
var user_login = function(data){
    
	var user = udb.findUsers( "login",	data.login );
	if( Object.keys( user ).length != 1 ){
	    return -1;
	}
	var user_id = Object.keys( user )[0];
	if( data.passwd ==	user[ user_id ]._password && typeof data.passwd != 'undefined' ){
	    console.info("User " + user[ user_id ]._login + " successfully logged in" );
	    return user_id;
	}else{
	    return -2;
	}
	return 1; 
}

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
	this._registration_date = null;
	this.availability = null;

	/** Export User data to JSON string
	 * This function will export only params which
	 * start with '_';
	 *
	 * Object could be restored by using new_user_from_json()
	 *
	 * @return JSON string representing current object
	 */
	this.export_to_json = function() {
		var json = {};
		for (x in this)  {
			if (x.startsWith('_')) {
				json[x.substring(1)] = this[x];
			}
		}
		return JSON.stringify(json);
	}

	/** Export copy of stripped current User data
	 * New object has all fields except of:
	 * 	* password, requests_list, registration_date
	 *
	 * All fields ale present without the '_' prefix.
	 *
	 * @return stripped User data
	 */
	this.strip_object = function() {
		var tmp = new Object();
		tmp['id'] = this.id;

		for (x in this) {
			if (x.startsWith('_')) {
				if (!(x in ['_password', '_registration_date', '_requests_list'])) {
					tmp[x.substring(1)] = this[x];
				}
			}
		}
		return tmp;
	}
}

/** Create instance of class User from JSON string
 * **Warning** no JSON validation!
 *
 * @param json JSON string to parse
 * @return User instajce
 */
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
 *	 -> var/users/
 * Used files:
 *	 -> var/users/$ID
 *	 -> var/users/logins
 */
function UsersDatabase() {
	var db_path = path.join(process.cwd(), "/var/users");
	var lastid_file = path.join(db_path, '.lastid');
	var last_user_id = undefined;
	
	var init = function() {
		if (!fs.existsSync(lastid_file)) {
			fs.writeFileSync(lastid_file, '0', 'utf8', function(err) {

			});
		}
	}

	init();

	var validate_user = function(user) {
		// TODO: perform full validation
		if (isNaN(user.id))
			throw "Bad user id";
	}

	/** Get next available user id
	 * This function does *not* modify .lastid file
	 * @see update_next_user_id();
	 * 
	 * @return next available user id
	 */
	this.get_next_user_id = function() {
		var last_id = fs.readFileSync(lastid_file, 'utf8');
		last_id = parseInt(last_id);
		if (isNaN(last_id))
			throw "Unable to get last user id...";
		console.log("get_next_user_id = " + (last_id + 1).toString());
		return (last_id + 1);
	}

	/** Update next available user id
	 * Increase and write next available user id into .lastid file
	 *
	 * @return true
	 * @throw string after read or write error
	 */
	this.update_next_user_id = function() {
		var last_id = undefined;
		try {
			last_id = this.get_next_user_id();
			console.log("Writing new lastid: " + last_id.toString());
			fs.writeFileSync(lastid_file, last_id.toString(), 'utf8', function(err) {
				if (err)
					throw err;
			});
			return true;
		} catch (e) {
			throw "Unable to update next user id: " + e;
		}
	}

	/** Save user data to database
	 * 
	 * @param user  filled instance of User class
	 * @return true
	 * @throw string after write error
	 */
	this.save_user_data = function(user) {
		if (!user instanceof User)
			throw "UsersDatabase::save_user_data: user must be an instance of User class";
		validate_user(user);
		fs.writeFileSync(path.join(db_path, user.id.toString()), user.export_to_json(), 'utf8', function(err) {
			if (err)
				throw err;
		});
		return true;
	}
	
	/** Read user data from file and return User object
	 *
	 * @param user_id existed ser id
	 * @return filled instance of User class
	 * @throw string after read error
	 */
	this.read_user_data = function(user_id) {
		var json = fs.readFileSync(path.join(db_path, user_id.toString()), 'utf8');
		if (!json)
			throw "Unable to read user data...";
		if (Buffer.isBuffer(json))
			json = json.toString('utf8');
		var user = new_user_from_json(json);
		user["id"] = user_id;
		return user;
	}
	
	/** Register new user in database
	 * Note: no validation at this point
	 *
	 * @param user: instance of filled User class, must be a valid user
	 * @return new user id
	 * @throw string after read or write error
	 */
	this.register_new_user =  function(user) {
		if (!user instanceof User)
			throw "UsersDatabase::register_new_user: user parameter must be an instance of User class";
		try {
			user.id = udb.get_next_user_id();
			this.save_user_data(user);
			this.update_next_user_id();
			return user.id;
		} catch (e) {
			throw "UserDatabase::register_new_user: unable to write new user data (" + e + ")";
		}
	}

	/**
	   Return an array of objects representing users whose value of 'key' is 'value'

	   @param key name of a user object field to be checked
	   @param value value to which the value of user.key must be equal fro user to be selected

	   @return dictionary of matching user objects, form: {id:object} 
	 */
	this.findUsers = function(key, value){
	var file_list = fs.readdirSync(db_path);
	var matching = {};
	var user;
	file_list.forEach( function(id){
		if( isNaN( id ) )
		return;
		user = this.read_user_data( id );
		if( user["_"+key].toLowerCase() == value.toLowerCase() ){ // found matching user
			matching[id] = user;
		}
	}, this );
	
	return matching;
	}

	this.findUsersMultiKey = function(dict) {
		var file_list = fs.readdirSync(db_path);
		var matching = {};
		var user;
		var file;
		for (i in file_list) {
			file = file_list[i];
			if (isNaN(file))
				continue;
			user = udb.read_user_data(file); // file will be user id
			var user_ok = true;
			var all_blank = true;
			for (key in dict) {
				if (!(dict[key]))
					continue;
				all_blank = false;
				if (user['_' + key].toLowerCase() != dict[key].toLowerCase()) {
					user_ok = false;
				}
			}
			if (user_ok && !all_blank) {
				matching[user.id] = user;
			}
		}
		return matching;
	}

}

var udb = new UsersDatabase();

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
	// do not do anything special on base connection

	// ping for testing
	socket.on('ping', function(data) {
	console.log("Got ping command from client...");
	socket.emit("pong", data);
	console.log("Sending pong...");
	});
	
	// handle user login
	socket.on("login", function(data) {

	console.log("Got login data from client");
	var ret = user_login( strip_data_object( data ) );
	if( ret >= 0 ){ // login OK
		var user_id = ret;
		// start a new session after successful login
		var session_id = start_session( socket );
		console.info("Assigning session ID: " + session_id + "to user ID: " + user_id );
		clients_register(socket.id);
		socket.emit("loginOK", {"userID":user_id, "sessionID":session_id} );
		clients_authenticate(socket.id, user_id);
		console.log("cliients"	+ clients);
		console.log("cliients"	+ sessions);
	// TODO: remove 'no such user' warning (brute force attack is now much easier)
	}else if( ret == -1 ){ // no such user
		socket.emit("loginBAD", {"what":"No such user"});
	}else if(ret == -2){ // login OK
		socket.emit("loginBAD", {"what":"Wrong password"});		
	}
	});

	// handler functions for client requests

	// handle client asking for his data
	socket.on( "whoAmI", function( packet ){
		var session_id = packet.sessionID;
		var data = strip_data_object( packet );
		
		console.log("Got WhoAmi from session: " + session_id );

		var user_id = get_user_by_session( session_id );

		console.log("Got WhoAmi from user: " + user_id );

		var user_obj = udb.read_user_data( user_id ).strip_object() ;
		socket.emit("yourData", user_obj);
		
	});
 
	socket.on("register", function (data) {
		console.info("Got register packet: " + data);
		console.log(data);	

		data = data['data'];
		var new_user = new User();
		new_user["_email"] = data["email"];
		new_user["_login"] = data["login"];
		new_user["_first_name"] = data["first_name"];
		new_user["_last_name"] = data["last_name"];
		new_user["_password"] = data["passwd"];
		new_user["_registration_date"] = Date.now();
		
		// TODO: validate user data...

		try {
			var id = udb.register_new_user(new_user);
			console.log("New user successfully registerd with id: " + id.toString());
			socket.emit("registerOK", {'login': new_user['_login']});
		} catch (e) {
			console.log("Unable to register new user: " + e);
		}
		
	});
	
	/** Send user data from user id */
	socket.on("getUserDataFromId", function(packet) {
		var data = packet["data"];
		if (!isNaN(data["id"])) {
			var user_data;
			try {
				user_data = udb.read_user_data(data["id"]);
				// TODO: strip object
				socket.emit("userDataFromId", user_data.export_to_json());
			} catch (e) {} 
		}
	});

	socket.on("searchFriends", function(packet) {
		var data = packet["data"];
		var results = udb.findUsersMultiKey(data);
		socket.emit("matchingUsers", {'list': Object.keys(results)});	
	});

	socket.on( "getFriendsData", function( packet ){
	    var session_id = packet.sessionID;
	    var data = strip_data_object( packet );
	   
        console.log(data);
 
	    var response = {};
	    response["user_data_list"] = [];

        console.info( "asked for friends data: " + data["list"] );
	    
	    data["list"].forEach( function(id){
		    var user = udb.read_user_data( id ).strip_object();
		    // TODO: control if user exists in database
		    // TODO: append status information to the useer object
		    response["user_data_list"].push( user );
	    } );
	    
	    socket.emit("friendsData", response);
	    
	});

    socket.on( "chat", function( packet ){
        
	    var session_id = packet.sessionID;
	    var data = strip_data_object( packet );
        
        // broadcast
        for(sid in sessions){
            sessions[ sid ].emit("chatOK", data );
        }
        
    });    
	
});

http_server.listen(9393);

/* vim: set ts=4 sw=4 ft=javascript noexpandtab: */
