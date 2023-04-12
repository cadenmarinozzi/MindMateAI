import OpenAILogo from 'assets/images/OpenAI.png';
import { Component } from 'react';
import { Gradient } from 'react-gradient';
import Button from 'Components/shared/Button/Button';
import { faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.scss';
import Loader from 'Components/containers/Loader/Loader';

const gradients = [
	['#bd19d6', '#10a1ea'],
	['#ff2121', '#19b7d6'],
];

class Home extends Component {
	constructor() {
		super();

		this.state = {
			typing: true,
			messages: [
				{
					content: "What's on your mind today?",
					sender: 'bot',
				},
			],
		};
	}

	render() {
		const { loggedIn, loaded } = this.props;
		const { messages, typing, botTyping } = this.state;

		const messagesList = messages.map((message, index) => {
			const { content, sender } = message;
			const isBot = sender === 'bot';

			return (
				<div
					className={`message ${
						!isBot && 'message-user message-right'
					}`}
					key={index}>
					<div className='icon'>
						{isBot ? '🧠' : <FontAwesomeIcon icon={faUser} />}
					</div>
					<div className='content'>{content}</div>
				</div>
			);
		});

		return loaded ? (
			<div className='home'>
				<div className='hero-content'>
					<div className='header'>
						<h1 className='title'>
							Your personal{' '}
							<Gradient
								gradients={gradients}
								property='text'
								duration={3000}
								angle='45deg'>
								AI
							</Gradient>{' '}
							therapist.
						</h1>
						<span className='caption'>
							Powered by OpenAI{' '}
							<img
								alt='OpenAI Logo'
								width={20}
								src={OpenAILogo}
							/>
						</span>
					</div>
					<Link to={loggedIn ? '/user-home' : '/sign-up'}>
						<Button
							// iconRight={faArrowRight}
							hoverArrow
							label='Begin'
							cta
							bigText
							round
						/>
					</Link>
				</div>
				<div className='home-messages'>
					{messagesList}
					<div
						className={`typing-indicator message-right ${
							typing && 'typing-indicator-visible'
						}`}>
						<div className='dot' />
						<div className='dot' />
						<div className='dot' />
					</div>
					<div
						className={`typing-indicator message-left bot-typing-indicator ${
							botTyping && 'typing-indicator-visible'
						}`}>
						<div className='dot' />
						<div className='dot' />
						<div className='dot' />
					</div>
				</div>
			</div>
		) : (
			<Loader />
		);
	}
}

export default Home;
