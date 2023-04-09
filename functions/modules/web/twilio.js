const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendSMSMessage(body, to) {
	const message = await client.messages.create({
		body: body,
		from: '+18449162688',
		to: to,
	});
	console.log(message.sid);
}

exports.sendSMSMessage = sendSMSMessage;
