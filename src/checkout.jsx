import React from 'react';
import ReactDom from 'react-dom';
import dropin from 'braintree-web-drop-in';
import {Header, Footer, Main} from './base.jsx';

class CardInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.setup = this.setup.bind(this);
		this.checkout = this.checkout.bind(this);
		this.setup();
	}

	setup() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				dropin.create({
					authorization: xhttp.responseText,
					container: this.dropinContainer
				}, function(error, instance) {
					if (error) {
						console.log(error);
					} else {
						this.instance = instance
					}
				}.bind(this));
			}
		}.bind(this);
		xhttp.open("GET", "/getClientToken", true);
		xhttp.send();
	}

	checkout(payload) {
		this.instance.requestPaymentMethod(function(error, payload) {
			if (error) {
				console.log(error);
			} else {
				let xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						console.log(xhttp.responseText);
					}
				}.bind(this);
				xhttp.open("POST", "/checkout", true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhttp.send("nonce=" + payload.nonce);
				console.log(payload.nonce);
			}
		}.bind(this));
	}

	render() {
		return (
			<div>
				<div ref={(input) => {this.dropinContainer = input;}}></div>
				<button className="payButton" onClick={this.checkout}>Complete Order</button>
			</div>
		);
	}
}

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null
		}
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getNumCartItems();
	}

	getNumCartItems() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numCartItems = parseInt(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getNumCartItems", true);
		xhttp.send();
	}

	render() {
		let inside = <CardInfo/>;
		if (this.state.numCartItems < 0) {
			inside = <p className="notLoggedInError">Must log in to checkout</p>;
		}
		return (
			<div>
				<Main inside={inside}/>
				<Footer/>
				<Header numCartItems={this.state.numCartItems}/>
			</div>
		);
	}
}

ReactDom.render(<Page/>, document.getElementById("page"));
