import React from 'react';

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

export default ShippingOption;
