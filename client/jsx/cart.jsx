import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import CartPage from './cartPage.jsx';

class PageExtension extends Page {

	constructor(props) {
		super(props);
	}

	render() {
		 return super.render(<CartPage numCartItems={this.state.numCartItems} data={this.state.data} removeItem={this.removeCartItem}/>);
	}
}

ReactDom.render(<PageExtension/>, document.getElementById("page"));
