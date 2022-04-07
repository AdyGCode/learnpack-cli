import { IAuditErrors } from "../models/audit-errors";
import { IConfigObj } from "../models/config";
import { ICounter } from "../models/counter";
import { IFindings } from "../models/findings";
declare const _default: {
  isUrl: (
    url: string,
    errors: IAuditErrors[],
    counter: ICounter
  ) => Promise<boolean>;
  checkForEmptySpaces: (str: string) => boolean;
  checkLearnpackClean: (configObj: IConfigObj, errors: IAuditErrors[]) => void;
  findInFile: (types: string[], content: string) => IFindings;
  showErrors: (errors: IAuditErrors[], counter: ICounter) => Promise<unknown>;
  showWarnings: (warnings: IAuditErrors[]) => Promise<unknown>;
};
export default _default;
