import React from 'react';
import ReactDom from 'react-dom';
import {CartDisplay, Page} from './base.jsx';

class Checkout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.data.length < 1) {
			return (<div></div>);
		}
		let total = 0;
		for (let i = 0; i < this.props.data.length; ++i) {
			if (this.props.data[i] != null) {
				total += this.props.data[i].price;
			}
		}
		return (
			<div className="checkoutDiv">
				<p className="checkoutTitle">Checkout</p>
				<p className="subtotalPrice">{"Your subtotal is $" + total}</p>
				<button className="CheckoutButton" onClick={function() {window.location = "/checkout.html";}}>Click here to finish your orders</button>
			</div>
		);
	}
}

class CartPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<CartDisplay data={this.props.data}/>
				<Checkout data={this.props.data}/>
			</div>
		);
	}
}

ReactDom.render(<Page ref={(input) => {var page = input;}} inside={<CartPage numCartItems={page.state.numCartItems} data={page.state.data} removeCartItem={page.removeCartItem}/>}/>, document.getElementById("page"));
