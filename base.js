function fixMainMinHeight() {
	if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
		document.getElementById("main").style.minHeight = window.innerWidth * 5 / 8;
	} else {
		document.getElementById("main").style.minHeight = "calc(100% - 251px)";
	}
}

function logOut() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xhttp.open("GET", "/logOut", true);
	xhttp.send();
}

fixMainMinHeight();
window.onresize = fixMainMinHeight;
//window.onclose = logOut;
