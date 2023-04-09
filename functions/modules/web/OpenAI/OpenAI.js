const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { default: axios } = require('axios');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createSystemMessages(messages) {
	let newMessages = [
		{
			content:
				'You are an AI therapy chatbot named MindMate. You are helpful, friendly, and nonjudgmental. You are a good listener. You are a good friend. You are a good therapist. Do NOT respond with large messages with big lists, instead, try and respond with short, concise messages that are easy to undestand.',
			role: 'system',
		},
	];

	newMessages = [...newMessages, ...messages];

	return newMessages;
}

async function createChatCompletion(messages, model = 'gpt-4') {
	const newMessages = createSystemMessages(messages);

	const completion = await openai.createChatCompletion({
		model,
		messages: newMessages,
	});

	return completion.data.choices[0].message.content;
}

async function transcriptWhisper(audio) {
	// const response = await axios({
	// 	method: 'POST',
	// 	url: 'https://api.openai.com/v1/audio/transcriptions',
	// 	headers: {
	// 		'Content-Type': 'multipart/form-data',
	// 		Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	// 	},
	// 	data: {
	// 		file: audio,
	// 		model: 'whisper-1',
	// 	},
	// });

	fs.writeFileSync('audio.ogg', audio);

	ffmpeg.setFfmpegPath(ffmpegPath);
	var outStream = fs.createWriteStream('./audio.mp3');

	ffmpeg()
		.input('./audio.ogg')
		.audioQuality(96)
		.toFormat('mp3')
		.on('error', (error) => console.log(`Encoding Error: ${error.message}`))
		.on('exit', () => console.log('Audio recorder exited'))
		.on('close', () => console.log('Audio recorder closed'))
		.on('end', () => console.log('Audio Transcoding succeeded !'))
		.pipe(outStream, { end: true });

	const file = fs.createReadStream('audio.mp3');

	const audioReadStream = Readable.from(audioBuffer);
	audioReadStream.path = 'audio.mp3';

	const response = await openai.createTranscription(
		audioReadStream,
		'whisper-1'
	);

	// const response = await axios.post(
	// 	'https://api.openai.com/v1/audio/transcriptions',
	// 	{
	// 		file,
	// 		model: 'whisper-1',
	// 	},
	// 	{
	// 		headers: {
	// 			'Content-Type': 'multipart/form-data',
	// 			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	// 		},
	// 	}
	// );

	return response.data.text;
}

async function streamChatCompletion(messages, model = 'gpt-4') {
	const newMessages = createSystemMessages(messages);

	const response = await openai.createChatCompletion(
		{
			model,
			messages: newMessages,
			stream: true,
		},
		{ responseType: 'stream' }
	);

	return response;
}

exports.createChatCompletion = createChatCompletion;
exports.streamChatCompletion = streamChatCompletion;
exports.transcriptWhisper = transcriptWhisper;
