import Joi from 'joi';

export type TValidationResult<ReturnValue = any> =
  | {
      error: Joi.ValidationError;
      message: string;
      value: null;
    }
  | {
      error: null;
      message: string;
      value: ReturnValue;
    };
