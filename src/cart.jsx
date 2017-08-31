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
			<div className="cartDiv">
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

class CartPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: 0,
			data: []
		};
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.removeCartItem = this.removeCartItem.bind(this);
		this.getNumCartItems(function() {
			for (let i = 0; i < this.state.numCartItems; ++i) {
				this.getCartItemInfo(i);
			}
		}.bind(this));
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
					let newState = this.state;
					delete newState.data[index];
					this.setState(newState);
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

	render() {
		let cartItems = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			cartItems.push(<CartItem key={i} data={this.state.data[i]} removeItem={this.removeCartItem.bind(this, i)}/>);
		}
		return (
			<div>
				<MainBackground/>
				{cartItems}
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<CartPage/>, document.getElementById("main"));
