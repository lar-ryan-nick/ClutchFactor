import React from 'react';
import ShippingOption from './shippingOption.jsx';
import ShippingForm from './shippingForm.jsx';

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
		let optionsTitle = <p className="shippingTitle">Choose one of your previously entered addresses</p>;
		let or = <p className="shippingTitle">OR</p>;
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

export default ShippingInfo;
