import React from 'react';
import LogInForm from './logInForm.jsx';
import CreateAccountForm from './createAccountForm.jsx';

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
				<div className="AccountContainer">
					{topButtons}
					{form}
				</div>
			</div>
		);
	}
}

export default AccountPage;
