class NSFWDetectorValidator {
  demoDetector = {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        minLength: 1,
        pattern: '^[A-Za-z0-9+/]+[=]{0,2}$',
        nullable: false
      },
    },
    required: ['image'],
    additionalProperties: false
  };
}

export default NSFWDetectorValidator;