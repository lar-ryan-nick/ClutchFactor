import React from 'react';
import CartItem from './cartItem.jsx';

class CartDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			containerWidth: 0
		};
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleRemove(index) {
		this.props.removeItem(index);
	}

	componentDidMount() {
		let newState = this.state;
		newState.containerWidth = this.containingDiv.offsetWidth;
		this.setState(newState);
	}

	render() {
		let cartItems = [];
		let total = 0;
		for (let i = 0; i < this.props.data.length; ++i) {
			if (this.props.data[i] != null) {
				cartItems.push(<CartItem key={i} data={this.props.data[i]} removeItem={this.handleRemove.bind(this, i)} fontSize={.045 * this.state.containerWidth}/>);
				total += this.props.data[i].price;
			}
		}
		let top = [];
		let totalLabel = null;
		if (this.props.numCartItems != null) {
			let text = " items";
			if (this.props.numCartItems > 0) {
				totalLabel = <p className="totalTitle" style={{fontSize: .06 * this.state.containerWidth}}>{"Total: $" + total}</p>;
				if (this.props.numCartItems == 1) {
					text = " item";
				}
			}
			top.push(<p key="1" className="cartTitle" style={{fontSize: .075 * this.state.containerWidth}}>{"You have " + this.props.numCartItems + text + " in your cart"}</p>);
		}
		let button = null;
		if (this.props.button == true) {
			button = <button className="CheckoutButton" style={{fontSize: .06 * this.state.containerWidth}} onClick={function() {window.location = "/checkout.html";}}>Click here to finish your order</button>;
		}
		return (
			<div ref={(input) => {this.containingDiv = input;}} className="cartDiv">
				{top}
				{cartItems}
				{totalLabel}
				{button}
			</div>
		);
	}
}

export default CartDisplay;
