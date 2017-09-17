import React from 'react';
import ReactDom from 'react-dom';
import {CartDisplay, Page} from './base.jsx';

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

class PageExtension extends Page {

	constructor(props) {
		super(props);
	}

	render() {
		 return super.render(<CartPage numCartItems={this.state.numCartItems} data={this.state.data} removeItem={this.removeCartItem}/>);
	}
}

ReactDom.render(<PageExtension/>, document.getElementById("page"));
