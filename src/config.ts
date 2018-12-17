import { Options } from "amqplib";

export interface IConfig {
  appId: string;
  publishPrefix: string;
  url: string;
  exchange: {
    name: string;
    type: string;
    options: Options.AssertExchange;
  };
  queue: {
    name: string;
    options: Options.AssertQueue;
  };
}
