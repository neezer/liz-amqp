/// <reference types="node" />
import { IMakeBus } from "@neezer/liz";
import EventEmitter from "events";
import { IConfig } from "./config";
export declare function create(bus: IMakeBus, config: IConfig): EventEmitter;
