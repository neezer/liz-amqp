"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@most/core");
const scheduler_1 = require("@most/scheduler");
const liz_1 = require("@neezer/liz");
const debug_1 = __importDefault(require("debug"));
const exchange_1 = require("./exchange");
const debug = debug_1.default("liz-amqp");
async function create(conn, stream, config) {
    debug("asserting publish channel");
    await conn.createChannel().then(ch => {
        debug("assering publish topology");
        return exchange_1.assertExchange(ch, config);
    });
    const publishes = liz_1.combinators.shiftType(liz_1.combinators.matching(config.publishPrefix, stream));
    const publish = (action) => {
        const routingKey = action.type;
        const message = Buffer.from(JSON.stringify(action));
        const options = { appId: config.appId, contentType: "application/json" };
        conn.createChannel().then(ch => {
            debug("publishing type=%s", action.type);
            ch.publish(config.exchange.name, routingKey, message, options);
        });
    };
    const effects = core_1.tap(publish, publishes);
    core_1.runEffects(effects, scheduler_1.newDefaultScheduler());
}
exports.create = create;
