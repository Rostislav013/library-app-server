import Validator from 'validator'
import isEmpty from 'is-empty'

type Errors = {
  firstName?: string;
  email?: string;
  password?: string;
}
export default function validateRegisterInput(data: {
  firstName: string;
  email: string;
  password: string;
}) {
  const errors: Errors = {}
  // Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  // Name checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Name field is required'
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
