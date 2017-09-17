import React from 'react';
import ProductPreview from './productPreview.jsx';
import ProductInfo from './productInfo.jsx';

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
		this.getProductInfo(parameters.id);
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
		xhttp.open("GET", "/getProductInfo?id=" + id, true);
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
				<ProductPreview data={this.state.data}/>
				<ProductInfo data={this.state.data} parent={this} changeImage={this.changeImage} refresh={this.props.refresh}/>
			</div>
		);
	}
}

export default ProductPage;
