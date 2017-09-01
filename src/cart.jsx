import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class CartItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.data == null || this.props.data == {}) {
			return (
				<div></div>
			);
		}
		let remove = [];
		if (this.props.data.loading == true) {
			remove.push(<div key="1" className="loader"></div>);
		} else {
			remove.push(<button key="1" className="removeProductButton" onClick={this.props.removeItem}>Remove from cart</button>);
			if (this.props.data.response != null) {
				remove.push(<div key="2"><img key="3" className="icon" src="images/RedXIcon.png"/><p key="4" className="errorLabel">{this.props.data.response}</p></div>);
			}
		}
		return (
			<div className="cartItemDiv">
				<img className="productImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + ".png"}/>
				<div className="TitleAndOptionsDiv">
					<p className="productTitle">{this.props.data.modelname + " " + this.props.data.articletype + " - " + this.props.data.color}</p>
					{remove}	
				</div>
				<p className="priceTitle">{"$" + this.props.data.price}</p>
			</div>
		);
	}
}

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
				<button className="payButton">Click here to finish your orders</button>
			</div>
		);
	}
}


class CartPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null,
			data: []
		};
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.removeCartItem = this.removeCartItem.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refresh();
	}

	getNumCartItems(cb) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numCartItems = parseInt(xhttp.responseText);
				this.setState(newState);
				cb();
			}
		}.bind(this);
		xhttp.open("GET", "/getNumCartItems", true);
		xhttp.send();
	}

	getCartItemInfo(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText != "{}") {
					let newState = this.state;
					newState.data[index] = JSON.parse(xhttp.responseText);
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getCartItemInfo?index=" + index, true);
		xhttp.send();
	}

	removeCartItem(index) {
		let newState = this.state;
		newState.data[index].loading = true;
		delete newState.data[index].response;
		this.setState(newState);
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText == "Removed the cart item successfully") {
					this.refresh();
				} else {
					let newState = this.state;
					newState.data[index].loading = false;
					newState.data[index].response = xhttp.responseText;
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/removeCartItem?id=" + this.state.data[index].id, true);
		xhttp.send();
	}

	refresh() {
		this.getNumCartItems(function() {
			if (this.state.data.length > this.state.numCartItems) {
				let newState = this.state;
				if (this.state.numCartItems < 1) {
					newState.data = [];
				} else {
					newState.data.splice(this.state.numCartItems, this.state.data.length - this.state.numCartItems);
				}
				this.setState(newState);
			}
			for (let i = 0; i < this.state.numCartItems; ++i) {
				this.getCartItemInfo(i);
			}
		}.bind(this));
	}

	render() {
		let top = [];
		if (this.state.numCartItems != null) {
			if (this.state.numCartItems < 0) {
				top.push(<p key="1" className="cartTitle">You must log in to view your cart</p>);
			} else {
				let text = " items";
				if (this.state.numCartItems == 1) {
					text = " item";
				}
				top.push(<p key="1" className="cartTitle">{"You have " + this.state.numCartItems + text + " in your cart"}</p>);
			}
		}
		let cartItems = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			cartItems.push(<CartItem key={i} data={this.state.data[i]} removeItem={this.removeCartItem.bind(this, i)}/>);
		}
		return (
			<div>
				<MainBackground/>
				<div className="cartDiv">
					{top}
					{cartItems}
				</div>
				<Checkout data={this.state.data}/>
			</div>
		);
	}
}

var cart = null;

ReactDom.render(<CartPage ref={(input) => {cart = input}}/>, document.getElementById("main"));
ReactDom.render(<Header refresh={cart.refresh}/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
