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
 *  -> Alek Gajos <alek.gajos@gmail.com>
 * 
 */


var WhiteboardGui = function(){
    
    this.init = function(){

	// Make it visually fill the positioned parent
	this.logic.canvas.style.width = '100%';
	this.logic.canvas.style.height = '100%';

	this.logic.canvas.width = this.logic.canvas.offsetWidth;
	this.logic.canvas.height = this.logic.canvas.offsetHeight;

	// attach functions
	this.logic.canvas.addEventListener('mousemove', function(evt) {
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.do_draw(evt);
	}, false);
	
	this.logic.canvas.addEventListener('mousedown', function(evt) {
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.begin_draw(evt);
	}, false);
	
	this.logic.canvas.addEventListener('mouseup', function(evt) {
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.end_draw(evt);
	}, false);
	
	this.logic.canvas.addEventListener('mouseout', function(evt) {
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.end_draw(evt);
	}, false);

	document.getElementById("clear_board_button").onclick = function(){
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.clear();
	}

	document.getElementById("color_picker").onchange = function(){
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.update_color( document.getElementById("color_picker").value );
	    
	}

	document.getElementById("thickness_picker").onchange = function(){
	    var wbl = window.JamiiCore.get_module_logic("whiteboard");
	    wbl.update_thickness( document.getElementById("thickness_picker").value );
	    
	}



    }
    
	
    
    
}
