"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prioritizeHTMLFile = void 0;
exports.prioritizeHTMLFile = (entryFiles) => {
  let files = [];
  // Find the html file and put it as latest in the files array
  // in order to keep the html file opened in vscode plugin
  const index = entryFiles.findIndex((file) => {
    return /.*\.html$/.test(file);
  });
  if (index !== -1) {
    for (const [i, entryFile] of entryFiles.entries()) {
      if (i !== index) {
        files.push(entryFile);
      }
    }
    files.push(entryFiles[index]);
  } else {
    files = entryFiles;
  }
  return files;
};
