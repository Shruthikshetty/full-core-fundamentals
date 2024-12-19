export const createUserValidationSchema = {
  name: {
    isLength: {
      options: { min: 2, max: 14 },
      errorMessage: "name must be between 2 and 14 characters",
    },
    notEmpty: { errorMessage: "name can not be empty" },
    isString: { errorMessage: "should be string" },
  },
  displayName: {
    notEmpty: { errorMessage: "displayname can not be empty" },
  },
};

export const getUsersValidationSchema = {
  filter: {
    optional: true,
    isString: { errorMessage: "filter must be a string" },
    isLength: {
      options: { min: 2, max: 10 },
      errorMessage: "filter must be between 2 and 10 characters",
    },
  },
  value: {
    optional: true,
    isString: { errorMessage: "value must be a string" },
    notEmpty: { errorMessage: "value cannot be empty" },
  },
};

