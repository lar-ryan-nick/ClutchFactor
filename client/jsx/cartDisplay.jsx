import React from 'react';
import CartItem from './cartItem.jsx';

class CartDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleRemove(index) {
		this.props.removeItem(index);
	}

	render() {
		let cartItems = [];
		let total = 0;
		for (let i = 0; i < this.props.data.length; ++i) {
			cartItems.push(<CartItem key={i} data={this.props.data[i]} removeItem={this.handleRemove.bind(this, i)}/>);
			total += this.props.data[i].price;
		}
		let top = [];
		let totalLabel = null;
		if (this.props.numCartItems != null) {
			if (this.props.numCartItems < 0) {
				top.push(<p key="1" className="cartTitle">You must log in to view your cart</p>);
			} else {
				let text = " items";
				if (this.props.numCartItems == 1) {
					text = " item";
				}
				top.push(<p key="1" className="cartTitle">{"You have " + this.props.numCartItems + text + " in your cart"}</p>);
				totalLabel = <p className="totalTitle">{"Total: $" + total}</p>;
			}
		}
		return (
			<div className="cartDiv">
				{top}
				{cartItems}
				{totalLabel}
			</div>
		);
	}
}

export default CartDisplay;
