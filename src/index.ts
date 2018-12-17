import { IMakeBus } from "@neezer/liz";
import { connect } from "amqplib";
import EventEmitter from "events";
import { IConfig } from "./config";
import { create as createPublish } from "./publish";
import { create as createSubscribe } from "./subscribe";

export function create(bus: IMakeBus, config: IConfig) {
  const status = new EventEmitter();

  connect(config.url)
    .then(connection => {
      status.on("shutdown", () => {
        connection.close().then(() => {
          status.emit("close");
        });
      });

      return Promise.all([
        createPublish(connection, bus.stream, config),
        createSubscribe(connection, bus.emit, config)
      ]);
    })
    .catch(error => {
      // TODO connection retry kickoff
    });

  return status;
}
