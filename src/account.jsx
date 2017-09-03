import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer, MainBackground} from './base.jsx';

class LogInForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			emailError: "",
			passwordError: false,
			checkingPassword: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
	}

	handleChange(event) {
		if (event) {
			let newState = this.state;
			newState[event.target.name] = event.target.value;
			newState.passwordError = false;
			this.setState(newState);
			if (event.target.name == "email") {
				this.checkEmail();
			}
		}
	}

	checkEmail() {
		let pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (this.state.email == "") {
			let newState = this.state;
			newState.emailError = "";
			this.setState(newState);
		} else if (!pattern.test(this.state.email)) {
			let newState = this.state;
			newState.emailError = "Please enter a valid email address";
			this.setState(newState);
		} else {
			let originalEmail = this.state.email;
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200 && originalEmail == this.state.email) {
					let newState = this.state;
					newState.emailError = xhttp.responseText;
					this.setState(newState);
				}
			}.bind(this);
			xhttp.open("GET", "/checkEmail?email=" + this.state.email, true);
			xhttp.send();
		}
	}

	checkPassword(event) {
		event.preventDefault();
		let newState = this.state;
		newState.checkingPassword = true;
		this.setState(newState);
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText == "true") {
					window.location = "index.html";
				} else {
					let newState = this.state;
					newState.passwordError = true;
					newState.checkingPassword = false;
					this.setState(newState);
				}
			}
		}.bind(this);
		xhttp.open("POST", "/checkPassword", true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("email=" + this.state.email + "&password=" + this.state.password);
	}

	render() {
		let emailError = [];
		let passwordError = [];
		//keep == so -1 does not count as true
		if (this.state.emailError == "That email has already been registered") {
			emailError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
			if (this.state.passwordError) {
				passwordError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
				passwordError.push(<p key="2" className="errorLabel">That password is incorrect</p>);
			}
		} else if (this.state.emailError != "") {
			emailError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
			emailError.push(<p key="2" className="errorLabel">{this.state.emailError}</p>);
		}
		let formBottom = [];
		if (this.state.checkingPassword) {
			formBottom.push(<div key="1" className="loader"></div>);
		} else {
			formBottom.push(<input key="1" className="logInButton" type="submit" name="logIn" value="Log In"/>);
		}
		return (
			<div>
				<form onSubmit={this.checkPassword}>
					<p className="label">Email:</p>
					<div>
						{emailError}
					</div>
					<input className="textInput" type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
					<p className="label">Password:</p>
					<div>
						{passwordError}
					</div>
					<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
					{formBottom}
				</form>
			</div>
		);
	}
}

class CreateAccountForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			emailError: "",
			passwordError: -1,
			submitDisabled: false,
			sentEmail: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
		this.createAccount = this.createAccount.bind(this);
	}

	handleChange(event) {
		if (event) {
			let newState = this.state;
			newState[event.target.name] = event.target.value;
			this.setState(newState);
			if (event.target.name == "email") {
				this.checkEmail();
			} else if (event.target.name == "password") {
				this.checkPassword();
			}
		}
	}

	checkEmail() {
		let pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (this.state.email == "") {
			let newState = this.state;
			newState.emailError = "";
			this.setState(newState);
		} else if (!pattern.test(this.state.email)) {
			let newState = this.state;
			newState.emailError = "Please enter a valid email address";
			this.setState(newState);
		} else {
			let originalEmail = this.state.email;
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200 && originalEmail == this.state.email) {
					let newState = this.state;
					newState.emailError = xhttp.responseText;
					this.setState(newState);
				}
			}.bind(this);
			xhttp.open("GET", "/checkEmail?email=" + this.state.email, true);
			xhttp.send();
		}
	}

	checkPassword() {
		let newState = this.state;
		if (this.state.password.length >= 8) {
			newState.passwordError = false;
		} else if (this.state.password.length == 0) {
			newState.passwordError = -1;
		} else {
			newState.passwordError = true;
		}
		this.setState(newState);
	}

	createAccount(event) {
		event.preventDefault();
		if (this.state.emailError == "That email has not been registered yet" && this.state.passwordError == false && this.state.password != "") {
			let newState = this.state;
			newState.submitDisabled = true;
			this.setState(newState);
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					newState = this.state;
					newState.sentEmail = true;
					this.setState(newState);
				} else if (xhttp.status == 404) {
					newState = this.state;
					newState.submitDisabled = false;
					this.setState(newState);
				}
			}.bind(this);
			xhttp.open("POST", "/sendAccountCreationEmail", true);
			xhttp.send("email=" + this.state.email + "&password=" + this.state.password + "&firstName=" + this.state.firstName + "&lastName=" + this.state.lastName);
		}
	}

	render() {
		if (this.state.sentEmail) {
			return (
				<div>
					<img className="largeIcon" src="images/GreenCheckIcon.png"/>
					<p className="emailSentNotfication">An email has been sent to the address that you supplied</p>
				</div>
			);
		} else {
			let emailError = [];
			if (this.state.emailError == "That email has not been registered yet") {
				emailError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
			} else if (this.state.emailError != "") {
				emailError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
				emailError.push(<p key="2" className="errorLabel">{this.state.emailError}</p>);
			}
			let passwordError = [];
			if (this.state.passwordError == true) {
				passwordError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
				passwordError.push(<p key="2" className="errorLabel">Password must be at least 8 characters</p>);
			} else if (this.state.passwordError == false) {
				passwordError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
			}
			let formBottom = [];
			if (this.state.submitDisabled) {
				formBottom.push(<div key="1" className="loader"></div>);
			} else {
				formBottom.push(<input key="1" className="logInButton" type="submit" name="logIn" value="Log In"/>);
			}
			return (
				<div>
					<form onSubmit={this.createAccount}>
						<p className="label">Email:</p>
						<div>
							{emailError}
						</div>
						<input className="textInput" type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
						<p className="label">Password:</p>
						<div>
							{passwordError}
						</div>
						<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
						<p className="label">First Name:</p>
						<input className="textInput" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange}/>
						<p className="label">Last Name:</p>
						<input className="textInput" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange}/>
						{formBottom}
					</form>
				</div>
			);
		}
	}
}


class AccountPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggingIn: true
		};
		this.goToLogInForm = this.goToLogInForm.bind(this);
		this.goToCreateAccountForm = this.goToCreateAccountForm.bind(this);
	}

	goToLogInForm() {
		this.setState({
			loggingIn: true
		});
	}

	goToCreateAccountForm() {
		this.setState({
			loggingIn: false
		});
	}

	render() {
		let topButtons = [];
		let form = [];
		if (this.state.loggingIn) {
			form.push(<LogInForm key="1"/>);
			topButtons.push(<p className="changeFormLabel" key="1">Log In</p>);
			topButtons.push(<button className="changeFormButtonRight" key="2" onClick={this.goToCreateAccountForm}>Create Account</button>);
		} else {
			form.push(<CreateAccountForm key="2"/>);
			topButtons.push(<button className="changeFormButtonLeft" key="1" onClick={this.goToLogInForm}>Log In</button>);
			topButtons.push(<p className="changeFormLabel" key="2">Create Account</p>);
		}
		return (
			<div>
				<MainBackground/>
				<div className="AccountContainer">
					{topButtons}
					{form}
				</div>
			</div>
		);
	}
}

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
					<AccountPage/>
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

ReactDom.render(<Page ref={(input) => {page = input}}/>, document.getElementById("page"));

window.onresize = page.resize;
