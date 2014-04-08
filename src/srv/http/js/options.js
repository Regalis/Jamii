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


function micro(){
    var x = document.getElementById("microphone").checked;
    if(x){
            alert("MIC ON");
    }
    else{
            alert("MIC OFF");
	}
}

function camera(){
    var x = document.getElementById("camera").checked;
    if(x){
            alert("CAMERA ON");
    }
    else{
            alert("CAMERA OFF");
    }
}

function screen(){
    var x = document.getElementById("screen").checked;
    if(x){
            alert("SCREEN ON");
    }
    else{
            alert("SCREEN OFF");
    }
}