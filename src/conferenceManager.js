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
* -> Aleksander Gajos <alek.gajos@gmail.com>
* -> Patryk Jaworski <regalis@regalis.com.pl>
*/


/**
* @param cm clientManager object reference 
*/
var Conference = function(admin_id){
    this.admin = admin_id;
    this.participants = [];
    this.room_name = admin_id.toString();
    /**
	 * @brief A list of files sent by the users
	 * List content:
	 * 	{
	 * 		"sender": SENDER,
	 * 		"name": FILE_NAME,
	 * 		"content": DATA (as base64)
	 * 		"content-type": MIME
	 * 	}
	 */
    this.files = [];
}

var conferenceManager = function( cm ){
    this.cm = cm;
    this.conferences = {}; // a dict of  admin_id : Conference
}

// "Public" methods
conferenceManager.prototype.is_in_conf = function( id ){
    for(var aid in this.conferences){
	var conf = this.conferences[aid];
	if( conf.participants.indexOf( id ) >= 0 || conf.admin == id ){
	    return true;
	}
    }
    return false;
}


/**
   Creates a new conference unless the admin user is already in another conference
   or the first_friend is in another conference
   
   @param admin_id user id of the user starting the conference (who automatically becomes admin)
   @return negative integer in case of error
*/
conferenceManager.prototype.create_conference = function( admin_id ){

    if( this.is_in_conf( admin_id ) ){
	return -1;
    }
    
    var conf = new Conference( admin_id );

    this.conferences[ admin_id ] = conf;

    // add admin and first friend to the room
    var admin_socket = this.cm.get_socket_by_userid( admin_id );
    admin_socket.join( this.conferences[ admin_id ].room_name );

    console.log("Present conferences after \"create_conference\": " + JSON.stringify( this.conferences ) );

}

conferenceManager.prototype.add_user_to_conf = function(admin_id, victim_id){
    console.log("Beginning of \"add user to conf\" for admin " + admin_id + " and user " + victim_id );

    if( this.is_in_conf( victim_id ) ){
    	return -1;
    }
    
    this.conferences[ admin_id ].participants.push( victim_id );
    var socket = this.cm.get_socket_by_userid( victim_id );
    socket.join( this.conferences[ admin_id ].room_name );
}

conferenceManager.prototype.rm_user_from_conf = function(admin_id, victim_id){
    var p = this.conferences[ admin_id ].participants;
    var i = p.indexOf( victim_id );
    if( i >=0 ){
	p.splice( i, 1 );
    }

    var socket = this.cm.get_socket_by_userid( victim_id );
    socket.leave( this.conferences[ admin_id ].room_name );

}

conferenceManager.prototype.broadcast = function(user_id, header, packet){
    var conf = this.get_conf_by_user( user_id );
    if( conf == null ){ 
	console.log("User requested broadcast, but is not in a conference");
	return; 
    }
    
    var my_socket = this.cm.get_socket_by_userid( user_id );
    my_socket.broadcast.to( conf.room_name ).emit(header , packet);
}

conferenceManager.prototype.broadcast_me_too = function(user_id, header, packet){
    var conf = this.get_conf_by_user( user_id );
    if( conf == null ){ 
	console.log("User requested broadcast, but is not in a conference");
	return;
    }
    
    var my_socket = this.cm.get_socket_by_userid( user_id );
    my_socket.broadcast.to( conf.room_name ).emit(header , packet);
    // also send to myself - useful for chat messages
    my_socket.emit(header , packet);
}

conferenceManager.prototype.get_conf_by_user = function(user_id){
    for(var aid in this.conferences){
	console.log( "User to search: " +  user_id );
	console.log( this.conferences[aid].participants );
	if( aid==user_id || this.conferences[aid].participants.indexOf( Number(user_id) ) >= 0 ){// user is in a conference
	    return this.conferences[aid];
	}
    }
    return null;
}


conferenceManager.prototype.share_file = function(user_id, file){
    var conf = this.get_conf_by_user( user_id );
    file["sender"] = user_id;
    conf.files.push( file );
    
    // notify users about new file
    var to_send = { "name":file["name"], "sender":user_id };
    this.broadcast( user_id, "new_file", to_send );
    
}

/*
 * @brief Get an instance of Conference by specified ID
 * @param conference_id id of conference
 * @return instance of Conference or NULL
 */
conferenceManager.prototype.get_conf_by_id = function(conference_id) {
	console.log("conferences: " + JSON.stringify(this.conferences));
	if (conference_id.toString() in this.conferences)
		return this.conferences[conference_id];
	return null;
}

/*
 * @brief Check if file exists in specified conference
 * @return true or false
 */
conferenceManager.prototype.file_exists = function(conference_id, file_name) {
	var conf = this.get_conf_by_id(conference_id);
	if (conf == null)
		return false;
	for (file_obj in conf.files) {
		if (conf.files[file_obj]["name"] == file_name)
			return true;
	}
	return false;
}

/*
 * @brief Get file from conference
 * @return file as base64 or null
 */
conferenceManager.prototype.get_file = function(conference_id, file_name) {
	var conf = this.get_conf_by_id(conference_id);
	if (conf == null)
		return null;
	for (file_obj in conf.files) {
		if (conf.files[file_obj]["name"] == file_name)
			return conf.files[file_obj]["content"];
	}
	/* This shouldn't happen */
	console.log("[LOGIC_ERROR] conferenceManager.get_file()");
	return null;
}

module.exports.conferenceManager = conferenceManager;
