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
  
  export default collectValidationErrors;