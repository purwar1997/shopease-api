import Joi from 'joi';

const customJoi = Joi.extend(joi => ({
  type: 'object',
  base: joi.object(),
  messages: {
    'object.base': 'Request payload must be an object containing all the required fields',
  },
}));

export default customJoi;
