import React from 'react';
import CartDisplay from './cartDisplay.jsx';

class CartPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<CartDisplay numCartItems={this.props.numCartItems} data={this.props.data} removeItem={this.props.removeItem}/>
				<button className="CheckoutButton" onClick={function() {window.location = "/checkout.html";}}>Click here to finish your order</button>
			</div>
		);
	}
}

export default CartPage;
