import * as express from "express";
import { IConfigObj } from "../../models/config";
import { IConfigManager } from "../../models/config-manager";
export default function (app: express.Application, configObject: IConfigObj, configManager: IConfigManager): Promise<void>;
