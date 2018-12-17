import { Emit } from "@neezer/liz";
import { Channel } from "amqplib";
import { IConfig } from "./config";
export declare function create(channel: Channel, emit: Emit, config: IConfig): Promise<import("amqplib").Replies.Consume>;
