import React from 'react';

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

export default ConfirmationInfo;
