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
    amqplib_1.connect(config.url)
        .then(connection => {
        status.on("shutdown", () => {
            connection.close().then(() => {
                status.emit("closed");
            });
        });
        return Promise.all([
            publish_1.create(connection, bus.stream, config),
            subscribe_1.create(connection, bus.emit, config)
        ]);
    })
        .catch(error => {
        // TODO connection retry kickoff
    });
    return status;
}
exports.create = create;
