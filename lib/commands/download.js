"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
// import fetch from 'node-fetch'
const file_1 = require("../managers/file");
const console_1 = require("../utils/console");
const api_1 = require("../utils/api");
const download_1 = require("../ui/download");
// const BaseCommand = require('../utils/BaseCommand');
class DownloadCommand extends command_1.Command {
  // async init() {
  //   const {flags} = this.parse(DownloadCommand)
  //   await this.initSession(flags)
  // }
  async run() {
    const { /* flags, */ args } = this.parse(DownloadCommand);
    // start watching for file changes
    let _package = args.package;
    if (!_package) {
      _package = await download_1.askPackage();
    }
    if (!_package) {
      return null;
    }
    try {
      const packageInfo = await api_1.default.getAllPackages({
        slug: _package,
      });
      if (packageInfo.results.length === 0)
        console_1.default.error(`Package ${_package} not found`);
      else
        file_1
          .clone(packageInfo.results[0].repository)
          .then((_result) => {
            console_1.default.success("Successfully downloaded");
            console_1.default.info(
              `You can now CD into the folder like this: $ cd ${_package}`
            );
          })
          .catch((error) => console_1.default.error(error.message || error));
    } catch (_a) {}
  }
}
DownloadCommand.description = `Describe the command here
...
Extra documentation goes here
`;
DownloadCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
DownloadCommand.args = [
  {
    name: "package",
    required: false,
    description: "The unique string that identifies this package on learnpack",
    hidden: false,
  },
];
exports.default = DownloadCommand;
