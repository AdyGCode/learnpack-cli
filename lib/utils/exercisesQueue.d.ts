import { IExercise } from "../models/exercise-obj";
declare class ExercisesQueue {
    exercises: IExercise[];
    constructor(exercises: any);
    pop(): IExercise | undefined;
    isEmpty(): boolean;
    size(): number;
}
export default ExercisesQueue;
