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

function Point(x,y){
    this.x = x;
    this.y = y;
}

function Painter(){
    this.color = "black";
    this.thickness = 2;
    this.active = false;
    this.prevPt = new Point(0,0);

    this.setActive = function(val){
	this.active = val;
    }

    this.set_color = function(color){
	this.color = color;
    }
    
}


var WhiteboardLogic = function() {
    
    this.init = function() {
	
	window.connection.registerHandler("drawOK", this.drawHandler);
	
    }
    
    this.do_draw = function(evt) {
	this.draw( this.getPos(evt) );
    }
    
    this.begin_draw = function (evt) {
	this.stroke = [];
	this.painter.setActive( true );
	this.painter.prevPt = this.getPos(evt);
    }
    
    this.end_draw = function (evt) {
	this.painter.setActive( false );
	this.sendStroke();
    }

    
    this.draw = function (point) {
	if( !this.painter.active ) return;
	
	this.ctx.beginPath();
	this.ctx.moveTo( this.painter.prevPt.x, this.painter.prevPt.y);
	this.ctx.strokeStyle = this.painter.color;
	this.ctx.lineWidth = this.painter.thickness;
	this.ctx.lineTo(point.x,point.y);
	this.ctx.stroke();
	this.painter.prevPt = point;
	
	this.stroke.push( point );
	
	
    }

    this.getPos = function(evt){
	var rect = this.canvas.getBoundingClientRect();
	var pt = new Point();
	pt.x = (evt.clientX - rect.left) / (rect.right-rect.left)*this.canvas.width;
	pt.y = (evt.clientY - rect.top)  / (rect.bottom-rect.top)*this.canvas.height;
	return pt;
    }

    this.sendStroke = function(){
	var data = {};
	data["points"] = this.stroke;
	data["author"] = window.JamiiCore.get_current_user_data()["id"];
	data["painter"] = this.painter;
	window.connection.send("draw", data);
	this.stroke = [];
    }

    
    this.drawStroke = function(painter, data) {
	
	var points = data["points"];
	this.ctx.beginPath();
   
	for(var i=0; i<points.length-1; i++){
	    var point = points[i];
	    this.ctx.moveTo(point.x, point.y);
	    this.ctx.strokeStyle = painter.color;
	    this.ctx.lineWidth = painter.thickness;
	    var point = points[i+1];
	    this.ctx.lineTo(point.x,point.y);
	}
	
	this.ctx.closePath();
	this.ctx.stroke();
	
    }


    this.drawHandler = function(packet){

	// don't re-draw your own strokes
	if( packet["author"] == window.JamiiCore.get_current_user_data()["id"] ){
	    return;
	}

	var wbl = window.JamiiCore.get_module_logic("whiteboard");
	wbl.drawStroke( packet.painter, packet);
    }
    
    this.clear = function() {
	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);	
    }
    
    this.update_color = function( color ) {
	this.painter.set_color( color );
    }

    this.update_thickness = function( thickness ) {
	this.painter.thickness = thickness;
    }
    

    this.canvas = document.getElementById("layer1");
    // createa painter for local user
    this.painter = new Painter();
    
    // initialize stroke
    this.stroke = [];
    
    // get the 2D context
    this.ctx = this.canvas.getContext('2d');
    
}


