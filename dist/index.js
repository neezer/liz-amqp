"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const events_1 = __importDefault(require("events"));
const publish_1 = require("./publish");
const subscribe_1 = require("./subscribe");
function create(bus, config) {
    const status = new events_1.default();
    setup(status, bus, config);
    return status;
}
exports.create = create;
async function setup(status, bus, config) {
    try {
        const connection = await amqplib_1.connect(config.url);
        status.on("shutdown", () => {
            connection.close().then(() => {
                status.emit("closed");
            });
        });
        const channel = await connection.createChannel();
        channel.assertExchange(config.exchange.name, config.exchange.type, config.exchange.options);
        await publish_1.create(connection, bus.stream, config);
        await subscribe_1.create(channel, bus.emit, config);
    }
    catch (error) {
        // TODO do something interesting
    }
}
