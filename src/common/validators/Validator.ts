import Joi from 'joi';
import { TValidationResult } from '../models/ValidationResult';

export const VALIDATOR = {
  unixTimestamp: () => {
    const v = Joi.number()
      .integer()
      .positive()
      .custom((value, helpers) => {
        const isValid = Number.isInteger(value) && ('' + value).length === 10;
        if (!isValid) {
          return helpers.error('any.invalid');
        }
        return value;
      });
    return v;
  },
  schemaValidate: <ReturnValue = any>(
    Schema: Joi.Schema<ReturnValue>,
    input: any
  ): TValidationResult<ReturnValue> => {
    const { value, error } = Schema.validate(input);
    if (error) {
      return { error, message: error.details[0].message, value: null };
    }
    return { value: value as ReturnValue, error: null, message: 'Valid' };
  },
};
