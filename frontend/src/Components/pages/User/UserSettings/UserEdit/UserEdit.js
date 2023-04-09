import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import Input from 'Components/shared/Input/Input';
import Button from 'Components/shared/Button/Button';
import './UserEdit.scss';
import '../../User.scss';
import cookies from 'modules/cookies';
import web from 'modules/web/web';

class UserEdit extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async submitEdits() {
		const { nickname } = this.state;

		if (!nickname) {
			return;
		}

		const email = cookies.get('email');
		const password = cookies.get('password');

		await web.editUserNickname({
			nickname,
			email,
			password,
		});

		window.location = '/';
	}

	handleNicknameChange(nickname) {
		this.setState({ nickname });
	}

	render() {
		return (
			<div className='user-form'>
				<div className='header'>
					<h4 className='title'>
						<FontAwesomeIcon icon={faUser} /> Edit Account
					</h4>
				</div>
				<div className='details'>
					<Input
						label='Nickname'
						required
						placeholder='A nickname to be called by'
						onChange={this.handleNicknameChange.bind(this)}
					/>
				</div>
				<div className='actions'>
					<Button
						label='Submit Edits'
						icon={faUserEdit}
						cta
						onClick={this.submitEdits.bind(this)}
					/>
				</div>
			</div>
		);
	}
}

export default UserEdit;
