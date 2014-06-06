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

        data["login"] = document.getElementById("login_login").value;

        data["passwd"] = document.getElementById("login_passwd").value;

        window.connection.send("login", data);

        return false;
    }

	document.getElementsByClassName("remind_button")[0].onclick = function () {
        var data = {};
        data["mail"] = document.getElementById("remind_mail").value;
        window.connection.send("remindPassword", data);
        return false;
    }

    document.getElementsByClassName("register_button")[0].onclick = function () {

        log("Get register data");
        var data = {};

        data["login"] = document.getElementById("registration_login").value;
        data["first_name"] = document.getElementById("registration_first_name").value;
        data["last_name"] = document.getElementById("registration_last_name").value;
        data["email"] = document.getElementById("registration_email").value;
        data["passwd"] = document.getElementById("registration_passwd").value;

        window.connection.send("register", data);

        return false;
    }


    document.getElementById("swap").onclick = function () {
        if (document.getElementById("swap").value == "Login") {
				document.getElementById("swap").value = "Register";
            document.getElementById("registration_form").style.display = "none";
            document.getElementById("login_form").style.display = "block";
        } else {
				document.getElementById("swap").value = "Login";
            document.getElementById("registration_form").style.display = "block";
            document.getElementById("login_form").style.display = "none";
        }
    }

    window.connection.registerHandler("registerOK", function (data) {
        alert("Registration succesfull");
        document.getElementById("registration_form").style.display = "none";
        document.getElementById("login_form").style.display = "block";
    });

    window.connection.registerHandler("loginBAD", function (data) {
        alert(data.what);
    });

}
