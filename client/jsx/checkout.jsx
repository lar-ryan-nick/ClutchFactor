import React from 'react';
import ReactDom from 'react-dom';
import dropin from 'braintree-web-drop-in';
import {CartDisplay, Page} from './base.jsx';

class ShippingOption extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hovered: "false"
		};
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
		this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnMouseOver() {
		let newState = this.state;
		newState.hovered = true;
		this.setState(newState);
	}

	handleOnMouseLeave() {
		let newState = this.state;
		newState.hovered = false;
		this.setState(newState);
	}

	handleOnClick() {
		this.props.setAddress(this.props.info);
	}

	render() {
		if (this.props.info == null) {
			return (
				<div></div>
			);
		}
		let divClass = "addressOptionDiv";
		let textClass = "addressLabel";
		if (this.state.hovered == true) {
			divClass += "Hovered";
			textClass += "Hovered";
		}
		return (
			<div className={divClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseLeave} onClick={this.handleOnClick}>
				<p className={textClass}>{this.props.info.receiver}</p>
				<p className={textClass}>{this.props.info.addressline1}</p>
				<p className={textClass}>{this.props.info.addressline2}</p>
				<p className={textClass}>{this.props.info.city + ", " + this.props.info.state + " " + this.props.info.zip}</p>
			</div>
		);
	}
}

class ShippingForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="shippingInfoDiv">
				<p className="formTitle">Add a New Address</p>
				<form onSubmit={this.props.addAddress}>
					<p className="textInput">Receiver</p>
					<input className="textInput" type="text" name="receiver" value={this.props.info.receiver} onChange={this.props.handleChange}/>
					<p className="textInput">Address Line 1</p>
					<input className="textInput" type="text" name="addressline1" value={this.props.info.addressline1} onChange={this.props.handleChange}/>
					<p className="textInput">Address Line 2</p>
					<input className="textInput" type="text" name="addressline2" value={this.props.info.addressline2} onChange={this.props.handleChange}/>
					<p className="textInput">City</p>
					<input className="textInput" type="text" name="city" value={this.props.info.city} onChange={this.props.handleChange}/>
					<p className="textInput">State</p>
					<input className="textInput" type="text" name="state" value={this.props.info.state} onChange={this.props.handleChange}/>
					<p className="textInput">Zip Code</p>
					<input className="textInput" type="number" name="zip" value={this.props.info.zip} onChange={this.props.handleChange}/>
					<input className="submitInfo" type="submit" name="submit" value="Ship here"/>
				</form>
			</div>
		);
	}
}

class ShippingInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numAddresses: null,
			addresses: [],
			info: {
				receiver: "",
				addressline1: "",
				addressline2: "",
				city: "",
				state: "",
				zip: ""
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.getNumAddresses = this.getNumAddresses.bind(this);
		this.getAddressInfo = this.getAddressInfo.bind(this);
		this.removeAddress = this.removeAddress.bind(this)
		this.addAddress = this.addAddress.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refresh();
	}

	handleChange(event) {
		let newState = this.state;
		newState.info[event.target.name] = event.target.value;
		this.setState(newState);
	}

	getNumAddresses(cb) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numAddresses = parseInt(xhttp.responseText);
				this.setState(newState);
				cb();
			}
		}.bind(this);
		xhttp.open("GET", "/getNumAddresses", true);
		xhttp.send();
	}

	getAddressInfo(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.addresses[index] = JSON.parse(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getAddressInfo?index=" + index, true);
		xhttp.send();
	}

	removeAddress(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				this.refresh();
			}
		}.bind(this);
		xhttp.open("GET", "/removeAddress?id=" + this.state.addresses[index], true);
		xhttp.send();
	}

	addAddress(event) {
		event.preventDefault();
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText)
			}
		}.bind(this);
		xhttp.open("POST", "/addAddress", true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("receiver=" + this.state.info.receiver + "&addressLine1=" + this.state.info.addressline1 + "&addressLine2=" + this.state.info.addressline2 + "&city=" + this.state.info.city + "&state=" + this.state.info.state + "&zip=" + this.state.info.zip);
		this.props.setAddress(this.state.info);
	}

	refresh() {
		this.getNumAddresses(function() {
			if (this.state.numAddresses < this.state.addresses.length) {
				let newState = this.state;
				newState.addresses.splice(this.state.numAddresses, this.state.addresses.length - this.state.numAddresses);
				this.setState(newState);
			}
			for (let i = 0; i < this.state.numAddresses; ++i) {
				this.getAddressInfo(i);
			}
		}.bind(this));
	}

	render() {
		if (this.state.numAddresses == null) {
			return (
				<div></div>
			);
		}
		let options = [];
		for (let i = 0; i < this.state.addresses.length; ++i) {
			options.push(<ShippingOption key={i} info={this.state.addresses[i]} setAddress={this.props.setAddress}/>);
		}
		let optionsTitle = <p className="orLabel">Choose one of your previously entered addresses</p>;
		let or = <p className="orLabel">OR</p>;
		let add = <ShippingForm addAddress={this.addAddress} handleChange={this.handleChange} info={this.state.info}/>;
		if (this.state.numAddresses > 4) {
			add = null;
			or = null;
		} else if (this.state.numAddresses < 1) {
			or = null;
			optionsTitle = null;
		}
		return (
			<div>
				{optionsTitle}
				<div>
					{options}
				</div>
				{or}
				{add}
			</div>
		);
	}
}

class ConfirmationInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<center>
				<div className="confirmationInfoDiv">
					<div className="inlineDiv">
						<p className="confirmationLabel">Ship to:</p>
						<p className="confirmationLabel">{this.props.address.receiver}</p>
						<p className="confirmationLabel">{this.props.address.addressline1}</p>
						<p className="confirmationLabel">{this.props.address.addressline2}</p>
						<p className="confirmationLabel">{this.props.address.city + ", " + this.props.address.state + " " + this.props.address.zip}</p>
					</div>
					<div className="inlineDiv">
						<p className="confirmationLabel">Paying with:</p>
						<p className="confirmationLabel">{this.props.payload.type + " " + this.props.payload.description}</p>
					</div>
				</div>
				<button className="finalizeCheckoutButton" onClick={this.props.finalize}>Finish checking out</button>
			</center>
		);
	}
}

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
			stuff.push(<ShippingInfo key="2" setAddress={this.setAddress}/>);
			stuff.push(<div key="3" className="invisible" ref={(input) => {this.dropinContainer = input;}}></div>);
		} else {
			stuff.push(<p key="2" className="stageHeader" onClick={this.setStage.bind(this, 1)}>2. Enter your payment info</p>);
			if (this.state.stage == 1) {
				stuff.push(<div key="3" ref={(input) => {this.dropinContainer = input;}}></div>);
				stuff.push(<button key="4" className="payButton" onClick={this.setPayload}>Use as payment</button>);
			} else {
				stuff.push(<div key="3" className="invisible" ref={(input) => {this.dropinContainer = input;}}></div>);
				stuff.push(<p key="4" className="stageHeader" onClick={this.setStage.bind(this, 2)}>3. Confirm</p>);
				stuff.push(<ConfirmationInfo key="5" address={this.state.address} payload={this.state.payload} finalize={this.finalize}/>);
			}
		}
		return (
			<div>
				{stuff}
			</div>
		);
	}
}

class PageExtension extends Page {

	constructor(props) {
		super(props);
	}

	render() {
		let inside = <CheckoutPage/>;
		if (this.state.numCartItems == null) {
			inside = <div></div>;
		} else if (this.state.numCartItems < 0) {
			inside = <p className="notLoggedInError">Must log in to checkout</p>;
		}
		return super.render(inside);
	}
}

ReactDom.render(<PageExtension/>, document.getElementById("page"));
