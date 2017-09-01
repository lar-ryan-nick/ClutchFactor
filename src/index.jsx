import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null
		}
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.resize = this.resize.bind(this);
		this.getNumCartItems();
	}

	getNumCartItems() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numCartItems = parseInt(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getNumCartItems", true);
		xhttp.send();
	}

	resize() {
		if (this.main != null) {
			if (window.innerHeight - 251 <= 0 || window.innerWidth / (window.innerHeight - 251) > 8 / 5) {
				this.main.style.minHeight = window.innerWidth * 5 / 8;
			} else {
				this.main.style.minHeight = "calc(100% - 251px)";
			}
		}
	}

	componentDidMount() {
		this.resize();
	}

	render() {
		return (
			<div>
				<div ref={(input) => {this.main = input;}} className="main">
					<MainBackground/>
					<p className="landingText">Let's cut the bullshit here's our shit</p>
					<a className="merchandiseLink" href="/merchandise.html">Start Shopping</a>
				</div>
				<div className="footer">
					<Footer/>
				</div>
				<div className="header">
					<Header numCartItems={this.state.numCartItems}/>
				</div>
			</div>
		);
	}
}

var page;

ReactDom.render(<Page ref={(input) => {page = input;}}/>, document.getElementById("page"));

window.onresize = page.resize;
