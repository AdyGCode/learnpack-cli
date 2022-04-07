import { ISolution, IError } from '../models/errors';
export declare const getSolution: (slug?: string | undefined) => ISolution;
export declare const ValidationError: (error: IError | string) => IError;
export declare const NotFoundError: (error: IError | string) => IError;
export declare const CompilerError: (error: IError | string) => IError;
export declare const TestingError: (error: IError | string) => IError;
export declare const AuthError: (error: IError | string) => IError;
export declare const InternalError: (error: IError | string) => IError;
declare const _default: {
    ValidationError: (error: string | IError) => IError;
    CompilerError: (error: string | IError) => IError;
    TestingError: (error: string | IError) => IError;
    NotFoundError: (error: string | IError) => IError;
    InternalError: (error: string | IError) => IError;
    AuthError: (error: string | IError) => IError;
};
export default _default;
