import { Action } from "@neezer/liz";
import { Options } from "amqplib";

export interface IConfig {
  appId: string;
  publishPrefix: string;
  url: string;
  subscriptionKeys: string[];
  exchange: {
    name: string;
    type: string;
    options: Options.AssertExchange;
  };
  queue: {
    name: string;
    options: Options.AssertQueue;
  };
  validate: (action: Action) => Promise<void>;
}
