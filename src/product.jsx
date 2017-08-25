import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class ProductPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		return (
			<div className="productPreviewDiv">
				<img className="productPreviewImage" src={"images/" + this.props.modelName + this.props.articleType + this.props.color + ".png"}/>
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
		return (
			<div className="productInfoDiv">
				<p className="productInfoTitle">{this.props.modelName + " " + this.props.articleType + " - " + this.props.color}</p>
			</div>
		);
	}
}

class ProductPage extends React.Component {

	constructor(props) {
		super(props);
		let query = window.location.search.substring(1);
		let parameters = {};
		let queries = query.split("&");
		for (let i = 0; i < queries.length; ++i) {
			parameters[queries[i].split("=")[0]] = queries[i].split("=")[1];
		}
		this.state = parameters;
	}

	render() {
		return (
			<div>
				<MainBackground/>
				<ProductPreview modelName={this.state.modelName} articleType={this.state.articleType} color={this.state.color}/>
				<ProductInfo modelName={this.state.modelName} articleType={this.state.articleType} color={this.state.color}/>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ProductPage/>, document.getElementById("main"));
