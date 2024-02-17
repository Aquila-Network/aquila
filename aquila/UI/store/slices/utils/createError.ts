import { AxiosError } from "axios";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";


const isArrayFieldError = (item: any) => {
    const match = item.param.match(/\[(\d+)\]/);
    if (match && match.length === 2) {
      return true;
    }
    return false;
  };
  
  const isObjectType = (item: any) => {
    const split = item.param.split('.');
    if (split.length === 2) {
      return true;
    }
    return false;
  };
  
  const parseArrayFieldError = (item: any) => {
    const pattern = /\[(\d+)\]/;
    const match = item.param.match(pattern);
    const index = parseInt(match[1], 10);
    const param = item.param.replace(pattern, '');
    const [key, prop] = param.split('.');
    return { index, key, prop };
  };
  
  const collectValidationErrors = (errors: any) => {
    const formErrors: any = {};
    errors.forEach((item: any) => {
      if (isArrayFieldError(item)) {
        const { key, index, prop } = parseArrayFieldError(item);
        if (!formErrors[key]) {
          formErrors[key] = [];
          formErrors[key][index] = {};
          formErrors[key][index][prop] = item.msg;
        } else {
          if (!formErrors[key][index]) {
            formErrors[key][index] = {};
          }
          formErrors[key][index][prop] = item.msg;
        }
      } else if (isObjectType(item)) {
        const [key, prop] = item.param.split('.');
        if (!formErrors[key]) {
          formErrors[key] = {};
          formErrors[key][prop] = item.msg;
        } else {
          if (!formErrors[key][prop]) {
            formErrors[key][prop] = item.msg;
          }
        }
      } else if (!formErrors[item]) {
        formErrors[item.param] = item.msg;
      }
    });
    return formErrors;
  };
  
interface SubmissionErrorResponse<T> {
    message: string;
    errors: Array<T>;
}

export const createSubmissionErrorFromErrObj = <T extends {}> (error: AxiosError<SubmissionErrorResponse<T>> | Error) => {
    let message = "Something went wrong";
    let validationErrors: T | null = null;
    if(error instanceof AxiosError) {
        message = error.response?.data.message || message;
        if(error.response?.status === 400 && error.response.data.errors) {
            validationErrors = collectValidationErrors(error.response.data.errors);
        }
    }
    const errObj = new AsyncThunkSubmissionError<T>(message, validationErrors);
    return errObj;
}