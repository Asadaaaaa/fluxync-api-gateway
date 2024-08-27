class IntegratedApplicationValidator {
  createApp = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 5,
        maxLength: 60,
        pattern: '^[a-zA-Z0-9\\s]+$',
        nullable: false
      },
      email: {
        type: 'string',
        maxLength: 100,
        minLength: 5,
        pattern: '^\\S+@\\S+\\.\\S+$',
        nullable: false
      },
      logo: { // Base64
        type: 'string',
        minLength: 1,
        pattern: '^[A-Za-z0-9+/]+[=]{0,2}$',
        nullable: false
      }
    },
    required: [
      'name', 'email', 'logo'
    ],
    additionalProperties: false
  };

  editApp = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 5,
        maxLength: 60,
        pattern: '^[a-zA-Z0-9\\s]+$',
        nullable: false
      },
      email: {
        type: 'string',
        maxLength: 100,
        minLength: 5,
        pattern: '^\\S+@\\S+\\.\\S+$',
        nullable: false
      },
      balance: {
        type: 'number',
        minimum: 0,
        nullable: false
      },
      logo: { // Base64
        type: 'string',
        minLength: 1,
        pattern: '^[A-Za-z0-9+/]+[=]{0,2}$',
        nullable: false
      }
    },
    required: [
      'name', 'balance', 'email', 'logo'
    ],
    additionalProperties: false
  };
}

export default IntegratedApplicationValidator;
