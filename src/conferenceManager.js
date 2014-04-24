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
conferenceManager.prototype.is_in_conf() = function( id ){
    for(var conf in this.conferences){
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
   @param first_friend user id of the first user added to conference (as it only starts when someone is added)

   @return negative integer in case of error
*/
conferenceManager.prototype.create_conference() = function( admin_id, first_friend ){

    if( this.is_in_conf( admin_id ) || this.is_in_conf( first_friend ) ){
	return -1;
    }
    
    var conf = new Conference( admin_id );
    conf.participants.push( first_friend );

    this.conferences[ admin_id ] = conf;

}


conferenceManager.prototype.add_user_to_conf = function(admin_id, victim_id){
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
    if( conf == null ) return;
    
    var my_socket = this.cm.get_socket_by_userid( user_id );
    my_socket.broadcast.to( conf.room_name ).emit(header , packet);
}

conferenceManager.prototype.broadcast_me_too = function(user_id, header, packet){
    var conf = this.get_conf_by_user( user_id );
    if( conf == null ) return;
    
    var my_socket = this.cm.get_socket_by_userid( user_id );
    my_socket.broadcast.to( conf.room_name ).emit(header , packet);
    // also send to myself - useful for chat messages
    my_socket.emit(header , packet);
    // @todo: add entering and leaving rooms onadding and removing users
}

conferenceManager.prototype.get_conf_by_user = function(user_id){
    for(var aid in this.conferences){
	if( aid==user_id || this.conferences[aid].participants.indexOf(user_id) >= 0 ){// user is in a conference
	    return this.conferences[aid];
	}
    }
    return null;
}


module.exports.conferenceManager = conferenceManager;
