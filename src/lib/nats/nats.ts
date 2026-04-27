import { connect, type NatsConnection } from '@nats-io/transport-node';
import { jetstream, type JetStreamClient } from '@nats-io/jetstream';

let natsConnection: NatsConnection | null = null;
let jsClient: JetStreamClient | null = null;

const nats = async () => {
	if (natsConnection) return natsConnection;

	if (
		process.env.NATS_JS_SERVER &&
		process.env.NATS_JS_USER &&
		process.env.NATS_JS_PASS
	) {
		natsConnection = await connect({
			servers: process.env.NATS_JS_SERVER,
			user: process.env.NATS_JS_USER,
			pass: process.env.NATS_JS_PASS,
		});
	}

	return natsConnection;
};

export const jetstreamClient = async () => {
	if (jsClient) return jsClient;

	const natsConnection = await nats();

	if (natsConnection) {
		jsClient = jetstream(natsConnection);
	}

	return jsClient;
};
