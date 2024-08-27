class AuthValidator {
  login = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 1,
        maxLength: 15,
        pattern: '^[a-zA-Z0-9]+$',
        nullable: false
      },
      password: {
        type: 'string',
        minLength: 1,
        pattern: '^\\S+$',
        nullable: false
      }
    },
    required: [
      'username', 'password'
    ],
    additionalProperties: false
  }
}

export default AuthValidator;
