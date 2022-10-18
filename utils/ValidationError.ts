class ValidationError extends Error {
    public errors: any;
    public constructor(errors: any, message: string) {
        super(message)
        this.errors = errors;
    }
}

export default ValidationError;