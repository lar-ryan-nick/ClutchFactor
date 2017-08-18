import React from 'react';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.goToMain = this.goToMain.bind(this);
	}

	goToMain() {
		window.location = "https://clutchfactor.herokuapp.com/index.html";
	}

	render() {
		return (
			<div>
				<img className="headerLogo" src="images/ClutchFactor.png" onClick={this.goToMain}/>
				<a className="headerMerchandise" href="https://clutchfactor.herokuapp.com/merchandise.html">Merchandise</a>
				<a className="headerAccount" href="account.html">Log In/Create an Account</a>
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
				<div class="footerTop">
					<img class="footerLogo" src="images/CFLogo.png"/>
				</div>
				<div class="footerBottom">
					<p class="footerCopyright">© 2017 Clutch Factor, All Rights Reserved</p>
				</div>
			</div>
		);
	}
}

export {Header, Footer};
