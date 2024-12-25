import Joi from "joi";
import { pickOption } from "../utils/pick.js";
const validate = (schema) => (req, res, next) => {
  const validSchema = pickOption(schema, ["params", "query", "body"]);
  const object = pickOption(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return res.status(400).json(errorMessage);
  }
  Object.assign(req, value);
  return next();
};

export default validate;
