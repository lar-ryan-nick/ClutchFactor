import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer} from './base.jsx';

class LogInForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			emailError: -1,
			passwordError: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
	}

	handleChange(event) {
		if (event) {
			let newState = this.state;
			newState[event.target.name] = event.target.value;
			this.setState(newState);
			if (event.target.name == "email") {
				if (event.target.value == "") {
					newState.emailError = -1;
					this.setState(newState);
				} else {
					this.checkEmail();
				}
			} else if (event.target.name == "password") {
				newState.passwordError = false;
				this.setState(newState);
			}
		}
	}

	checkEmail() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.emailError = (xhttp.responseText == "true");
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/checkEmail?email=" + this.state.email, true);
		xhttp.send();
	}

	checkPassword(event) {
		event.preventDefault();
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText == "true") {
					window.location = "index.html";
				} else if (this.state.emailError == true) {
					let newState = this.state;
					newState.passwordError = true;
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
		if (this.state.emailError == false) {
			emailError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
			emailError.push(<p key="2" className="errorLabel">That email is not registered with an account</p>);
		} else if (this.state.emailError == true) {
			emailError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
			if (this.state.passwordError) {
				passwordError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
				passwordError.push(<p key="2" className="errorLabel">That password is incorrect</p>);
			}
		}
		return (
			<div>
				<form onSubmit={this.checkPassword}>
					<p className="label">Email:</p>
					<div>
						{emailError}
					</div>
					<input className="textInput" type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
					<p className="label">Password:</p>
					<div>
						{passwordError}
					</div>
					<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
					<input className="logInButton" type="submit" name="logIn" value="Log In"/>
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
			emailError: -1,
			passwordError: -1
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
				if (event.target.value == "") {
					newState.emailError = -1;
					this.setState(newState);
				} else {
					this.checkEmail();
				}
			} else if (event.target.name == "password") {
				this.checkPassword();
			}
		}
	}

	checkEmail() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.emailError = (xhttp.responseText == "true");
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/checkEmail?email=" + this.state.email, true);
		xhttp.send();
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
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("Done:)");
			}
		}.bind(this);
		xhttp.open("POST", "/sendAccountCreationEmail", true);
		xhttp.send("email=" + this.state.email + "&password=" + this.state.password + "&firstName=" + this.state.firstName + "&lastName=" + this.state.lastName);
	}

	render() {
		let emailError = [];
		let passwordError = [];
		//keep == so -1 does not count as true
		if (this.state.emailError == true) {
			emailError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
			emailError.push(<p key="2" className="errorLabel">That email has already been registered</p>);
		} else if (this.state.emailError == false) {
			emailError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
		}
		if (this.state.passwordError == true) {
			passwordError.push(<img key="1" className="icon" src="images/RedXIcon.png"/>);
			passwordError.push(<p key="2" className="errorLabel">That password is not valid</p>);
		} else if (this.state.passwordError == false) {
			passwordError.push(<img key="1" className="icon" src="images/GreenCheckIcon.png"/>);
		}
		return (
			<div>
				<form onSubmit={this.createAccount}>
					<p className="label">Email:</p>
					<div>
						{emailError}
					</div>
					<input className="textInput" type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
					<p className="label">Password:</p>
					<div>
						{passwordError}
					</div>
					<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
					<p className="label">First Name:</p>
					<input className="textInput" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange}/>
					<p className="label">Last Name:</p>
					<input className="textInput" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange}/>
					<input className="logInButton" type="submit" name="createAccount" value="Create Account"/>
				</form>
			</div>
		);
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
			topButtons.push(<button className="changeFormButton" key="2" onClick={this.goToCreateAccountForm}>Create Account</button>);
		} else {
			form.push(<CreateAccountForm key="2"/>);
			topButtons.push(<button className="changeFormButton" key="1" onClick={this.goToLogInForm}>Log In</button>);
			topButtons.push(<p className="changeFormLabel" key="2">Create Account</p>);
		}
		return (
			<div className="AccountContainer">
				{topButtons}
				{form}
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<AccountPage/>, document.getElementById("main"));
