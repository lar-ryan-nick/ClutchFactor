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
				<img class="headerLogo" src="images/ClutchFactor.png" onClick={this.goToMain}/>
				<a class="headerMerchandise" href="https://clutchfactor.herokuapp.com/merchandise.html">Merchandise</a>
				<a class="headerAccount" href="https://clutchfactor.herokuapp.com/account.html">Log In/Create an Account</a>
			</div>
		)
	}
}

export default Header;
