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

export default { calculatePasswordStrength, blobToBase64 };
