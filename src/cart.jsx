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
				<img className="productImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + "Low.png"}/>
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
		this.state = {};
	}

	render() {
		let top = [];
		if (this.props.numCartItems != null) {
			if (this.props.numCartItems < 0) {
				top.push(<p key="1" className="cartTitle">You must log in to view your cart</p>);
			} else {
				let text = " items";
				if (this.props.numCartItems == 1) {
					text = " item";
				}
				top.push(<p key="1" className="cartTitle">{"You have " + this.props.numCartItems + text + " in your cart"}</p>);
			}
		}
		let cartItems = [];
		for (let i = 0; i < this.props.data.length; ++i) {
			cartItems.push(<CartItem key={i} data={this.props.data[i]} removeItem={this.props.removeCartItem.bind(this, i)}/>);
		}
		return (
			<div>
				<div className="cartDiv">
					{top}
					{cartItems}
				</div>
				<Checkout data={this.props.data}/>
			</div>
		);
	}
}

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null,
			data: []
		}
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.removeCartItem = this.removeCartItem.bind(this);
		this.refresh = this.refresh.bind(this);
		this.resize = this.resize.bind(this);
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
					if (this.props.refresh) {
						this.props.refresh();
					}
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

	resize() {
		if (this.main != null) {
			if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
				this.main.style.minHeight = window.innerWidth * 5 / 8;
			} else {
				this.main.style.minHeight = "calc(100% - 251px)";
			}
		}
	}

	componentDidMount() {
		this.resize();
	}

	render() {
		return (
			<div>
				<div ref={(input) => {this.main = input;}} className="main">
					<MainBackground/>
					<CartPage numCartItems={this.state.numCartItems} data={this.state.data} removeCartItem={this.removeCartItem}/>
				</div>
				<div className="footer">
					<Footer/>
				</div>
				<div className="header">
					<Header refresh={this.refresh} numCartItems={this.state.numCartItems}/>
				</div>
			</div>
		);
	}
}

var page;

ReactDom.render(<Page ref={(input) => {page = input;}}/>, document.getElementById("page"));

window.onresize = page.resize;
