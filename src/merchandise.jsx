import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class ShoppingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<MainBackground/>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<ShoppingPage/>, document.getElementById("main"));
