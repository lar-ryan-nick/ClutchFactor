import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class MerchandiseItem extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="merchandiseDiv">
				<img className="merchandiseImage" src={"images/" + this.props.articleType + this.props.color + ".png"}/>
				<p className="merchandiseTitle">{this.props.articleType}</p>
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
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ShoppingPage/>, document.getElementById("main"));
