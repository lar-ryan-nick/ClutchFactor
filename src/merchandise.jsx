import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			hovered: false,
			indexHovered: -1
		}
		this.changeImage = this.changeImage.bind(this);
		this.handleDivOnMouseOver = this.handleDivOnMouseOver.bind(this);
		this.handleDivOnMouseLeave = this.handleDivOnMouseLeave.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
		this.handlePreviewOnMouseOver = this.handlePreviewOnMouseOver.bind(this);
		this.handlePreviewOnMouseLeave = this.handlePreviewOnMouseLeave.bind(this);
	}

	changeImage(index) {
		let newState = this.state;
		newState.index = index;
		this.setState(newState);
	}

	handleDivOnMouseOver() {
		let newState = this.state;
		newState.hovered = true;
		this.setState(newState);
	}

	handleDivOnMouseLeave() {
		let newState = this.state;
		newState.hovered = false;
		this.setState(newState);
	}

	handleOnClick() {
		window.location = "/product.html?id=" + this.props.data.ids[this.state.index];
	}

	handlePreviewOnMouseOver(index) {
		let newState = this.state;
		newState.indexHovered = index;
		this.setState(newState);
		this.changeImage(index);
	}

	handlePreviewOnMouseLeave() {
		let newState = this.state;
		newState.indexHovered = -1;
		this.setState(newState);
	}

	componentDidUpdate() {
		if (this.colorLabel != null && this.hoveredImage != null) {
			this.colorLabel.style.top = this.hoveredImage.offsetTop;
			this.colorLabel.style.left = this.hoveredImage.offsetLeft + this.hoveredImage.offsetWidth + 5;
		}
	}

	render() {
		if (this.props.data == null) {
			return (
				<div className="merchandiseDiv">
					<div className="loader"></div>
				</div>
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
				if (this.state.indexHovered == i) {
					otherColors.push(
						<img key={i} ref={(input) => {this.hoveredImage = input;}} className="previewImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[i] + ".png"} onMouseOver={this.handlePreviewOnMouseOver.bind(this, i)} onMouseLeave={this.handlePreviewOnMouseLeave}/>
					);
				} else {
					otherColors.push(
						<img key={i} className="previewImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[i] + ".png"} onMouseOver={this.handlePreviewOnMouseOver.bind(this, i)} onMouseLeave={this.handlePreviewOnMouseLeave}/>
					);
				}
			}
		}
		let colorLabel = [];
		if (this.state.indexHovered >= 0) {
			colorLabel.push(<p key="1" ref={(input) => {this.colorLabel = input;}} className="colorLabel">{this.props.data.colors[this.state.indexHovered]}</p>);
		}
		return (
			<div className={merchandiseDivClass} onMouseOver={this.handleDivOnMouseOver} onMouseLeave={this.handleDivOnMouseLeave} onClick={this.handleOnClick}>
				<div className="productDiv">
					<img className="merchandiseImage" src={"images/" + this.props.data.modelname + this.props.data.articletype + this.props.data.colors[this.state.index] + ".png"}/>
					<p className={merchandiseTitleClass}>{this.props.data.modelname + " " + this.props.data.articletype}</p>
					<p className={numColorsTitleClass}>{this.props.data.colors.length + colorText}</p>
					<p className={priceTitleClass}>{"$" + this.props.data.price}</p>
				</div>
				<div className="previewDiv">
					{otherColors}
				</div>
				{colorLabel}
			</div>
		);
	}
}

class ShoppingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numMerchandise: 0,
			data: []
		};
		this.getMerchandiseInfo = this.getMerchandiseInfo.bind(this);
		this.getNumMerchandise = this.getNumMerchandise.bind(this);
		this.getNumMerchandise(function() {
			for (let i = 0; i < this.state.numMerchandise; ++i) {
				this.getMerchandiseInfo(i);
			}
		}.bind(this));
	}

	getNumMerchandise(cb) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numMerchandise = parseInt(xhttp.responseText);
				this.setState(newState);
				cb();
			}
		}.bind(this);
		xhttp.open("GET", "/getNumMerchandise", true);
		xhttp.send();
	}

	getMerchandiseInfo(index) {
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
