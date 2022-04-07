import { IConfigObj } from "../../models/config";
import { IFile } from "../../models/file";
import { IExercise } from "../../models/exercise-obj";
export declare const exercise: (path: string, position: number, configObject: IConfigObj) => IExercise;
export declare const validateExerciseDirectoryName: (str: string) => boolean;
export declare const isCodable: (str: string) => boolean;
export declare const shouldBeVisible: (file: IFile) => boolean;
export declare const isDirectory: (source: string) => boolean;
export declare const detect: (configObject: IConfigObj | undefined, files: Array<string>) => {
    language: string;
    entry: string | undefined;
} | {
    language: null;
    entry: null;
} | undefined;
export declare const filterFiles: (files: Array<string>, basePath?: string) => {
    path: string;
    name: string;
    hidden: boolean;
}[];
declare const _default: {
    exercise: (path: string, position: number, configObject: IConfigObj) => IExercise;
    detect: (configObject: IConfigObj | undefined, files: string[]) => {
        language: string;
        entry: string | undefined;
    } | {
        language: null;
        entry: null;
    } | undefined;
    filterFiles: (files: string[], basePath?: string) => {
        path: string;
        name: string;
        hidden: boolean;
    }[];
};
export default _default;
