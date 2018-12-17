import { Channel } from "amqplib";
import { IConfig } from "./config";
export declare function assertExchange(channel: Channel, config: IConfig): Promise<import("amqplib").Replies.AssertExchange>;
