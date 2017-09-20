import React from 'react';
import Header from './header.jsx';
import Main from './main.jsx';
import Footer from './footer.jsx';

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null,
			cartData: [],
			userData: {}
		}
		this.getUserInfo = this.getUserInfo.bind(this);
		this.logOut = this.logOut.bind(this);
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.removeCartItem = this.removeCartItem.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refresh();
	}

	getUserInfo() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText != "{}") {
					let newState = this.state;
					newState.userData = JSON.parse(xhttp.responseText);
					this.setState(newState);
				} else {
					let newState = this.state;
					newState.userData = {
						email: ""
					};
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getUserInfo", true);
		xhttp.send();
	}

	logOut() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.userData = {
					email: ""
				};
				this.setState(newState);
				this.refresh();
			}
		}.bind(this);
		xhttp.open("GET", "/logOut", true);
		xhttp.send();
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
					newState.cartData[index] = JSON.parse(xhttp.responseText);
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getCartItemInfo?index=" + index, true);
		xhttp.send();
	}

	removeCartItem(index) {
		let newState = this.state;
		newState.cartData[index].loading = true;
		delete newState.cartData[index].response;
		this.setState(newState);
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText == "Removed the cart item successfully") {
					this.refresh();
				} else {
					let newState = this.state;
					newState.cartData[index].loading = false;
					newState.cartData[index].response = xhttp.responseText;
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/removeCartItem?productid=" + this.state.cartData[index].productid, true);
		xhttp.send();
	}

	refresh() {
		this.getUserInfo();
		this.getNumCartItems(function() {
			if (this.state.cartData.length > this.state.numCartItems) {
				let newState = this.state;
				if (this.state.numCartItems < 1) {
					newState.cartData = [];
				} else {
					newState.cartData.splice(this.state.numCartItems, this.state.cartData.length - this.state.numCartItems);
				}
				this.setState(newState);
			}
			for (let i = 0; i < this.state.numCartItems; ++i) {
				this.getCartItemInfo(i);
			}
		}.bind(this));
	}

	render(inside) {
		if (inside == null) {
			inside = this.props.inside;
		}
		return (
			<div>
				<Main inside={inside}/>
				<Footer/>
				<Header numCartItems={this.state.numCartItems} cartData={this.state.cartData} removeItem={this.removeCartItem} userData={this.state.userData} logOut={this.logOut}/>
			</div>
		);
	}
}

export default Page;
