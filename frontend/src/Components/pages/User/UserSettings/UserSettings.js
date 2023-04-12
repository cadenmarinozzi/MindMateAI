import { Component } from 'react';
import Button from 'Components/shared/Button/Button';
import {
	faSpinner,
	faUserEdit,
	faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import cookies from 'modules/cookies';
import web from 'modules/web/web';
import './UserSettings.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'Components/containers/Loader';
class UserSettings extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async componentDidMount() {
		const email = cookies.get('email');
		const password = cookies.get('password');

		const user = await web.login({
			email,
			password,
		});

		this.setState({ user });
	}

	async deleteAccount() {
		const email = cookies.get('email');
		const password = cookies.get('password');

		await web.deleteAccount({
			email,
			password,
		});

		cookies.del('email');
		cookies.del('password');

		window.location = '/';
	}

	render() {
		const { user } = this.state;

		return user ? (
			<div className='user-settings'>
				<div className='header'>
					<h3>User Settings</h3>
				</div>
				<div className='section'>
					<h4>Account</h4>
					<span>Nickname: {user.nickname}</span>
					<span>Email: {user.email}</span>
					<Link to='/user-edit'>
						<Button label='Edit Account' icon={faUserEdit} />
					</Link>
					<Button
						label='Delete Account'
						danger
						icon={faUserSlash}
						onClick={this.deleteAccount.bind(this)}
					/>
				</div>
				<div className='section'>
					<h4>Chat Settings</h4>
				</div>
			</div>
		) : (
			<Loader />
		);
	}
}

export default UserSettings;
