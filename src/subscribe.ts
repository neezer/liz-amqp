import { Action, Emit, makeAction } from "@neezer/liz";
import { Connection, ConsumeMessage } from "amqplib";
import makeDebug from "debug";
import { IConfig } from "./config";
import { assertExchange } from "./exchange";

const debug = makeDebug("liz-amqp");

export async function create(conn: Connection, emit: Emit, config: IConfig) {
  debug("asserting subscribe channel");

  const channel = await conn.createChannel();

  debug("assering subscribe topology");

  await assertExchange(channel, config);

  const queue = await channel.assertQueue(
    config.queue.name,
    config.queue.options
  );

  if (config.subscriptionKeys.length === 0) {
    process.stderr.write("WARNING: no subscription keys provided!");
  } else {
    await Promise.all(
      config.subscriptionKeys.map(key => {
        debug(`binding key "${key}"`);

        return channel.bindQueue(queue.queue, config.exchange.name, key);
      })
    );
  }

  return channel.consume(queue.queue, onMessage(emit, config), { noAck: true });
}

function onMessage(emit: Emit, config: IConfig) {
  const actionMaker = makeAction(config.appId);

  return (message: ConsumeMessage | null) => {
    if (message === null) {
      return;
    }

    /**
     * Do not process messages from ourself.
     */
    if (message.properties.appId === config.appId) {
      return;
    }

    const rawBody = message.content.toString();

    try {
      const body = JSON.parse(rawBody);

      // FIXME allow passing in upstream meta
      const action = actionMaker(body.type, body.payload);

      if (Action.assert(action)) {
        emit(action);
      }
    } catch (error) {
      // TODO do something useful with the JSON.parse error
    }
  };
}
