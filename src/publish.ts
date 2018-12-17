import { runEffects, tap } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";
import { Action, ActionStream, combinators } from "@neezer/liz";
import { Connection } from "amqplib";
import makeDebug from "debug";
import { IConfig } from "./config";

const debug = makeDebug("liz-amqp");

export async function create(
  conn: Connection,
  stream: ActionStream,
  config: IConfig
) {
  const publishes = combinators.shiftType(
    combinators.matching(config.publishPrefix, stream)
  );

  const publish = (action: Action) => {
    const routingKey = action.type;
    const message = Buffer.from(JSON.stringify(action));
    const options = { appId: config.appId, contentType: "application/json" };

    conn.createChannel().then(ch => {
      debug("publishing type=%s", action.type);

      ch.publish(config.exchange.name, routingKey, message, options);
    });
  };

  const effects = tap<Action>(publish, publishes);

  runEffects(effects, newDefaultScheduler());
}
