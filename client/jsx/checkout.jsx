import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import CheckoutPage from './checkoutPage.jsx';

class PageExtension extends Page {

	constructor(props) {
		super(props);
	}

	render() {
		let inside = <CheckoutPage numCartItems={this.state.numCartItems} data={this.state.cartData} removeItem={this.removeItem}/>;
		if (this.state.numCartItems == null) {
			inside = <div></div>;
		} else if (this.state.userData.email == "") {
			inside = <p className="notLoggedInError">Must log in to checkout</p>;
		}
		return super.render(inside);
	}
}

ReactDom.render(<PageExtension/>, document.getElementById("page"));
