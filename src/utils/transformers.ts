import { TransformFnParams } from 'class-transformer';

export function toNumber({ value }: TransformFnParams): number {
  const parsedValue = Number(value);

  if (isNaN(parsedValue)) {
    return value;
  }

  return parsedValue;
}

export function toBoolean({ value }: TransformFnParams): boolean {
  return !value || value === '0' || value === 'false' ? false : true;
}
