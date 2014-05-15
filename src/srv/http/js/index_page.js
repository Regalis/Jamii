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
 */



var socket = null;

function log(data) {
    document.getElementById("status").textContent += data + "\n";
}
window.onload = function () {
    /*
     * TODO: Duplication!
     * Source: srv/http/js/initFunctions.js:31
     */
    var host = window.location.host;
    if (host.indexOf(':') != -1) {
        host = host.substring(0, host.indexOf(':'));
    }
    window.connection = new ConnectionManager("http://" + host, "9393");

    document.getElementsByClassName("login_button")[0].onclick = function () {

        log("Get login data");
        var data = {};

        data["login"] = document.getElementById("login").value;

        data["passwd"] = document.getElementById("passwd").value;

        window.connection.send("login", data);
        <!-- window.connection.registerHandler("loginOK", function(data){ -->
        <!-- window.location.href = "/page.html"; -->
        <!-- }); -->
        window.connection.registerHandler("loginBAD", function (data) {
            alert(data.what);
        });
			alert(data.login);

        return false;
    }
    document.getElementsByClassName("register_button")[0].onclick = function () {
        log("Get register data");
        var data = {};

        data["login"] = document.getElementById("loginReg").value;

        data["first_name"] = document.getElementById("first_name").value;
        data["last_name"] = document.getElementById("last_name").value;
        data["email"] = document.getElementById("email").value;
        data["passwd"] = document.getElementById("passwdReg").value;

        window.connection.send("register", data);

        window.connection.registerHandler("registerOK", function (data) {
         alert("Registration succesfull");
			document.getElementById("registration_form").style.display="none";
			document.getElementById("login_form").style.display="block";
        });
        return false;
    }

}


function register_pop(){
	if(		document.getElementById("swap").innerHTML=="Login"){
				document.getElementById("swap").innerHTML="Register";
	document.getElementById("registration_form").style.display="none";
	document.getElementById("login_form").style.display="block";
	}
else{
	document.getElementById("swap").innerHTML="Login";
	document.getElementById("registration_form").style.display="block";
	document.getElementById("login_form").style.display="none";
}


}
