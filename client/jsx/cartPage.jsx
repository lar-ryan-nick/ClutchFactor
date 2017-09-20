import React from 'react';
import CartDisplay from './cartDisplay.jsx';

class CartPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let button = false;
		if (this.props.numCartItems > 0) {
			button = true;
		}
		return (
			<div>
				<CartDisplay numCartItems={this.props.numCartItems} data={this.props.data} removeItem={this.props.removeItem} button={button}/>
			</div>
		);
	}
}

export default CartPage;
