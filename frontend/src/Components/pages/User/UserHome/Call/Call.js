import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMicrophone,
	faPhone,
	faPlay,
} from '@fortawesome/free-solid-svg-icons';
import web from 'modules/web/web';
import utils from 'modules/utils';
import './Call.scss';

class Call extends Component {
	constructor() {
		super();

		this.state = {
			calls: [
				{
					id: 1,
					time: 21,
				},
			],
		};
	}

	async startRecording() {
		const audioStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		this.audioRecorder = new MediaRecorder(audioStream);
		let audioChunks = [];
		this.audioRecorder.onstop = async (e) => {
			const blob = new Blob(audioChunks, {
				type: 'audio/webm;codecs=opus',
			});

			const audioData = await utils.blobToBase64(blob);

			const res = await web.transcriptIBM({ audio: audioData });
			console.log(res);
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
		this.audioRecorder.stop();
	}

	render() {
		const { recording, calls } = this.state;

		const callsList = calls?.map((call, index) => {
			const minutes = Math.floor(call.time / 60)
				.toString()
				.padStart(2, '0');
			const seconds = Math.floor(call.time % 60)
				.toString()
				.padStart(2, '0');

			return (
				<div className='call' key={index}>
					<FontAwesomeIcon icon={faPhone} />
					<div className='details'>
						<div className='bar'>
							<div className='fill' />
						</div>
						<div className='controls'>
							<div className='time'>
								{minutes}:{seconds}
							</div>
							<FontAwesomeIcon
								size='2xs'
								icon={faPlay}
								className='playback-icon'
							/>
						</div>
					</div>
				</div>
			);
		});

		return (
			// <div className='call'>
			// 	<div className='calls'>{callsList}</div>
			// 	<div className='actions'>
			// 		<FontAwesomeIcon
			// 			icon={faMicrophone}
			// 			className={`record-button ${recording && 'fa-fade'}`}
			// 			onMouseDown={this.startRecording.bind(this)}
			// 			onMouseUp={this.stopRecording.bind(this)}
			// 		/>
			// 	</div>
			// </div>
			<div className='call-in-progess'>In progress. Come back later!</div>
		);
	}
}

export default Call;
