import { Link } from 'react-router-dom';
import './Navbar.scss';
import Button from 'Components/shared/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Component } from 'react';
import cookies from 'modules/cookies';

class Navbar extends Component {
	logout() {
		cookies.del('email');
		cookies.del('password');

		window.location = '/';
	}

	render() {
		const { loggedIn } = this.props;

		return (
			<div className='navbar'>
				<div className='section'>
					<Link to='/home'>
						<h4>🧠 MindMateAI</h4>
					</Link>
				</div>
				<div className='section'>
					{loggedIn ? (
						<>
							<span
								className='logout-button'
								onClick={this.logout.bind(this)}>
								Logout
							</span>
							<Link to='/user'>
								<FontAwesomeIcon icon={faUser} />
							</Link>
						</>
					) : (
						<>
							<Link to='/login'>Login</Link>
							<Link to='/sign-up'>
								<Button label='Sign Up' cta />
							</Link>
						</>
					)}
				</div>
			</div>
		);
	}
}

export default Navbar;
