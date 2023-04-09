import { Component, createRef } from 'react';
import { Gradient } from 'react-gradient';
import './UserHome.scss';
import {
	faArrowDown,
	faComment,
	faMessage,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chat from './Chat/Chat';
import ProblemSelector from './ProblemSelector/ProblemSelector';
import Call from './Call/Call';

const gradients = [
	['#bd19d6', '#10a1ea'],
	['#ff2121', '#19b7d6'],
];

class UserHome extends Component {
	constructor() {
		super();

		this.state = {
			actionsOpen: true,
			activeAction: 'chat',
		};

		this.actionsRef = createRef();
	}

	toggleActions() {
		if (this.state.actionsOpen) {
			this.actionsRef.current.style.transform = 'scaleY(0%)';
			this.actionsRef.current.style.height = '0px';

			this.setState(
				{
					actionsOpen: false,
				},
				() => {
					setTimeout(() => {
						this.setState({
							actionsDone: false,
						});
					}, 300);
				}
			);

			return;
		}

		this.actionsRef.current.style.transform = 'scaleY(100%)';
		this.actionsRef.current.style.height = '200px';

		this.setState(
			{
				actionsOpen: true,
			},
			() => {
				setTimeout(() => {
					this.setState({
						actionsDone: true,
					});
				}, 300);
			}
		);
	}

	selectAction(action) {
		this.setState({ activeAction: action });
	}

	handleProblemSelect(problem) {
		this.setState({
			problemMessage: `I am having a problem with ${problem}.`,
		});
	}

	handleMessage() {
		this.setState({
			hideProblemSelector: true,
		});
	}

	render() {
		const {
			actionsOpen,
			hideProblemSelector,
			activeAction,
			actionsDone,
			problemMessage,
		} = this.state;

		return (
			<div className='user-home'>
				<span className='communication-message'>
					How would you like to commmunicate?
				</span>
				<div className='actions' ref={this.actionsRef}>
					<Gradient
						gradients={gradients}
						property='background'
						duration={3000}
						className={`action ${
							activeAction === 'chat' && 'action-active'
						}`}
						angle='45deg'
						onClick={this.selectAction.bind(this, 'chat')}>
						<div className='details'>
							<h4 className='title'>
								<FontAwesomeIcon icon={faComment} /> Chat
							</h4>
							<span className='description'>
								Have a conversation with MindMateAI!
							</span>
						</div>
					</Gradient>
					<Gradient
						gradients={gradients}
						property='background'
						duration={3000}
						className={`action ${
							activeAction === 'call' && 'action-active'
						}`}
						onClick={this.selectAction.bind(this, 'call')}
						angle='0deg'>
						<div className='details'>
							<h4 className='title'>
								<FontAwesomeIcon icon={faPhone} /> Call
							</h4>
							<span className='description'>
								Talk to MindMateAI over a voice call!
							</span>
						</div>
					</Gradient>
				</div>
				<div className='divider'>
					<div className='close-icon-container'>
						<FontAwesomeIcon
							className={`close-icon ${
								actionsOpen && 'close-icon-open'
							}`}
							icon={faArrowDown}
							onClick={this.toggleActions.bind(this)}
						/>
					</div>
					<div className='spacing-line' />
				</div>
				{!hideProblemSelector && activeAction === 'chat' && (
					<ProblemSelector
						onSelect={this.handleProblemSelect.bind(this)}
					/>
				)}
				{activeAction === 'chat' ? (
					<Chat
						onMessage={this.handleMessage.bind(this)}
						reset={actionsDone}
						problemMessage={problemMessage}
					/>
				) : activeAction === 'call' ? (
					<Call />
				) : null}
			</div>
		);
	}
}

export default UserHome;
