function Point(x,y){
    this.x = x;
    this.y = y;
}

function Painter(id){
    this.id = id;
    this.color = "green";
    this.thickness = 2;
    this.active = false;
    this.prevPt = new Point(0,0);
}

Painter.prototype.setColor = function(color){
    this.color = color;
}

Painter.prototype.setActive = function(val){

    if ( this.active == true && val ==false ){
	window.wb.sendStroke();
    }
    this.active = val;
}


function Whiteboard(canvas){
    this.canvas = canvas;
    this.stroke = [];
}
 

Whiteboard.prototype.drawHandler = function(packet){
    
    // don't re-drwa your own strokes
    if( packet["author"] == window.flg.fl.user_object.id ){
	return;
    }

    console.log("Received draw data ");
    window.wb.drawStroke( window.painter2, packet);
    
}

Whiteboard.prototype.sendStroke = function(){
    var data = {};
    data["points"] = this.stroke;
    data["author"] = window.flg.fl.user_object.id;
    window.connection.send("draw", data);
}


Whiteboard.prototype.draw = function(painter, point) {
    if( !painter.active ) return;
    
    var ctx = this.canvas.getContext('2d');
    ctx.beginPath(); 
    ctx.moveTo(painter.prevPt.x, painter.prevPt.y);
    ctx.strokeStyle = painter.color;
    ctx.lineWidth = painter.thickness;
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    painter.prevPt = point;
    
    this.stroke.push( point );

}


Whiteboard.prototype.drawStroke = function(painter, data) {
 
    var points = data["points"];

    console.log("Received points: " + JSON.stringify( points ) );

    var ctx = this.canvas.getContext('2d');
   
    for(var i=0; i<points.length-1; i++){
	
	var point = points[i];

	console.log( "Processing point : " +  JSON.stringify(point) );



	ctx.beginPath(); 
	ctx.moveTo(point.x, point.y);
	ctx.strokeStyle = painter.color;
	ctx.lineWidth = painter.thickness;
	var point = points[i+1];
	ctx.lineTo(point.x,point.y);
	ctx.stroke();
    }


}




Whiteboard.prototype.getPos = function(evt){
    var rect = this.canvas.getBoundingClientRect();    
    var pt = new Point();
    pt.x = evt.clientX - rect.left;
    pt.y = evt.clientY - rect.top;
    return pt;
}

Whiteboard.prototype.init = function(){
    
    var me = this;

    
    // var context = this.canvas2.getContext('2d');	
    // context.beginPath();
    // context.arc(100, 100, 10, 0, 2 * Math.PI, false);
    // context.fillStyle = 'green';
    // context.fill();
    // context.lineWidth = 5;
    // context.strokeStyle = '#003300';
    // context.stroke();

    this.canvas.addEventListener('mousemove', function(evt) {
	me.draw(window.painter, me.getPos(evt));
    }, false);
    
    this.canvas.addEventListener('mousedown', function(evt) {
	window.stroke = [];
	window.painter.active = true;
	window.painter.prevPt = me.getPos(evt);
    }, false);
    
    this.canvas.addEventListener('mouseup', function(evt) {
	window.painter.setActive( false );
    }, false);
    
    this.canvas.addEventListener('mouseout', function(evt) {
	window.painter.setActive( false );
    }, false);
    
} 

Whiteboard.prototype.toggleVisibleUser = function(id){
    
}