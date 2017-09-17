import React from 'react';
import Header from './header.jsx';
import Main from './main.jsx';
import Footer from './footer.jsx';

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null,
			data: [],
		}
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
		return (
			<div>
				<Main inside={this.props.inside}/>
				<Footer/>
				<Header refresh={this.refresh} numCartItems={this.state.numCartItems}/>
			</div>
		);
	}
}

export default Page;
