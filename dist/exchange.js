"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("liz-amqp");
async function assertExchange(channel, config) {
    debug("asserting exchange");
    return channel.assertExchange(config.exchange.name, config.exchange.type, config.exchange.options);
}
exports.assertExchange = assertExchange;
