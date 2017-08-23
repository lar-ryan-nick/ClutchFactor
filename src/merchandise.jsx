import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hovered: false
		}
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
		this.handleOnMouseExit = this.handleOnMouseExit.bind(this);
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

	render() {
		let merchandiseDivClass = "merchandiseDiv";
		let merchandiseTitleClass = "merchandiseTitle";
		if (this.state.hovered == true) {
			merchandiseDivClass = "merchandiseDivHovered";
			merchandiseTitleClass = "merchandiseTitleHovered";
		}
		return (
			<div className={merchandiseDivClass} onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseExit}>
				<img className="merchandiseImage" src={"images/" + this.props.articleType + this.props.color + ".png"}/>
				<p className={merchandiseTitleClass}>{this.props.articleType}</p>
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
					<MerchandiseItem articleType="Hat" color="White"/>
					<MerchandiseItem articleType="Hat" color="Black"/>
					<MerchandiseItem articleType="Polo" color="White"/>
					<MerchandiseItem articleType="TShirt" color="White"/>
					<MerchandiseItem articleType="Hat" color="White"/>
					<MerchandiseItem articleType="Hat" color="Black"/>
					<MerchandiseItem articleType="Polo" color="White"/>
					<MerchandiseItem articleType="TShirt" color="White"/>
					<MerchandiseItem articleType="Hat" color="White"/>
					<MerchandiseItem articleType="Hat" color="Black"/>
					<MerchandiseItem articleType="Polo" color="White"/>
					<MerchandiseItem articleType="TShirt" color="White"/>
					<MerchandiseItem articleType="Hat" color="White"/>
					<MerchandiseItem articleType="Hat" color="Black"/>
					<MerchandiseItem articleType="Polo" color="White"/>
					<MerchandiseItem articleType="TShirt" color="White"/>
				</div>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ShoppingPage/>, document.getElementById("main"));
