const gtts = require('node-gtts')('en');
const fs = require('fs');
const { v4: uuid } = require('uuid');

async function textToSpeech(text) {
	if (!fs.existsSync('./temp')) {
		await fs.promises.mkdir('./temp');
	}

	const filePath = `./temp/audio-${uuid()}.mpeg`;

	return new Promise((resolve, reject) => {
		gtts.save(filePath, text, async () => {
			const data = await fs.promises.readFile(filePath);
			const base64 = Buffer.from(data).toString('base64');

			resolve(base64);

			// delete the temp file
			fs.promises.unlink(filePath);
		});
	});
}

exports.textToSpeech = textToSpeech;
