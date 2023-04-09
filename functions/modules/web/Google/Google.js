const speech = require('@google-cloud/speech');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
// Creates a client
const client = new speech.SpeechClient({
	apiKey: GOOGLE_API_KEY,
});

async function transcriptGoogle(audio) {
	// The path to the remote LINEAR16 file
	const gcsUri = audio;

	// The audio file's encoding, sample rate in hertz, and BCP-47 language code
	audio = {
		uri: gcsUri,
	};
	const config = {
		encoding: 'LINEAR16',
		sampleRateHertz: 16000,
		languageCode: 'en-US',
	};
	const request = {
		audio: audio,
		config: config,
	};

	// Detects speech in the audio file
	const [response] = await client.recognize(request);
	const transcription = response.results
		.map((result) => result.alternatives[0].transcript)
		.join('\n');
	console.log(`Transcription: ${transcription}`);

	return transcription;
}

exports.transcriptGoogle = transcriptGoogle;
