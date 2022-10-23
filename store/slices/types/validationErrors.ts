interface ValidationErrorData {
    value: string;
    msg: string;
    param: string;
    location: string;
}

export type ResponsePayloadValidationErrors<T> = Partial<Record<keyof T, ValidationErrorData>>

export type ValidationErrors<T> = Partial<Record<keyof T, string>>