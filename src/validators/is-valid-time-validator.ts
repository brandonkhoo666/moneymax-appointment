import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false;
          }

          // Must be HH:mm:00
          if (!/^\d{2}:\d{2}:00$/.test(value)) {
            return false;
          }

          const [hours, minutes] = value.split(':').map(Number);

          return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HH:mm:00 format`;
        },
      },
    });
  };
}
