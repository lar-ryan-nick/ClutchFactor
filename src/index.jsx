import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer} from './base.jsx';

class LandingPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div className="landingImageDiv">
					<img className="landingImage" src="images/LandingPageImage1.jpg"/>
					<p className="landingText1">Revolutionary to the fashion industry</p>
				</div>
				<div className="landingImageDiv">
					<img className="landingImage" src="images/LandingPageImage2.jpg"/>
					<p className="landingText2">A style everyone can share</p>
				</div>
				<div className="LandingImageDiv">
					<img className="landingImage" src="images/LandingPageImage3.jpg"/>
					<p className="landingText3">Encorporating family values into our very fabric</p>
				</div>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<LandingPage/>, document.getElementById("main"));
