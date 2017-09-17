import React from 'react';

class MerchandisePage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numMerchandise: 0,
			data: []
		};
		this.getMerchandiseInfo = this.getMerchandiseInfo.bind(this);
		this.getNumMerchandise = this.getNumMerchandise.bind(this);
		this.getNumMerchandise(function() {
			for (let i = 0; i < this.state.numMerchandise; ++i) {
				this.getMerchandiseInfo(i);
			}
		}.bind(this));
	}

	getNumMerchandise(cb) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numMerchandise = parseInt(xhttp.responseText);
				this.setState(newState);
				cb();
			}
		}.bind(this);
		xhttp.open("GET", "/getNumMerchandise", true);
		xhttp.send();
	}

	getMerchandiseInfo(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.data[index] = JSON.parse(xhttp.responseText);
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/getMerchandiseInfo?index=" + index, true);
		xhttp.send();
	}

	render() {
		let products = [];
		for (let i = 0; i < this.state.data.length; ++i) {
			products.push(<MerchandiseItem key={i} index={i} data={this.state.data[i]}/>);
		}
		return (
			<div>
				<div className="merchandiseContainer">
					{products}
				</div>
			</div>
		);
	}
}

export default MerchandisePage
