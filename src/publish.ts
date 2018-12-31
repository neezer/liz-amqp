import { runEffects, tap } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";
import { makeValidator } from "@neezer/action-validate";
import { Action, ActionStream, combinators, Emit } from "@neezer/liz";
import { Connection } from "amqplib";
import makeDebug from "debug";
import { IConfig } from "./config";

const debug = makeDebug("liz-amqp");

export async function create(
  conn: Connection,
  stream: ActionStream,
  emitError: Emit<Error>,
  config: IConfig
) {
  const validate = makeValidator(config.schemas.url);
  const publishes = combinators.shiftType(
    combinators.matching(config.publishPrefix, stream)
  );

  const publish = async (action: Action) => {
    try {
      await validate(action);
    } catch (error) {
      emitError(error);
    }

    const routingKey = action.type;
    const message = Buffer.from(JSON.stringify(action));

    const options = {
      appId: config.appId,
      contentType: "application/json",
      correlationId: action.meta.correlationId
    };

    const channel = await conn.createChannel();

    debug("publishing type=%s", action.type);

    channel.publish(config.exchange.name, routingKey, message, options);
  };

  const effects = tap<Action>(publish, publishes);

  runEffects(effects, newDefaultScheduler());
}
