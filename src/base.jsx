import React from 'react';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.goToMain = this.goToMain.bind(this);
	}

	goToMain() {
		window.location = "index.html";
	}

	render() {
		return (
			<div>
				<img className="headerLogo" src="images/ClutchFactor.png" onClick={this.goToMain}/>
				<a className="headerMerchandise" href="merchandise.html">Merchandise</a>
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

export {Header, Footer};
