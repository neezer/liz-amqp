"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const liz_1 = require("@neezer/liz");
const debug_1 = __importDefault(require("debug"));
const exchange_1 = require("./exchange");
const debug = debug_1.default("liz-amqp");
async function create(conn, emit, config) {
    debug("asserting subscribe channel");
    const channel = await conn.createChannel();
    debug("assering subscribe topology");
    await exchange_1.assertExchange(channel, config);
    const queue = await channel.assertQueue(config.queue.name, config.queue.options);
    if (config.subscriptionKeys.length === 0) {
        process.stderr.write("WARNING: no subscription keys provided!");
    }
    else {
        await Promise.all(config.subscriptionKeys.map(key => channel.bindQueue(queue.queue, config.exchange.name, key)));
    }
    return channel.consume(queue.queue, onMessage(emit, config), { noAck: true });
}
exports.create = create;
function onMessage(emit, config) {
    const actionMaker = liz_1.makeAction(config.appId);
    return (message) => {
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
            if (liz_1.Action.assert(action)) {
                emit(action);
            }
        }
        catch (error) {
            // TODO do something useful with the JSON.parse error
        }
    };
}
