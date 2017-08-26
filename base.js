function fixMainMinHeight() {
	if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
		document.getElementById("main").style.minHeight = window.innerWidth * 5 / 8;
	} else {
		document.getElementById("main").style.minHeight = "calc(100% - 251px)";
	}
}
/*
function logOut() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
		}
	};
	xhttp.open("GET", "/logOut", true);
	xhttp.send();
}
*/
fixMainMinHeight();
window.onresize = fixMainMinHeight;
//window.onbeforeunload = logOut;
