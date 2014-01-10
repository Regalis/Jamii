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
 *
 */


function FriendListGUI(){

    var ul;
    this.fl = new friendList(FriendListGUI);
    this.fl.populateList();
}

FriendListGUI.prototype.createTable = function(){


    ul=document.createElement('ul');
    document.body.appendChild(ul);
    ul.setAttribute('id','friend_list'); 
    
    console.log(this.fl.n_friends);

    for (var i=0; i<this.fl.n_friends; i++){

	var li=document.createElement('li');
	li.setAttribute('id',this.fl.getFriendLogin(i)); 
 	li.setAttribute('draggable','true');	
    li.setAttribute('ondragstart','drag(event)'); 
	ul.appendChild(li);
	li.innerHTML="test"+i;

    }
    var li=document.createElement('li');
    li.setAttribute('id','add_friend'); 
    
    ul.appendChild(li);
    li.innerHTML="Add Friend";
}


FriendListGUI.prototype.createFounUsers = function(data){


    ul=document.createElement('ul');
    document.body.appendChild(ul);
    ul.setAttribute('id','found_users'); 
    


    for (var i=0; i<this.data.length; i++){

    var li=document.createElement('li');
    li.setAttribute('id',data[i].login); 
   
    ul.appendChild(li);
    li.innerHTML=data[i].login

    }
    var li=document.createElement('li');
    li.setAttribute('id','add_friend'); 
    
    ul.appendChild(li);
    li.innerHTML="Add Friend";
}




FriendListGUI.prototype.update = function(){
    document.body.removeChild(ul);
    //delete this.fl.friend_list[--this.fl.n_friends];
    this.fl.n_friends=this.fl.n_friends-1;
    flg.createTable();
    console.log("AAA");
}


function init(){
    flg = new FriendListGUI();
    window.flg = flg;
    
    
    flg.createTable();
    
}
