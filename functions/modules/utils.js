function emailToFirebaseID(email) {
	return email.replace(/\./g, ',');
}

exports.emailToFirebaseID = emailToFirebaseID;
