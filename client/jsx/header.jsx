import React from 'react';
import CartPage from './cartPage.jsx';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
		};
		this.goToMain = this.goToMain.bind(this);
		this.goToCart = this.goToCart.bind(this);
		this.setHover = this.setHover.bind(this);
	}

	goToMain() {
		window.location = "/index.html";
	}

	goToCart() {
		window.location = "/cart.html";
	}

	setHover(val) {
		let newState = this.state;
		newState.hovered = val;
		this.setState(newState);
	}

	render() {
		let accountStuff = [];
		let cartDivClass = "loggedInCartIconDiv";
		if (this.props.userData.email == "") {
			cartDivClass = "loggedOutCartIconDiv";
			accountStuff.push(<a className="headerAccountLink" key="1" href="account.html">Log In/Create an Account</a>);
		} else if (this.props.userData.email != null) {
			let name = this.props.userData.email;
			if (this.props.userData.firstname != "") {
				name = this.props.userData.firstname;
			} else if (this.props.userData.lastname != "") {
				name = this.props.userData.lastname;
			}
			accountStuff.push(<p key ="1" className="headerGreeting">{"Hello " + name}</p>);
			accountStuff.push(<button key="5" className="headerLogOutButton" onClick={this.props.logOut}>Log Out</button>);
		}
		let numBadge = null;
		if (this.props.numCartItems > 0) {
			numBadge = <p key="4" className="cartNumBadge">{this.props.numCartItems}</p>;
		}
		let cart = null;
		if (this.state.hovered == true) {
			cart = <div className="hoveredCartDiv"><CartPage numCartItems={this.props.numCartItems} data={this.props.cartData} removeItem={this.props.removeItem}/></div>;
		}
		accountStuff.push(<div key="2" className={cartDivClass} onMouseOver={this.setHover.bind(this, true)} onMouseLeave={this.setHover.bind(this, false)}><img key="3" className="cartIcon" src="CartIcon.png" onClick={this.goToCart}/>{numBadge}{cart}</div>);
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
