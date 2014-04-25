/**
* @param cm clientManager object reference 
*/
var Conference = function(admin_id){
    this.admin = admin_id;
    this.participants = [];
    this.room_name = admin_id.toString();
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


module.exports.conferenceManager = conferenceManager;
