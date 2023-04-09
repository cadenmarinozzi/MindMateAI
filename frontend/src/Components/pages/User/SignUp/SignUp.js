import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Button from 'Components/shared/Button/Button';
import Input from 'Components/shared/Input/Input';
import '../User.scss';
import './SignUp.scss';
import { Link } from 'react-router-dom';
import web from 'modules/web/web';
import cookies from 'modules/cookies';

class SignUp extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async signUp() {
		const { nickname, email, password, confirmPassword } = this.state;

		if (!nickname || !email || !password || !confirmPassword) {
			return;
		}

		if (password !== confirmPassword) {
			return;
		}

		const user = await web.signUp({
			nickname,
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

	handleNicknameChange(nickname) {
		this.setState({ nickname });
	}

	handleEmailChange(email) {
		this.setState({ email });
	}

	handlePasswordChange(password) {
		this.setState({ password });
	}

	handleConfirmPasswordChange(confirmPassword) {
		this.setState({ confirmPassword });
	}

	render() {
		return (
			<div className='user-form'>
				<div className='header'>
					<h4 className='title'>
						<FontAwesomeIcon icon={faUserPlus} /> Sign Up
					</h4>
					<span className='caption'>Sign up to use MindMateAI</span>
				</div>
				<div className='details'>
					<Input
						label='Nickname'
						required
						placeholder='A nickname to be called by'
						onChange={this.handleNicknameChange.bind(this)}
					/>
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
						placeholder='Your password'
						onChange={this.handlePasswordChange.bind(this)}
					/>
					<Input
						label='Confirm Password'
						required
						hideStrengthMeter
						type='password'
						placeholder='Your password again'
						onChange={this.handleConfirmPasswordChange.bind(this)}
					/>
				</div>
				<Link to='/information-security' className='info-message'>
					How is your information secured?
				</Link>
				<div className='actions'>
					<Button
						label='Submit'
						icon={faUserPlus}
						cta
						onClick={this.signUp.bind(this)}
					/>
					<Link to='/login'>
						<Button label='Login' icon={faUser} />
					</Link>
				</div>
			</div>
		);
	}
}

export default SignUp;
