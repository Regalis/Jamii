function fitToContainer(canvas) {
   // Make it visually fill the positioned parent
   canvas.style.width = '100%';
   canvas.style.height = '100%';
   // ...then set the internal size to match
   canvas.width = canvas.offsetWidth;
   canvas.height = canvas.offsetHeight;
}

function clickDiv() {
   var something = document.getElementById('me');
   something.style.cursor = 'pointer';
	var whiteboard = document.getElementById('layer1');
   whiteboard.style.cursor = 'crosshair';
   //something.onclick = function () {
     // document.getElementById("lWindow").innerHTML = document.getElementById('me');
   //};
}
function clickView() {
   var views = document.getElementById("dBar").getElementsByTagName("div");
   for (i in views) {
      views[i].style.cursor = 'pointer';
      views[i].onclick = function () {
         document.getElementById("localVideo").style.visibility = "visible";
         document.getElementById("chat").style.visibility = "hidden";
         document.getElementById("friendList").style.visibility = "hidden";
         document.getElementById("options").style.visibility = "hidden";
         document.getElementById("fileshare").style.visibility = "hidden";
         //document.getElementById("createConference").style.visibility = "hidden";
         document.getElementById("whiteboard").style.visibility = "hidden";
	  if( document.getElementById("logout") == document.getElementById(this.className) ){
	      window.connection.logout();
	  }
			
         document.getElementById(this.className).style.visibility = "visible";
      };
   }
}

