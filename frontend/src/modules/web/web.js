import axios from 'axios';

if (window.location.hostname === 'localhost') {
	axios.defaults.baseURL =
		'http://localhost:5000/mindmate-ai/us-central1/app';
} else {
	axios.defaults.baseURL =
		'https://us-central1-mindmate-ai.cloudfunctions.net/app';
}

function getBase64(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			resolve(reader.result);
		};
		reader.onerror = function (error) {};
	});
}

async function transcriptWhisper({ audio }) {
	try {
		const base64 = await getBase64(audio);

		const response = await axios.post('/transcript-whisper', {
			audio: base64,
		});

		if (response.status !== 200) {
			return;
		}

		return response.data;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function transcriptIBM({ audio }) {
	try {
		const response = await axios.post('/transcript-ibm', {
			audio,
		});

		if (response.status !== 200) {
			return;
		}

		return response.data;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function transcriptGoogle({ audio }) {
	try {
		const base64 = await getBase64(audio);

		const response = await axios.post('/transcript-google', {
			audio: base64,
		});

		if (response.status !== 200) {
			return;
		}

		return response.data;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function editUserNickname({ email, password, nickname }) {
	try {
		const response = await axios.post('/edit-user-nickname', {
			email,
			password,
			nickname,
		});

		if (response.status !== 200) {
			return;
		}

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function deleteAccount({ email, password }) {
	try {
		const response = await axios.post('/delete-account', {
			email,
			password,
		});

		if (response.status !== 200) {
			return;
		}

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function signUp({ email, password, nickname }) {
	try {
		const response = await axios.post('/create-user', {
			email,
			password,
			nickname,
		});

		if (response.status !== 200) {
			return;
		}

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function login({ email, password }) {
	try {
		const response = await axios.post('/login', { email, password });

		if (response.status !== 200) {
			return;
		}

		return response.data;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function createChatCompletion({ messages }) {
	try {
		const response = await axios.post('/chat-completion', { messages });

		if (response.status !== 200) {
			return;
		}

		return response.data;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function streamChatCompletion({ messages, onChunk }) {
	try {
		const response = await fetch(
			axios.defaults.baseURL + '/stream-chat-completion',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ messages }),
			}
		);

		if (!response.ok) {
			return;
		}

		const reader = response.body.getReader();
		const chunks = [];

		let done, value;

		while (!done) {
			({ value, done } = await reader.read());

			if (done) {
				return chunks;
			}

			// uint8array to string
			const content = String.fromCharCode.apply(null, value);

			chunks.push(content);
			onChunk(content);
		}
	} catch (err) {
		console.error(err);

		return false;
	}
}

export default {
	signUp,
	login,
	createChatCompletion,
	streamChatCompletion,
	deleteAccount,
	transcriptWhisper,
	editUserNickname,
	transcriptGoogle,
	transcriptIBM,
};
