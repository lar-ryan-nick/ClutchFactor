import React from 'react';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userData: {},
		};
		this.goToMain = this.goToMain.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.logOut = this.logOut.bind(this);
		this.goToCart = this.goToCart.bind(this);
		this.getUserInfo();
	}

	goToMain() {
		window.location = "/index.html";
	}

	getUserInfo() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText != "{}") {
					let newState = this.state;
					newState.userData = JSON.parse(xhttp.responseText);
					this.setState(newState);
				} else {
					let newState = this.state;
					newState.userData = {
						email: ""
					};
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getUserInfo", true);
		xhttp.send();
	}

	logOut() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.userData = {
					email: ""
				};
				this.setState(newState);
				if (this.props.refresh != null) {
					this.props.refresh();
				}
			}
		}.bind(this);
		xhttp.open("GET", "/logOut", true);
		xhttp.send();
	}

	goToCart() {
		window.location = "/cart.html";
	}

	render() {
		let accountStuff = [];
		if (this.state.userData.email == "") {
			accountStuff.push(<a className="headerAccountLink" key="1" href="account.html">Log In/Create an Account</a>);
		} else if (this.state.userData.email != null) {
			let name = this.state.userData.email;
			if (this.state.userData.firstname != "") {
				name = this.state.userData.firstname;
			} else if (this.state.userData.lastname != "") {
				name = this.state.userData.lastname;
			}
			accountStuff.push(<p key ="1" className="headerGreeting">{"Hello " + name}</p>);
			if (this.props.numCartItems > 0) {
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="CartIcon.png" onClick={this.goToCart}/><p key="4" className="cartNumBadge">{this.props.numCartItems}</p></div>);
			} else {
				accountStuff.push(<div key="2" className="cartIconDiv"><img key="3" className="cartIcon" src="CartIcon.png" onClick={this.goToCart}/></div>);
			}
			accountStuff.push(<button key="3" className="headerLogOutButton" onClick={this.logOut}>Log Out</button>);
		}
		return (
			<div className="header">
				<img className="headerLogo" src="ClutchFactor.png" onClick={this.goToMain}/>
				<a className="headerMerchandise" href="merchandise.html">Merchandise</a>
				{accountStuff}
			</div>
		)
	}
}

class CartItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.data == null || this.props.data == {}) {
			return (
				<div></div>
			);
		}
		let remove = [];
		if (this.props.data.loading == true) {
			remove.push(<div key="1" className="loader"></div>);
		} else {
			remove.push(<button key="1" className="removeProductButton" onClick={this.props.removeItem}>Remove from cart</button>);
			if (this.props.data.response != null) {
				remove.push(<div key="2"><img key="3" className="icon" src="/RedXIcon.png"/><p key="4" className="errorLabel">{this.props.data.response}</p></div>);
			}
		}
		return (
			<div className="cartItemDiv">
				<img className="productImage" src={"/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + "Low.png"}/>
				<div className="TitleAndOptionsDiv">
					<a className="productTitle" href={"/product.html?id=" + this.props.data.productid}>{this.props.data.modelname + " " + this.props.data.articletype + " - " + this.props.data.color}</a>
					{remove}	
				</div>
				<p className="cartPriceTitle">{"$" + this.props.data.price}</p>
			</div>
		);
	}
}

class CartDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleRemove(index) {
		this.props.removeItem(index);
	}

	render() {
		let cartItems = [];
		let total = 0;
		for (let i = 0; i < this.props.data.length; ++i) {
			if (this.props.data[i] != null) {
				cartItems.push(<CartItem key={i} data={this.props.data[i]} removeItem={this.handleRemove.bind(this, i)}/>);
				total += this.props.data[i].price;
			}
		}
		let top = [];
		let totalLabel = null;
		if (this.props.numCartItems != null) {
			if (this.props.numCartItems < 0) {
				top.push(<p key="1" className="cartTitle">You must log in to view your cart</p>);
			} else {
				let text = " items";
				if (this.props.numCartItems == 1) {
					text = " item";
				}
				top.push(<p key="1" className="cartTitle">{"You have " + this.props.numCartItems + text + " in your cart"}</p>);
				totalLabel = <p className="totalTitle">{"Total: $" + total}</p>;
			}
		}
		return (
			<div className="cartDiv">
				{top}
				{cartItems}
				{totalLabel}
			</div>
		);
	}
}

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

class Page extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numCartItems: null,
			data: [],
		}
		this.getNumCartItems = this.getNumCartItems.bind(this);
		this.getCartItemInfo = this.getCartItemInfo.bind(this);
		this.removeCartItem = this.removeCartItem.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refresh();
	}

	getNumCartItems(cb) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				let newState = this.state;
				newState.numCartItems = parseInt(xhttp.responseText);
				this.setState(newState);
				cb();
			}
		}.bind(this);
		xhttp.open("GET", "/getNumCartItems", true);
		xhttp.send();
	}

	getCartItemInfo(index) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText != "{}") {
					let newState = this.state;
					newState.data[index] = JSON.parse(xhttp.responseText);
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/getCartItemInfo?index=" + index, true);
		xhttp.send();
	}

	removeCartItem(index) {
		let newState = this.state;
		newState.data[index].loading = true;
		delete newState.data[index].response;
		this.setState(newState);
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText == "Removed the cart item successfully") {
					this.refresh();
				} else {
					let newState = this.state;
					newState.data[index].loading = false;
					newState.data[index].response = xhttp.responseText;
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("GET", "/removeCartItem?id=" + this.state.data[index].id, true);
		xhttp.send();
	}

	refresh() {
		this.getNumCartItems(function() {
			if (this.state.data.length > this.state.numCartItems) {
				let newState = this.state;
				if (this.state.numCartItems < 1) {
					newState.data = [];
				} else {
					newState.data.splice(this.state.numCartItems, this.state.data.length - this.state.numCartItems);
				}
				this.setState(newState);
			}
			for (let i = 0; i < this.state.numCartItems; ++i) {
				this.getCartItemInfo(i);
			}
		}.bind(this));
	}

	render(thingy) {
		let inside = this.props.inside;
		if (thingy != null) {
			inside = thingy;
		}
		return (
			<div>
				<Main inside={inside}/>
				<Footer/>
				<Header refresh={this.refresh} numCartItems={this.state.numCartItems}/>
			</div>
		);
	}
}

export {CartDisplay, Page};
