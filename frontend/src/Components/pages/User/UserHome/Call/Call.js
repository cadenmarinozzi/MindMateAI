import { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMicrophone,
	faPause,
	faPhone,
	faPlay,
} from '@fortawesome/free-solid-svg-icons';
import web from 'modules/web/web';
import utils from 'modules/utils';
import getBlobDuration from 'get-blob-duration';
import './Call.scss';

class Call extends Component {
	constructor() {
		super();

		this.state = {
			calls: [],
		};

		this.callsRef = createRef();
	}

	updateCallsHeight() {
		const calls = this.callsRef.current;
		calls.style.height = window.innerHeight - calls.offsetTop - 200 + 'px';
	}

	async responseToAudio() {
		const { calls } = this.state;

		this.setState({
			loadingResponse: true,
		});

		const messages = calls.map((call, index) => {
			return {
				content: call.transcript,
				role: index % 2 === 0 ? 'user' : 'bot',
			};
		});

		const response = await web.createChatCompletion({
			messages,
		});
		const tts = await web.googleTextToSpeech({
			text: response,
		});

		const audioURL = `data:audio/mpeg;base64,${tts}`;

		const audio = new Audio();

		audio.addEventListener('loadedmetadata', async () => {
			const duration = audio.duration;
			this.setState(
				{
					loadingResponse: false,
					calls: [
						...calls,
						{
							duration,
							transcript: response,
							url: audioURL,
							durationRef: createRef(),
							durationBarRef: createRef(),
							playState: {
								playing: false,
								position: 0,
							},
						},
					],
				},
				() => {
					audio.play();
				}
			);
		});

		audio.src = audioURL;
	}

	async startRecording() {
		const audioStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});

		this.audioRecorder = new MediaRecorder(audioStream);

		let audioChunks = [];

		this.audioRecorder.onstop = async (e) => {
			const blob = new Blob(audioChunks, {
				type: this.audioRecorder.mimeType,
			});

			const audioURL = await utils.blobToBase64(blob);
			const transcript = await web.transcriptWhisper({ audio: audioURL });
			const duration = await getBlobDuration(blob);

			this.setState(
				{
					calls: [
						...this.state.calls,
						{
							duration,
							transcript,
							url: audioURL,
							durationRef: createRef(),
							durationBarRef: createRef(),
							playState: {
								playing: false,
								position: 0,
							},
						},
					],
				},
				this.responseToAudio
			);
		};

		this.audioRecorder.ondataavailable = (e) => {
			audioChunks.push(e.data);
		};

		this.audioRecorder.start();

		this.setState({
			recording: true,
		});
	}

	async stopRecording() {
		this.setState({
			recording: false,
		});

		this.audioRecorder.stop();
	}

	componentDidMount() {
		this.updateCallsHeight();
	}

	render() {
		const { recording, calls, loadingResponse } = this.state;

		const callsList = calls?.map((call, index) => {
			const duration = call.playState.playing
				? call.playState.position
				: call.duration;
			const minutes = Math.floor(duration / 60)
				.toString()
				.padStart(2, '0');
			const seconds = Math.floor(duration % 60)
				.toString()
				.padStart(2, '0');

			const isBot = index % 2 !== 0;

			return (
				<div className='call' key={index}>
					<div className='content'>
						{isBot ? '🧠' : <FontAwesomeIcon icon={faPhone} />}
						<div className='details'>
							<div className='bar'>
								<div
									className='fill'
									ref={call.durationBarRef}
								/>
							</div>
							<div className='controls'>
								<div
									className='duration'
									ref={call.durationRef}>
									{minutes}:{seconds}
								</div>
								<FontAwesomeIcon
									size='2xs'
									icon={
										call.playState.playing
											? faPause
											: faPlay
									}
									className='playback-icon'
									onClick={() => {
										if (!call.playState.playing) {
											const audio = new Audio(call.url);

											audio.play();

											const playLoop = setInterval(() => {
												const position = Math.floor(
													audio.currentTime
												);

												const minutes = Math.floor(
													position / 60
												)
													.toString()
													.padStart(2, '0');
												const seconds = Math.floor(
													position % 60
												)
													.toString()
													.padStart(2, '0');

												call.durationRef.current.innerText = `${minutes}:${seconds}`;
												call.durationBarRef.current.style.width = `${
													(audio.currentTime /
														call.duration) *
													100
												}%`;
												call.playState.position =
													audio.currentTime;

												if (
													audio.currentTime ===
													call.duration
												) {
													clearInterval(playLoop);

													this.setState({
														calls: calls.map(
															(call, i) => {
																if (
																	i === index
																) {
																	return {
																		...call,
																		playState:
																			{
																				...call.playState,
																				playing: false,
																				position: 0,
																			},
																	};
																}

																return call;
															}
														),
													});
												}
											});

											this.setState({
												calls: calls.map((call, i) => {
													if (i === index) {
														return {
															...call,
															playState: {
																...call.playState,
																playAudio:
																	audio,
																playing: true,
																playLoop,
															},
														};
													}

													return call;
												}),
											});
										} else {
											call.playState.playAudio.pause();

											clearInterval(
												call.playState.playLoop
											);

											this.setState({
												calls: calls.map((call, i) => {
													if (i === index) {
														return {
															...call,
															playState: {
																...call.playState,
																playing: false,
																position: 0,
															},
														};
													}

													return call;
												}),
											});
										}
									}}
								/>
							</div>
						</div>
					</div>
					<span className='transcript'>{call.transcript}</span>
				</div>
			);
		});

		return (
			<div className='call'>
				<div className='calls' ref={this.callsRef}>
					{callsList}
					{
						<div
							className={`typing-indicator message-right ${
								loadingResponse && 'typing-indicator-visible'
							}`}>
							<div className='dot' />
							<div className='dot' />
							<div className='dot' />
						</div>
					}
				</div>
				<div className='actions'>
					<FontAwesomeIcon
						icon={faMicrophone}
						className={`record-button ${
							loadingResponse && 'record-button-disabled'
						} ${recording && 'fa-fade'}`}
						onClick={() => {
							if (recording) {
								this.stopRecording();
							} else {
								this.startRecording();
							}
						}}
					/>
				</div>
			</div>
		);
	}
}

export default Call;
