import { Component, createRef } from 'react';
import './Chat.scss';
import Input from 'Components/shared/Input/Input';
import {
	faArrowsRotate,
	faPaperPlane,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'Components/shared/Button/Button';
import cookies from 'modules/cookies';
import web from 'modules/web/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'Components/containers/Loader/Loader';

class Chat extends Component {
	constructor() {
		super();

		this.state = {
			message: '',
			botTyping: true,
		};

		this.chatRef = createRef();
		this.messagesRef = createRef();
	}

	async getMessages() {
		const { nickname } = this.state;

		this.setState({
			messages: [
				{
					content: `Hello ${nickname}, my name is MindMate. What can I help you with?`,
					sender: 'bot',
				},
			],
		});
	}

	getNickname() {
		return new Promise(async (resolve) => {
			const email = cookies.get('email');
			const password = cookies.get('password');

			const user = await web.login({
				email,
				password,
			});

			this.setState(
				{
					nickname: user.nickname,
					botTyping: false,
				},
				resolve
			);
		});
	}

	async componentDidMount() {
		await this.getNickname();
		await this.getMessages();
	}

	enableTyping() {
		this.setState({ typing: true });
	}

	disableTyping() {
		this.setState({ typing: false });
	}

	enableBotTyping() {
		this.setState({ botTyping: true });
	}

	disableBotTyping() {
		this.setState({ botTyping: false });
	}

	handleContentChange(message) {
		clearTimeout(this.typingTimer);
		this.enableTyping();

		this.typingTimer = setTimeout(() => {
			this.disableTyping();
		}, 3000);

		this.setState({ message });
	}

	async streamPromptChatGPT() {
		const { messages } = this.state;

		let message = '';
		let first = true;

		this.setState({
			needsScroll: true,
		});

		await web.streamChatCompletion({
			messages: messages.map((message) => {
				return {
					content: message.content,
					role: message.sender === 'bot' ? 'assistant' : 'user',
				};
			}),
			onChunk: (chunk) => {
				message += chunk;

				if (!first) {
					this.setState({
						messages: [
							...messages.slice(0, messages.length),
							{
								content: message,
								sender: 'bot',
							},
						],
					});
				}

				if (first) {
					first = false;
				}
			},
		});

		this.setState({
			needsScroll: true,
		});
	}

	async promptChatGPT() {
		if (window.location.hostname === 'localhost') {
			await this.streamPromptChatGPT();

			return;
		}

		const { messages } = this.state;

		this.enableBotTyping();

		const response = await web.createChatCompletion({
			messages: messages.map((message) => {
				return {
					content: message.content,
					role: message.sender === 'bot' ? 'assistant' : 'user',
				};
			}),
		});

		this.disableBotTyping();

		this.setState({
			messages: [
				...messages,
				{
					content: response,
					sender: 'bot',
				},
			],
			needsScroll: true,
		});
	}

	sendMessage() {
		this.disableTyping();

		const { message, messages } = this.state;
		const { onMessage } = this.props;

		if (!message) {
			return;
		}

		if (onMessage) {
			onMessage(message);
		}

		this.setState(
			{
				messages: [
					...messages,
					{
						content: message,
						sender: 'user',
					},
				],
				message: '',
			},
			this.promptChatGPT
		);
	}

	redoMessage(index) {
		const { messages } = this.state;

		this.setState(
			{
				messages: messages.slice(0, index),
				message: messages[index].content,
			},
			this.promptChatGPT
		);
	}

	updateChatHeight() {
		if (!this.chatRef.current) {
			return;
		}

		const chat = this.chatRef.current;
		chat.style.height = window.innerHeight - chat.offsetTop + 'px';
	}

	scrollToBottom() {
		// const { needsScroll } = this.state;
		// const messages = this.messagesRef.current;
		// if (!needsScroll || !messages) {
		// 	return;
		// }
		// messages.scrollTop = messages.scrollHeight;
		// this.setState({
		// 	needsScroll: false,
		// });
	}

	componentDidUpdate() {
		this.scrollToBottom();
		this.updateChatHeight();

		const { problemMessage } = this.props;
		const { sentProblemMessage } = this.state;

		if (problemMessage && !sentProblemMessage) {
			this.setState(
				{
					message: problemMessage,
					sentProblemMessage: true,
				},
				this.sendMessage
			);
		}
	}

	render() {
		const { messages, message, typing, botTyping } = this.state;

		const messagesList = messages?.map((message, index) => {
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
					{isBot && index !== 0 && (
						<FontAwesomeIcon
							className='redo-icon'
							onClick={this.redoMessage.bind(this, index)}
							icon={faArrowsRotate}
						/>
					)}
					{/* {index === messages.length - 1 && messages.length > 1 && (
						<div className='newest-message-label'></div>
					)} */}
				</div>
			);
		});

		return messages ? (
			<div className='chat' ref={this.chatRef}>
				<div className='messages' ref={this.messagesRef}>
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
				<div className='actions'>
					<Input
						label='Message'
						placeholder='Type a message to chat'
						value={message}
						onChange={this.handleContentChange.bind(this)}
					/>
					<Button
						className='send'
						label='Send'
						icon={faPaperPlane}
						onClick={this.sendMessage.bind(this)}
						big
						cta
					/>
				</div>
			</div>
		) : (
			<Loader />
		);
	}
}

export default Chat;
