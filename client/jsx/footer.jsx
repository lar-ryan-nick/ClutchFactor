import React from 'react';

class Footer extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="footer">
				<div className="footerTop">
					<img className="footerLogo" src="CFLogo.png"/>
				</div>
				<div className="footerBottom">
					<p className="footerCopyright">© 2017 Clutch Factor, All Rights Reserved</p>
				</div>
			</div>
		);
	}
}

export default Footer;
