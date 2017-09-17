import React from 'react';

class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.resize = this.resize.bind(this);
		window.onresize = this.resize;
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
			<div className="main" ref={(input) => {this.main = input;}}>
				<div className="backgroundImageDiv">
					<img className="backgroundImage" src="BackgroundImage.jpg"/>
				</div>
				{this.props.inside}
			</div>
		);
	}
}

export default Main;
