exports.validateInput = (data, schema) => {
  return schema.validate(data, { abortEarly: false });
};