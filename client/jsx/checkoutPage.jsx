import React from 'react';
import dropin from 'braintree-web-drop-in';
import ShippingInfo from './shippingInfo.jsx';
import ConfirmationInfo from './confirmationInfo.jsx';

class CheckoutPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			stage: 0,
			address: null,
			payload: null
		};
		this.setupPayments = this.setUpPayments.bind(this);
		this.setAddress = this.setAddress.bind(this);
		this.setPayload = this.setPayload.bind(this);
		this.setStage = this.setStage.bind(this)
		this.finalize = this.finalize.bind(this);
		this.setUpPayments();
	}

	setUpPayments() {
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

	setStage(stage) {
		let newState = this.state;
		newState.stage = stage;
		this.setState(newState);
	}

	setAddress(address) {
		let newState = this.state;
		newState.address = address;
		newState.stage = 1;
		this.setState(newState);
	}

	setPayload() {
		if (this.instance != null) {
			this.instance.requestPaymentMethod(function(error, payload) {
				if (error) {
					console.log(error);
				} else {
					let newState = this.state;
					newState.payload = payload;
					newState.stage = 2;
					this.setState(newState);
				}
			}.bind(this));
		}
	}

	finalize() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
			}
		}.bind(this);
		xhttp.open("POST", "/checkout", true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("payload=" + JSON.stringify(this.state.payload));
	}

	render() {
		let stuff = [];
		stuff.push(<p key="1" className="stageHeader" onClick={this.setStage.bind(this, 0)}>1. Enter your shipping info</p>);
		if (this.state.stage == 0) {
			stuff.push(<div key="2" className="paddedDiv"><ShippingInfo key="3" setAddress={this.setAddress}/><div key="4" className="invisible" ref={(input) => {this.dropinContainer = input;}}></div></div>);
		} else {
			stuff.push(<p key="2" className="stageHeader" onClick={this.setStage.bind(this, 1)}>2. Enter your payment info</p>);
			if (this.state.stage == 1) {
				stuff.push(<div key="3" className="paddedDiv"><div key="4" ref={(input) => {this.dropinContainer = input;}}></div><button key="5" className="payButton" onClick={this.setPayload}>Use as payment</button></div>);
			} else {
				stuff.push(<div key="3" className="paddedDiv"><div key="4" className="invisible" ref={(input) => {this.dropinContainer = input;}}></div><p key="5" className="stageHeader" onClick={this.setStage.bind(this, 2)}>3. Confirm</p><ConfirmationInfo key="6" address={this.state.address} payload={this.state.payload} finalize={this.finalize}/></div>);
			}
		}
		return (
			<div>
				{stuff}
			</div>
		);
	}
}

export default CheckoutPage;
