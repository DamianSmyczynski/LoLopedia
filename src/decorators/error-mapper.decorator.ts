import { ErrorToApiErrorMapper } from '../controllers/mappers/error-to-api-error.mapper';

export const ErrorMapper = () => {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        const result = originalMethod.apply(this, args);
        return result;
      } catch (error) {
        ErrorToApiErrorMapper.map(error);
      }
    };
    return descriptor;
  };
};
