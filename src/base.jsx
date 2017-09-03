import React from 'react';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userData: {},
		};
		this.goToMain = this.goToMain.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.logOut = this.logOut.bind(this);
		this.goToCart = this.goToCart.bind(this);
		this.getUserInfo();
	}

	goToMain() {
		window.location = "/index.html";
	}

	getUserInfo() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText != "{}") {
					let newState = this.state;
					newState.userData = JSON.parse(xhttp.responseText);
					this.setState(newState);
				} else {
					let newState = this.state;
					newState.userData = {
						email: ""
					};
					this.setState(newState);
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
				let newState = this.state;
				newState.userData = {
					email: ""
				};
				this.setState(newState);
				if (this.props.refresh != null) {
					this.props.refresh();
				}
			}
		}.bind(this);
		xhttp.open("GET", "/logOut", true);
		xhttp.send();
	}

	goToCart() {
		window.location = "/cart.html";
	}

	render() {
		let accountStuff = [];
		if (this.state.userData.email == "") {
			accountStuff.push(<a className="headerAccountLink" key="1" href="account.html">Log In/Create an Account</a>);
		} else if (this.state.userData.email != null) {
			let name = this.state.userData.email;
			if (this.state.userData.firstname != "") {
				name = this.state.userData.firstname;
			} else if (this.state.userData.lastname != "") {
				name = this.state.userData.lastname;
			}
			accountStuff.push(<p key ="1" className="headerGreeting">{"Hello " + name}</p>);
			if (this.props.numCartItems > 0) {
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="images/CartIcon.png" onClick={this.goToCart}/><p key="4" className="cartNumBadge">{this.props.numCartItems}</p></div>);
			} else {
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="images/CartIcon.png" onClick={this.goToCart}/></div>);
			}
			accountStuff.push(<button key="3" className="headerLogOutButton" onClick={this.logOut}>Log Out</button>);
		}
		return (
			<div className="header">
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
			<div className="footer">
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

class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.resize = this.resize.bind(this);
		window.onresize = this.resize;
	}

	resize() {
		if (this.main != null) {
			if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
				this.main.style.minHeight = window.innerWidth * 5 / 8;
			} else {
				this.main.style.minHeight = "calc(100% - 251px)";
			}
		}
	}

	componentDidMount() {
		this.resize();
	}

	render() {
		return (
			<div className="main" ref={(input) => {this.main = input;}}>
				<div className="backgroundImageDiv">
					<img className="backgroundImage" src="images/BackgroundImage.jpg"/>
				</div>
				{this.props.inside}
			</div>
		);
	}
}

export {Header, Footer, Main};
