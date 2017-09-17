import React from 'react';

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
			emailError.push(<img key="1" className="icon" src="/GreenCheckIcon.png"/>);
			if (this.state.passwordError) {
				passwordError.push(<img key="1" className="icon" src="/RedXIcon.png"/>);
				passwordError.push(<p key="2" className="errorLabel">That password is incorrect</p>);
			}
		} else if (this.state.emailError != "") {
			emailError.push(<img key="1" className="icon" src="/RedXIcon.png"/>);
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

export default LogInForm;
