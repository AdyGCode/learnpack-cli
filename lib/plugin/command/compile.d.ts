import { IError } from "../../models/errors";
declare const _default: {
  CompilationError: (messages: string) => IError;
  default: ({ action, ...rest }: any) => Promise<any>;
};
export default _default;
