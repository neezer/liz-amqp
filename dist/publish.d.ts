import { ActionStream } from "@neezer/liz";
import { Connection } from "amqplib";
import { IConfig } from "./config";
export declare function create(conn: Connection, stream: ActionStream, config: IConfig): Promise<void>;
