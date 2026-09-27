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

          if (!/^\d{4}$/.test(value)) {
            return false;
          }

          const hours = Number(value.substring(0, 2));
          const minutes = Number(value.substring(2, 4));

          return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HHmm format (0000-2359)`;
        },
      },
    });
  };
}
