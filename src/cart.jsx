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
		return (
			<div>
				<img className="productImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + ".png"}/>
				<div className="TitleAndOptionsDiv">
					<p className="productTitle">{this.props.data.modelname + " " + this.props.data.articletype + " - " + this.props.data.color}</p>
					<button className="removeProductButton">Remove from cart</button>
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
			data: []
		};
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.getCartItemInfo(0);
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

	render() {
		let cartItems = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			cartItems.push(<CartItem key={i} data={this.state.data[i]}/>);
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
