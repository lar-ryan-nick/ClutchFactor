import React from 'react';

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
			xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhttp.send("email=" + this.state.email + "&password=" + this.state.password + "&firstName=" + this.state.firstName + "&lastName=" + this.state.lastName);
		}
	}

	render() {
		if (this.state.sentEmail) {
			return (
				<div>
					<img className="largeIcon" src="/GreenCheckIcon.png"/>
					<p className="emailSentNotfication">An email has been sent to the address that you supplied</p>
				</div>
			);
		} else {
			let emailError = [];
			if (this.state.emailError == "That email has not been registered yet") {
				emailError.push(<img key="1" className="icon" src="/GreenCheckIcon.png"/>);
			} else if (this.state.emailError != "") {
				emailError.push(<img key="1" className="icon" src="/RedXIcon.png"/>);
				emailError.push(<p key="2" className="errorLabel">{this.state.emailError}</p>);
			}
			let passwordError = [];
			if (this.state.passwordError == true) {
				passwordError.push(<img key="1" className="icon" src="/RedXIcon.png"/>);
				passwordError.push(<p key="2" className="errorLabel">Password must be at least 8 characters</p>);
			} else if (this.state.passwordError == false) {
				passwordError.push(<img key="1" className="icon" src="/GreenCheckIcon.png"/>);
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

export default CreateAccountForm;
