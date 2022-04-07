import { IPluginConfig } from "../models/plugin-config";
declare const _default: (pluginConfig: IPluginConfig) => (args: any) => Promise<any>;
/**
 * Main Plugin Runner, it defines the behavior of a learnpack plugin
 * dividing it in "actions" like: Compile, test, etc.
 * @param {object} pluginConfig Configuration object that must defined language and each possible action.
 */
export default _default;
