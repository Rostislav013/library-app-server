import Validator from 'validator'
import isEmpty from 'is-empty'

export default function validateLoginInput(data: {
  email: string;
  password: string;
}) {
  const errors: { email?: string; password?: string } = {}

  // Convert empty fields to an empty string so we can use validator function
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  //email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }
  return {
    errors,
    isValid: isEmpty(errors),
  }
}
