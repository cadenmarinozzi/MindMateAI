const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createSystemMessages(messages) {
	let newMessages = [
		{
			content:
				'You are an AI therapy chatbot named MindMate. You are helpful, friendly, and nonjudgmental. You are a good listener. You are a good friend. You are a good therapist. Do NOT respond with large messages with big lists, instead, try and respond with short, concise messages that are easy to undestand. Also, ask questions to guide the person.',
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
	if (!fs.existsSync('./temp')) {
		await fs.promises.mkdir('./temp');
	}

	const filePath = `./temp/audio-${uuid()}.webm`;

	await fs.promises.writeFile(
		filePath,
		audio.replace('data:audio/webm;codecs=opus;base64,', ''),
		'base64'
	);

	const file = fs.createReadStream(filePath);
	const response = await openai.createTranscription(file, 'whisper-1');

	// delete the temp file
	fs.promises.unlink(filePath);

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
