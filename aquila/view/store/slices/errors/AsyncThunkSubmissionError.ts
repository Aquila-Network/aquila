export class AsyncThunkSubmissionError<T = null> extends Error {
    public validationErrors: T | null;

    constructor(message: string, validationErrors: T | null) {
        super(message)
        this.validationErrors = validationErrors;
    }
}