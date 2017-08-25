import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			data: null
		}
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
		this.handleOnMouseExit = this.handleOnMouseExit.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
		this.getProductInfo = this.getProductInfo.bind(this);
		this.getProductInfo();
	}

	getProductInfo() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.data = JSON.parse(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getProductInfo?modelName=" + this.props.modelName, true);
		xhttp.send();
	}

	handleOnMouseOver() {
		let newState = this.state;
		newState.hovered = true;
		this.setState(newState);
	}

	handleOnMouseExit() {
		let newState = this.state;
		newState.hovered = false;
		this.setState(newState);
	}

	handleOnClick() {
		window.location = "/product.html?articleType=" + this.state.articletype + "&color=" + this.state.colors[0];
	}

	render() {
		if (this.state.data == null) {
			return (
				<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit}></div>
			);
		}
		let merchandiseDivClass = "merchandiseDiv";
		let merchandiseTitleClass = "merchandiseTitle";
		if (this.state.hovered == true) {
			merchandiseDivClass = "merchandiseDivHovered";
			merchandiseTitleClass = "merchandiseTitleHovered";
		}
		return (
			<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit} onClick={this.handleOnClick}>
				<img className="merchandiseImage" src={"images/" + this.state.data.modelname + this.state.data.articletype + this.state.data.colors[0] + ".png"}/>
				<p className={merchandiseTitleClass}>{this.state.data.modelname + " " + this.state.data.articletype}</p>
			</div>
		);
	}
}

class ShoppingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<MainBackground/>
				<div className="merchandiseContainer">
					<MerchandiseItem modelName="Daddy"/>
				</div>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ShoppingPage/>, document.getElementById("main"));
