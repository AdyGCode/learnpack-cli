declare const _default: {
    events: {
        START_EXERCISE: string;
        INIT: string;
        RUNNING: string;
        END: string;
        RESET_EXERCISE: string;
        OPEN_FILES: string;
        OPEN_WINDOW: string;
        INSTRUCTIONS_CLOSED: string;
    };
    dispatcher: (opts?: any) => {
        enqueue: (name: string, data?: any) => void;
        events: {
            START_EXERCISE: string;
            INIT: string;
            RUNNING: string;
            END: string;
            RESET_EXERCISE: string;
            OPEN_FILES: string;
            OPEN_WINDOW: string;
            INSTRUCTIONS_CLOSED: string;
        };
    };
    listener: (opts?: any) => {
        onPull: (callback: (T?: any) => any) => boolean;
        onReset: (callback: (T?: any) => any) => boolean;
        events: {
            START_EXERCISE: string;
            INIT: string;
            RUNNING: string;
            END: string;
            RESET_EXERCISE: string;
            OPEN_FILES: string;
            OPEN_WINDOW: string;
            INSTRUCTIONS_CLOSED: string;
        };
    };
};
export default _default;
