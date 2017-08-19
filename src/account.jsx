import React from 'react';
import ReactDom from 'react-dom';
import {Header, Footer} from './base.jsx';

class AccountPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			usernameTaken: false
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
				this.checkUsername();
			}
		}
	}

	checkUsername() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let newState = this.state;
				newState.usernameTaken = (xhttp.responseText == "true");
				console.log(xhttp.responseText == "true");
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
		return (
			<div>
				<center>
					<form onSubmit={this.checkPassword}>
						<p className="label">Username:</p>
						<input className="textInput" type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
						<p className="label">Password:</p>
						<input className="textInput" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
						<input className="logInButton" type="submit" name="logIn" value="Log In"/>
					</form>
				</center>
			</div>
		);
	}
}

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
ReactDom.render(<AccountPage/>, document.getElementById("main"));
