/// <reference types="node" />
import * as http from "http";
import { IConfigObj } from "../../models/config";
import { IConfigManager } from "../../models/config-manager";
export declare let TEST_SERVER: http.Server;
export default function (
  configObj: IConfigObj,
  configManager: IConfigManager,
  isTestingEnvironment?: boolean
): Promise<any>;
