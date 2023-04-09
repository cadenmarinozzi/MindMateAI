import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Button from 'Components/shared/Button/Button';
import Input from 'Components/shared/Input/Input';
import '../User.scss';
import './Login.scss';
import cookies from 'modules/cookies';
import web from 'modules/web/web';
import { Link } from 'react-router-dom';

class Login extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async login() {
		const { email, password } = this.state;

		if (!email || !password) {
			return;
		}

		const user = await web.login({
			email,
			password,
		});

		if (!user) {
			return;
		}

		cookies.set('email', email);
		cookies.set('password', password);

		window.location = '/';
	}

	handleEmailChange(email) {
		this.setState({ email });
	}

	handlePasswordChange(password) {
		this.setState({ password });
	}

	render() {
		return (
			<div className='user-form'>
				<div className='header'>
					<h4 className='title'>
						<FontAwesomeIcon icon={faUser} /> Login
					</h4>
					<span className='caption'>Login to use MindMateAI</span>
				</div>
				<div className='details'>
					<Input
						label='Email'
						required
						placeholder='Your email'
						onChange={this.handleEmailChange.bind(this)}
					/>
					<Input
						label='Password'
						required
						type='password'
						hidesStrengthMeter
						placeholder='Your password'
						onChange={this.handlePasswordChange.bind(this)}
					/>
				</div>
				<div className='actions'>
					<Button
						label='Submit'
						icon={faUser}
						cta
						onClick={this.login.bind(this)}
					/>
					<Link to='/sign-up'>
						<Button label='Sign Up' icon={faUserPlus} />
					</Link>
				</div>
			</div>
		);
	}
}

export default Login;
