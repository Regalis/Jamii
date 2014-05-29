var WindowManager = function() {
	
	this.init = function() {
		
	}
	
	// @param data is sending object
	this.switchWindows(data){
		
		document.getElementByClassName(data.className).style.display = 'none';
		var temp = data["id"].substring(data["id"].indexOf("_"),data["id"].length-1);
		document.getElementById(temp).style.display = 'block';

	}

}
