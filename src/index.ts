import { IMakeBus } from "@neezer/liz";
import { connect } from "amqplib";
import EventEmitter from "events";
import { IConfig } from "./config";
import { create as createPublish } from "./publish";
import { create as createSubscribe } from "./subscribe";

export function create(bus: IMakeBus, config: IConfig) {
  const status = new EventEmitter();

  setup(status, bus, config);

  return status;
}

async function setup(status: EventEmitter, bus: IMakeBus, config: IConfig) {
  const { stream, emit, emitError } = bus;

  try {
    const connection = await connect(config.url);

    status.on("shutdown", () => {
      connection.close().then(() => {
        status.emit("closed");
      });
    });

    const channel = await connection.createChannel();

    channel.assertExchange(
      config.exchange.name,
      config.exchange.type,
      config.exchange.options
    );

    await createPublish(connection, stream, emitError, config);
    await createSubscribe(channel, emit, emitError, config);
  } catch (error) {
    // TODO do something interesting
  }
}
