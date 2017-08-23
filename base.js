window.onresize = function() {
	if (window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
		document.getElementById("main").style.minHeight = window.innerWidth * 5 / 8;
	} else {
		document.getElementById("main").style.minHeight = "calc(100% - 251px)";
	}
}
