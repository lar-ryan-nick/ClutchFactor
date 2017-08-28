import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class ProductPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		if (this.props.data == null) {
			return (
				<div></div>
			);
		}
		return (
			<div className="productPreviewDiv">
				<img className="productPreviewImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + ".png"}/>
			</div>
		);
	}
}

class ProductInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.data == null) {
			return (
				<div></div>
			);
		}
		let colorText = " colors:";
		if (this.props.data.colors.length == 1) {
			colorText = " color:";
		}
		let colors = [];
		for (let i = 0; i < this.props.data.colors.length; ++i) {
			colors.push(<img key={i} className="colorPreview" onMouseOver={this.props.changeImage.bind(this.props.parent, i)} src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[i] + ".png"}/>)
		}
		return (
			<div className="productInfoDiv">
				<p className="productInfoTitle">{this.props.data.modelname + " " + this.props.data.articletype + " - " + this.props.data.color}</p>
				<p className="numColorsTitle">{this.props.data.colors.length + colorText}</p>
				{colors}
			</div>
		);
	}
}

class ProductPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
		let query = window.location.search.substring(1);
		let parameters = {};
		let queries = query.split("&");
		for (let i = 0; i < queries.length; ++i) {
			parameters[queries[i].split("=")[0]] = queries[i].split("=")[1];
		}
		this.changeImage = this.changeImage.bind(this);
		this.getProductInfo = this.getProductInfo.bind(this);
		this.getProductInfo(parameters.index);
	}

	changeImage(index) {
		let newState = this.state;
		newState.data.color = this.state.data.colors[index];
		newState.data.id = this.state.data.ids[index];
		this.setState(newState);
	}

	getProductInfo(id) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.data = JSON.parse(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getProductInfo?id=" + parameters.id, true);
		xhttp.send();
	}

	render() {
		if (this.state.data == null) {
			return (
				<div></div>
			);
		}
		return (
			<div>
				<MainBackground/>
				<ProductPreview data={this.state.data}/>
				<ProductInfo data={this.state.data} parent={this} changeImage={this.changeImage}/>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ProductPage/>, document.getElementById("main"));
