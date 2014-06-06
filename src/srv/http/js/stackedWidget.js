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
 * -> Aleksander Gajos <alek.gajos@gmail.com>
 *  
 */


var StackedWidget = function(){
    
    this.widgets= [];
    this.count = 0;
    this.current = -1;
    
}

StackedWidget.prototype.add_widget_by_name = function( widget_name ){
    
    var widget = document.getElementById( widget_name );
    this.widgets.push( widget );
    this.count++;
    widget.style.display = "none";
    this.set_current_widget_by_index[ this.count-1 ]
    return this.count-1;

}

StackedWidget.prototype.set_current_widget_by_name = function( widget_name ){
    if( this.count < 1 ) return;
    for(var i=0;i<this.count;i++){
	if( this.widgets[i].getAttribute('id') == widget_name ){
	    this.set_current_widget_by_index( i );
	}
    }
}

StackedWidget.prototype.set_current_widget_by_index = function( widget_index ){
    if( this.count < 1 ) return;
    if( this.current >=0 ){
	this.widgets[ this.current ].style.display = "none";
    }
    this.widgets[ widget_index ].style.display = "block";
    this.current = widget_index;
}
