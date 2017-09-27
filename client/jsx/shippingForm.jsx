import React from 'react';

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
					<input className="textInput" type="text" name="zip" value={this.props.info.zip} onChange={this.props.handleChange}/>
					<input className="submitInfo" type="submit" name="submit" value="Ship here"/>
				</form>
			</div>
		);
	}
}

export default ShippingForm;
