import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer} from './base.jsx';

class AccountPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<AccountPage/>, document.getElementById("main"));
