import { Action } from "@neezer/liz";
import { Options } from "amqplib";

export interface IPartialConfig {
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
  validate?: (action: Action) => Promise<void>;
}

export interface IConfig extends IPartialConfig {
  validate: (action: Action) => Promise<void>;
}
