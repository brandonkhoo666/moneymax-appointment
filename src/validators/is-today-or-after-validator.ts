import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsTodayOrAfter(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTodayOrAfter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false;
          }

          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
          }

          const inputDate = new Date(`${value}T00:00:00`);
          const today = new Date();

          today.setHours(0, 0, 0, 0);

          return inputDate >= today;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be today or a future date`;
        },
      },
    });
  };
}
