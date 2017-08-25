import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
		}
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
		this.handleOnMouseExit = this.handleOnMouseExit.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
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
		window.location = "/product.html?modelName=" + this.props.data.modelname + "&articleType=" + this.props.data.articletype + "&color=" + this.props.data.colors[0];
	}

	render() {
		if (this.props.data == null) {
			return (
				<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit}></div>
			);
		}
		let colorText = " colors";
		if (this.props.data.colors.length == 1) {
			colorText = " color";
		}
		let merchandiseDivClass = "merchandiseDiv";
		let merchandiseTitleClass = "merchandiseTitle";
		let numColorsTitleClass = "numColorsTitle";
		let priceTitleClass = "priceTitle";
		if (this.state.hovered == true) {
			merchandiseDivClass = "merchandiseDivHovered";
			merchandiseTitleClass = "merchandiseTitleHovered";
			numColorsTitleClass = "numColorsTitleHovered";
			priceTitleClass = "priceTitleHovered";
		}
		return (
			<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit} onClick={this.handleOnClick}>
				<img className="merchandiseImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[0] + ".png"}/>
				<p className={merchandiseTitleClass}>{this.props.data.modelname + " " + this.props.data.articletype}</p>
				<p className={numColorsTitleClass}>{this.props.data.colors.length + colorText}</p>
				<p className={priceTitleClass}>{"$" + this.props.data.price}</p>
			</div>
		);
	}
}

class ShoppingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
		this.getProductInfo = this.getProductInfo.bind(this);
		for (let i = 0; i < 3; ++i) {
			this.getProductInfo(i);
		}
	}

	getProductInfo(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.data[index] = JSON.parse(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getProductInfo?index=" + index, true);
		xhttp.send();
	}

	render() {
		let products = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			products.push(<MerchandiseItem key={i} data={this.state.data[i]}/>);
		}
		return (
			<div>
				<MainBackground/>
				<div className="merchandiseContainer">
					{products}
				</div>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ShoppingPage/>, document.getElementById("main"));
