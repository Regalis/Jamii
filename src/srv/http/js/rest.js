
function allowDrop(ev){
    ev.preventDefault();
}

function drop(ev){
    ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}

function onResize(){
    var w=document.getElementById('lWindow').offsetWidth;
    var h=document.getElementById('lWindow').offsetHeight;

    document.getElementById("localVideo").style.height=h;
}


function send(){
    var temp = document.getElementById("chat_input").value;        
    var data  = {};
    data ["login"] = window.my_user_object.login;
    data ["message"] = temp;

    window.connection.send("chat", data);
    document.getElementById("chat_input").value="";  
    var textList = document.getElementById("textList");
    textList.scrollTop = textList.scrollHeight;

    return false;
}

function runScript(e) {
    if (e.keyCode == 13) {
                send();                                        
    }
}

function clickDiv(){
    var something = document.getElementById('me');

    something.style.cursor = 'pointer';
    something.onclick = function() {
        document.getElementById("lWindow").innerHTML = document.getElementById('me');
    };
}

function clickView() {
    var views = document.getElementById("dBar").getElementsByTagName("div");
    for (i in views) {
        views[i].style.cursor = 'pointer';
        views[i].onclick = function() {
            document.getElementById("chat").style.visibility = "hidden";
            document.getElementById("friendList").style.visibility = "hidden";
            document.getElementById("options").style.visibility = "hidden";
            document.getElementById(this.className).style.visibility = "visible";
        };
    }
}

window.onload = function() {
    initMainScreen();
    window.connection = new ConnectionManager("http://localhost","9393");

    window.connection.registerHandler("chatOK", function(data){
        var list = document.getElementById("textList");
        var entry = document.createElement('li');
        console.log( "got messae from: " + data.login + " : " + data.message );
        var loginText = data.login+": ";
        entry.appendChild(document.createTextNode(loginText));
        entry.appendChild(document.createTextNode(data.message));
        list.appendChild(entry);
    });

    document.getElementById("searchForm").style.display = "none";

    document.getElementById("add_friend").onclick = function() {
            document.getElementById("localVideo").style.display = "none";
            document.getElementById("searchForm").style.display = "block";
    }

    document.getElementById("change_pass_button").onclick = function() {
        var new_password = document.getElementById("new_password").value;        
        var confirm_pasword = document.getElementById("confirm_password").value; 
        if(confirm_pasword==new_password){

            var current_password = document.getElementById("current_password").value;
            var data = {"current":current_password, "new":new_password}; 
            window.connection.send("password_change", data);
        }
        else{
            alert("Your new passwords don't match");
        }
    }

document.getElementById("search_button").onclick = function() {
                
    if ( validate() ) {
        var data = {};
        data ["login"] = document.getElementById("login").value;
        data ["first_name"] = document.getElementById("first_name").value;
        data ["last_name"] = document.getElementById("last_name").value;
        data ["email"] = document.getElementById("email").value;

        document.getElementById("searchForm").style.visibility = "hidden";        
        window.flg.fl.searchFriends( data );
    }
    else {
        alert("Uzupelnij chociaz jedno pole");
    }
}

clickDiv();
clickView();


var micro = document.getElementById("microphone");        


    
}


