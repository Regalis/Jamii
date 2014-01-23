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
	li.innerHTML=this.fl.getFriendLogin(i);;

    }
    var li=document.createElement('li');
    li.setAttribute('id','add_friend'); 
    
    this.ul.appendChild(li);
    li.innerHTML="Add Friend";
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
    var li=document.createElement('li');
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

