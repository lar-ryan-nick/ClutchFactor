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
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="CartIcon.png" onClick={this.goToCart}/><p key="4" className="cartNumBadge">{this.props.numCartItems}</p></div>);
			} else {
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="CartIcon.png" onClick={this.goToCart}/></div>);
			}
			accountStuff.push(<button key="3" className="headerLogOutButton" onClick={this.logOut}>Log Out</button>);
		}
		return (
			<div className="header">
				<img className="headerLogo" src="ClutchFactor.png" onClick={this.goToMain}/>
				<a className="headerMerchandise" href="merchandise.html">Merchandise</a>
				{accountStuff}
			</div>
		)
	}
}

export default Header;
