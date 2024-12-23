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
  password: {
    notEmpty: { errorMessage: "password should not be empty" },
  },
};
