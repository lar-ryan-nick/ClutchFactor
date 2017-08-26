import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class LandingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<MainBackground/>
				<p className="landingText">Let's cut the bullshit here's our shit</p>
				<a className="merchandiseLink" href="/merchandise.html">Start Shopping</a>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<LandingPage/>, document.getElementById("main"));
