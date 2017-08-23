function fixMainMinHeight() {
	if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
		document.getElementById("main").style.minHeight = window.innerWidth * 5 / 8;
	} else {
		document.getElementById("main").style.minHeight = "calc(100% - 251px)";
	}
}
window.onresize = fixMainMinHeight;
fixMainMinHeight();
