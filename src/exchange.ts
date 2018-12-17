import { Channel } from "amqplib";
import makeDebug from "debug";
import { IConfig } from "./config";

const debug = makeDebug("liz-amqp");

export async function assertExchange(channel: Channel, config: IConfig) {
  debug("asserting exchange");

  return channel.assertExchange(
    config.exchange.name,
    config.exchange.type,
    config.exchange.options
  );
}
