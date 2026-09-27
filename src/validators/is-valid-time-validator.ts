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
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            return false;
          }

          if (value < 0 || value > 2359) {
            return false;
          }

          const hours = Math.floor(value / 100);
          const minutes = value % 100;

          return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HHmm format (0000-2359)`;
        },
      },
    });
  };
}
