const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const firebase = require('./modules/web/firebase');
const openai = require('./modules/web/OpenAI/OpenAI');
const twilio = require('./modules/web/twilio');
const { MessagingResponse } = require('twilio').twiml;
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();

	twiml.message('The Robots are coming! Head for the hills!');

	res.type('text/xml').send(twiml.toString());
});

app.post('/transcript-whisper', async (req, res) => {
	try {
		const { audio } = req.body;

		if (!audio) {
			return res.status(400).json({
				error: 'Audio is required',
			});
		}

		const response = await openai.transcriptWhisper(audio);

		if (!response) {
			return res.status(400).json({
				error: 'Failed to transcribe audio',
			});
		}

		return res.status(200).json({
			transcript: response.data.transcript,
		});
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/delete-account', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: 'Email and password are required',
			});
		}

		const success = await firebase.deleteAccount({ email, password });

		if (!success) {
			return res.status(400).json({
				error: 'Failed to delete account',
			});
		}

		return res.status(200).end();
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/edit-user-nickname', async (req, res) => {
	try {
		const { email, password, nickname } = req.body;

		if (!email || !password || !nickname) {
			return res.status(400).json({
				error: 'Email, password, and nickname are required',
			});
		}

		const success = await firebase.editUserNickname({
			email,
			password,
			nickname,
		});

		if (!success) {
			return res.status(400).json({
				error: 'Failed to edit nickname',
			});
		}

		return res.status(200).end();
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/stream-chat-completion', async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages) {
			return res.status(400).json({
				error: 'Messages are required',
			});
		}

		const response = await openai.streamChatCompletion(messages);

		if (!response) {
			return res.status(400).json({
				error: 'Failed to create completion',
			});
		}

		response.data.on('data', (data) => {
			const lines = data
				.toString()
				.split('\n')
				.filter((line) => line.trim() !== '');

			for (const line of lines) {
				const message = line.replace(/^data: /, '');

				if (message === '[DONE]') {
					res.status(200).end();

					return; // Stream finished
				}

				const parsed = JSON.parse(message);
				const content = parsed.choices[0].delta?.content;

				if (!content) {
					continue;
				}

				res.write(content);
			}
		});
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/chat-completion', async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages) {
			return res.status(400).json({
				error: 'Messages are required',
			});
		}

		const completion = await openai.createChatCompletion(messages);

		if (!completion) {
			return res.status(400).json({
				error: 'Failed to create completion',
			});
		}

		return res.status(200).send(completion);
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/create-user', async (req, res) => {
	try {
		const { email, password, nickname } = req.body;

		if (!email || !password || !nickname) {
			return res.status(400).json({
				error: 'Email, password, and nickname are required',
			});
		}

		const user = await firebase.createUser({ email, password, nickname });

		if (!user) {
			return res.status(400).json({
				error: 'Failed to create user',
			});
		}

		return res.status(200).send();
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: 'Email and password are required',
			});
		}

		const user = await firebase.login({ email, password });

		if (!user) {
			return res.status(400).json({
				error: 'Failed to login',
			});
		}

		return res.status(200).send(user);
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			error: err.message,
		});
	}
});

exports.app = functions.https.onRequest(app);
