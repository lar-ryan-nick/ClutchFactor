import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer} from './base.jsx';

class AccountPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			usernameTaken: -1
		};
		this.handleChange = this.handleChange.bind(this);
		this.checkUsername = this.checkUsername.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
	}

	handleChange(event) {
		if (event) {
			let newState = this.state;
			newState[event.target.name] = event.target.value;
			this.setState(newState);
			if (event.target.name == "username") {
				if (event.target.value == "") {
					newState.usernameTaken = -1;
					this.setState(newState);
				} else {
					this.checkUsername();
				}
			}
		}
	}

	checkUsername() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.usernameTaken = (xhttp.responseText == "true");
				this.setState(newState);
			}
		}.bind(this);
		xhttp.open("GET", "/checkUsername?username=" + this.state.username, true);
		xhttp.send();
	}

	checkPassword(event) {
		event.preventDefault();
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				if (xhttp.responseText == "true") {
					window.location = "index.html";
				}
			}
		}.bind(this);
		xhttp.open("POST", "/checkPassword", true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("username=" + this.state.username + "&password=" + this.state.password);
	}

	render() {
		let usernameError = [];
		if (this.state.usernameTaken == false) {
			usernameError.push(<img className="icon" src="images/RedXIcon.png"/>);
			usernameError.push(<p className="errorLabel">That username does not exist</p>);
		} else if (this.state.usernameTaken == true) {
			usernameError.push(<img className="icon" src="images/GreenCheckIcon.png"/>);
		}
		return (
			<div>
				<form onSubmit={this.checkPassword}>
					<p className="label">Username:</p>
					<div>
						<input className="textInput" type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
						{usernameError}
					</div>
					<p className="label">Password:</p>
					<div>
						<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
					</div>
					<input className="logInButton" type="submit" name="logIn" value="Log In"/>
				</form>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<AccountPage/>, document.getElementById("main"));
