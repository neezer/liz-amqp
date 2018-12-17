"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const events_1 = __importDefault(require("events"));
const publish_1 = require("./publish");
const subscribe_1 = require("./subscribe");
async function create(bus, config) {
    const status = new events_1.default();
    try {
        const connection = await amqplib_1.connect(config.url);
        await publish_1.create(connection, bus.stream, config);
        await subscribe_1.create(connection, bus.emit, config);
        status.on("shutdown", () => {
            connection.close().then(() => {
                status.emit("close");
            });
        });
    }
    catch (error) {
        // TODO connection retry kickoff
    }
    return status;
}
exports.create = create;
