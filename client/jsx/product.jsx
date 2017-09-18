import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import ProductPage from './productPage.jsx';

class PageExtended extends Page {

	constructor(props) {
		super(props);
	}

	render() {
		return super.render(<ProductPage refresh={this.refresh}/>);
	}
}

ReactDom.render(<PageExtended/>, document.getElementById("page"));
