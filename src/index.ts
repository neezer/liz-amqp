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

  const cfg: IConfig = {
    validate: async _ => undefined,
    ...config
  };

  try {
    const connection = await connect(cfg.url);

    status.on("shutdown", () => {
      connection.close().then(() => {
        status.emit("closed");
      });
    });

    const channel = await connection.createChannel();

    channel.assertExchange(
      cfg.exchange.name,
      cfg.exchange.type,
      cfg.exchange.options
    );

    await createPublish(connection, stream, emitError, cfg);
    await createSubscribe(channel, emit, emitError, cfg);
  } catch (error) {
    // TODO do something interesting
  }
}
