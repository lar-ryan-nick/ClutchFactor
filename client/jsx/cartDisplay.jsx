import React from 'react';
import CartItem from './cartItem.jsx';

class CartDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			titleFontSize: "0px",
			descriptionFontSize: "0px",
		};
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleRemove(index) {
		this.props.removeItem(index);
	}

	componentDidMount() {
		let newState = this.state;
		newState.titleFontSize = .07 * this.containingDiv.offsetWidth;
		newState.descriptionFontSize = .045 * this.containingDiv.offsetWidth;
		this.setState(newState);
	}

	render() {
		let cartItems = [];
		let total = 0;
		for (let i = 0; i < this.props.data.length; ++i) {
			if (this.props.data[i] != null) {
				cartItems.push(<CartItem key={i} data={this.props.data[i]} removeItem={this.handleRemove.bind(this, i)} fontSize={this.state.descriptionFontSize}/>);
				total += this.props.data[i].price;
			}
		}
		let top = [];
		let totalLabel = null;
		if (this.props.numCartItems != null) {
			if (this.props.numCartItems < 0) {
				top.push(<p key="1" className="cartTitle" style={{fontSize: this.state.titleFontSize}}>You must log in to view your cart</p>);
			} else {
				let text = " items";
				if (this.props.numCartItems > 0) {
					totalLabel = <p className="totalTitle" style={{fontSize: this.state.titleFontSize}}>{"Total: $" + total}</p>;
					if (this.props.numCartItems == 1) {
						text = " item";
					}
				}
				top.push(<p key="1" className="cartTitle" style={{fontSize: this.state.titleFontSize}}>{"You have " + this.props.numCartItems + text + " in your cart"}</p>);
			}
		}
		return (
			<div ref={(input) => {this.containingDiv = input;}} className="cartDiv">
				{top}
				{cartItems}
				{totalLabel}
			</div>
		);
	}
}

export default CartDisplay;
