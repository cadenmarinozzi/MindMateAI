function calculatePasswordStrength(password) {
	if (password.length < 6) {
		return 'weak';
	}

	if (password.length < 8) {
		return 'good';
	}

	return 'strong';
}

function blobToBase64(blob) {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}

async function getAudioDuration(audioURL) {
	return new Promise((resolve) => {
		const audio = document.createElement('audio');
		audio.muted = true;

		const source = document.createElement('source');

		source.src = audioURL;
		audio.preload = 'metadata';

		audio.appendChild(source);

		audio.addEventListener('loadedmetadata', () => {
			resolve(audio.duration);
		});
	});
}

export default { calculatePasswordStrength, blobToBase64, getAudioDuration };
