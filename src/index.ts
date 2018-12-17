import { IMakeBus } from "@neezer/liz";
import { connect } from "amqplib";
import EventEmitter from "events";
import { IConfig } from "./config";
import { create as createPublish } from "./publish";
import { create as createSubscribe } from "./subscribe";

export async function create(bus: IMakeBus, config: IConfig) {
  const status = new EventEmitter();

  try {
    const connection = await connect(config.url);

    await createPublish(connection, bus.stream, config);
    await createSubscribe(connection, bus.emit, config);

    status.on("shutdown", () => {
      connection.close().then(() => {
        status.emit("close");
      });
    });
  } catch (error) {
    // TODO connection retry kickoff
  }

  return status;
}
