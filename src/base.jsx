import React from 'react';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null
		};
		this.goToMain = this.goToMain.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.logOut = this.logOut.bind(this);
		this.getUserInfo();
	}

	goToMain() {
		window.location = "/index.html";
	}

	getUserInfo() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText != "{}") {
					this.setState(JSON.parse(xhttp.responseText));
				} else {
					this.setState({
						email: "",
						firstname: "",
						lastname: "",
						timecreated: ""
					});
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getUserInfo", true);
		xhttp.send();
	}

	logOut() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				this.setState({
					email: "",
					firstname: "",
					lastname: "",
					timecreated: ""
				});
			}
		}.bind(this);
		xhttp.open("GET", "/logOut", true);
		xhttp.send();
	}

	render() {
		let accountStuff = [];
		if (this.state.email == "") {
			accountStuff.push(<a className="headerAccountLink" key="1" href="account.html">Log In/Create an Account</a>);
		} else if (this.state.email != null) {
			let name = this.state.email;
			if (this.state.firstname != "") {
				name = this.state.firstname;
			} else if (this.state.lastname != "") {
				name = this.state.lastname;
			}
			accountStuff.push(<p className="headerGreeting" key ="1">{"Hello " + name}</p>);
			accountStuff.push(<button className="headerLogOutButton" key="2" onClick={this.logOut}>Log Out</button>);
		}
		return (
			<div>
				<img className="headerLogo" src="images/ClutchFactor.png" onClick={this.goToMain}/>
				<a className="headerMerchandise" href="merchandise.html">Merchandise</a>
				{accountStuff}
			</div>
		)
	}
}

class Footer extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div className="footerTop">
					<img className="footerLogo" src="images/CFLogo.png"/>
				</div>
				<div className="footerBottom">
					<p className="footerCopyright">© 2017 Clutch Factor, All Rights Reserved</p>
				</div>
			</div>
		);
	}
}

class MainBackground extends React.Component {

	constructor(props) {
		super(props);
		this.state= {};
	}

	render() {
		return (
			<div className="backgroundImageDiv">
				<img className="backgroundImage" src="images/BackgroundImage.jpg"/>
			</div>
		);
	}
}

export {Header, Footer, MainBackground};
