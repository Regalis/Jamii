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

function Whiteboard(canvas, canvas2){
    this.canvas = canvas;
    this.canvas2 = canvas2;
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
	window.painter.active = true;
	window.painter.prevPt = me.getPos(evt);
    }, false);
    
    this.canvas.addEventListener('mouseup', function(evt) {
	window.painter.active = false;
    }, false);
    
    this.canvas.addEventListener('mouseout', function(evt) {
	window.painter.active = false;
    }, false);
    
} 

Whiteboard.prototype.toggleVisibleUser = function(id){
    
}