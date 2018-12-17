import { Emit } from "@neezer/liz";
import { Connection } from "amqplib";
import { IConfig } from "./config";
export declare function create(conn: Connection, emit: Emit, config: IConfig): Promise<import("amqplib").Replies.Consume>;
