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
   something.onclick = function () {
      document.getElementById("lWindow").innerHTML = document.getElementById('me');
   };
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

         document.getElementById("createConference").style.visibility = "hidden";
         document.getElementById("file_share_button").style.visibility = "hidden";

         document.getElementById("whiteboard").style.visibility = "hidden";



         document.getElementById(this.className).style.visibility = "visible";
      };
   }
}

window.onload = function () {
   initMainScreen();
   window.connection = new ConnectionManager("http://localhost", "9393");

   window.connection.registerHandler("chatOK", function (data) {
      var list = document.getElementById("textList");
      var entry = document.createElement('li');
      console.log("got messae from: " + data.login + " : " + data.message);
      var loginText = data.login + ": ";
      entry.appendChild(document.createTextNode(loginText));
      entry.appendChild(document.createTextNode(data.message));
      list.appendChild(entry);
   });



   window.connection.registerHandler("conf_invitation", function (data){
		if (confirm('Are you sure you want to delete this user')) {
   		//window.connection.send("conf_accept", info);
			console.log("Join to conference")
} else {
   		//window.connection.send("conf_discard", info);
			console.log("Refuse conference invitation")
}
	
	});


   window.connection.registerHandler("drawOK", window.wb.drawHandler);

   document.getElementById("file_share_button").style.visibility = "hidden";
   document.getElementById("searchForm").style.display = "none";

   document.getElementById("add_friend").onclick = function () {
      document.getElementById("localVideo").style.display = "none";
      document.getElementById("searchForm").style.display = "block";
   }

   fitToContainer(document.getElementById("layer1"));



   document.getElementById("search_button").onclick = function () {

      if (validate()) {
         var data = {};
         data["login"] = document.getElementById("login").value;
         data["first_name"] = document.getElementById("first_name").value;
         data["last_name"] = document.getElementById("last_name").value;
         data["email"] = document.getElementById("email").value;

         document.getElementById("searchForm").style.visibility = "hidden";
         window.flg.fl.searchFriends(data);
      } else {
         alert("Uzupelnij chociaz jedno pole");
      }
   }

   clickDiv();
   clickView();


   var micro = document.getElementById("microphone");

}
