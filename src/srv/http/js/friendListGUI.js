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
 * -> Mateusz Zajac <matteo.zajac@gmail.com>  
 * -> Mateusz Folwarski <mateusz.folwarski@uj.edu.pl>
 * -> Aleksander Gajos <alek.gajos@gmail.com>
 */


/**
 * Constructor of the GUI representation of the friendList
 * @param parent_name name of the HTML element iside which the list will be drawn
*/
function FriendListGUI(parent_name){

    this.parent = document.getElementById( parent_name );
    this.ul = {};
    this.fl = new friendList( this );

}

FriendListGUI.prototype.createTable = function(){


    this.ul=document.createElement('ul');
    this.parent.appendChild(this.ul);
    this.ul.setAttribute('id','friend_list'); 
    
    console.log(this.fl.n_friends);

    for (var i=0; i<this.fl.n_friends; i++){

	var li=document.createElement('li');
	li.setAttribute('id', this.fl.getFriendLogin(i)); 
 	li.setAttribute('draggable','true');	
	li.setAttribute('ondragstart','drag(event)'); 
	this.ul.appendChild(li);
	// create html enry to display the user's avatar
	var image_entry = "<img src=\"data:image/gif;base64,"+
	    this.fl.getFriendAvatar(i) + "\" />";
	console.log(image_entry);
	li.innerHTML=this.fl.getFriendLogin(i) + image_entry;

    }
    // var input = document.createElement('input');
    // input.setAttribute('type', 'button');
    // input.setAttribute('id','add_friend'); 
    // input.setAttribute('value', 'search' );
    // 	input.onclick = function(){ document.getElementById("searchForm").style.visibility = "visible"; }    
    // //input.setAttribute('onclick',"" );
    // this.ul.appendChild(input);
    // //input.innerHTML = "Add Friend";
}


FriendListGUI.prototype.createFoundUsers = function(data){


    this.ul=document.createElement('ul');
    document.body.appendChild(this.ul);
    this.ul.setAttribute('id','found_users'); 
    


    for (var i=0; i<this.data.length; i++){

    var li=document.createElement('li');
    li.setAttribute('id',data[i].login); 
   
    this.ul.appendChild(li);
    li.innerHTML=data[i].login

    }
    var li=document.createElement('input');
    
    li.setAttribute('id','add_friend'); 
    
    this.ul.appendChild(li);
    li.innerHTML="Add Friend";
}

FriendListGUI.prototype.update = function(){
    if( typeof this.ul != undefined && this.ul.parentNode == this.parent ){
		this.parent.removeChild(this.ul);
    }
    //delete this.fl.friend_list[--this.fl.n_friends];
    flg.createTable();
    console.log("Users list drawn.");
}

FriendListGUI.prototype.drawCandidates = function( parent_name ){
	//alert("dlugosc tablicy candidates:"+window.flg.fl.candidates.length);	
	var rodzic = getElementById( parent_name );
	var ul = document.createElement('ul');
	rodzic.appendChild(ul);
	ul.setAttribute('id', 'candidatesForFriend' );
		
	for ( var i = 0; i < window.flg.fl.candidates.length; i++ ) {
		var li = document.createElement('li');
		li.innerHTML = window.flg.fl.candidates[i]["login"];
		ul.appendChild(li);	
	}

}

