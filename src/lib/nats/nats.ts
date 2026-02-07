import { connect, type NatsConnection } from '@nats-io/transport-node';
import { jetstream as connectJetstream, JetStreamClient } from '@nats-io/jetstream';

let connection: NatsConnection | null = null;
let jetstreamClient: JetStreamClient | null = null;

export const nats = async () => {
  if (connection) return connection;

  connection = await connect({
    servers: process.env.NATS_JS_SERVER,
    user: process.env.NATS_JS_USER,
    pass: process.env.NATS_JS_PASS,
  });

  return connection;
}

export const jetstream = async () => {
  if (jetstreamClient) return jetstreamClient;

  jetstreamClient = connectJetstream(await nats());

  return jetstreamClient;
}
