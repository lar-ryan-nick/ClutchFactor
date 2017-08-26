import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			color: 0,
			hovered: false
		}
		this.changeImage = this.changeImage.bind(this);
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
		this.handleOnMouseExit = this.handleOnMouseExit.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	changeImage(index) {
		let newState = this.state;
		newState.color = index;
		this.setState(newState);
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
		window.location = "/product.html?index=" + this.props.index;
	}

	render() {
		if (this.props.data == null) {
			return (
				<div></div>
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
		let otherColors = [];
		if (this.state.hovered == true) {
			merchandiseDivClass = "merchandiseDivHovered";
			merchandiseTitleClass = "merchandiseTitleHovered";
			numColorsTitleClass = "numColorsTitleHovered";
			priceTitleClass = "priceTitleHovered";
			for (let i = 0; i < this.props.data.colors.length; ++i) {
				otherColors.push(<img key={i} className="previewImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[i] + ".png"} onMouseOver={this.changeImage.bind(this, i)}/>);
			}
		}
		return (
			<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit} onClick={this.handleOnClick}>
				<div className="productDiv">
					<img className="merchandiseImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[this.state.color] + ".png"}/>
					<p className={merchandiseTitleClass}>{this.props.data.modelname + " " + this.props.data.articletype}</p>
					<p className={numColorsTitleClass}>{this.props.data.colors.length + colorText}</p>
					<p className={priceTitleClass}>{"$" + this.props.data.price}</p>
				</div>
				<div className="previewDiv">
					{otherColors}
				</div>
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
		xhttp.open("GET", "/getMerchandiseInfo?index=" + index, true);
		xhttp.send();
	}

	render() {
		let products = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			products.push(<MerchandiseItem key={i} index={i} data={this.state.data[i]}/>);
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
