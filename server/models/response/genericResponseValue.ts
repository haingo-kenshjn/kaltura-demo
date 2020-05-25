import { ResponseCode } from '../../commons/const';

export default class GenericResponseValue<T> {
  public value: T;

  constructor(value: T) {
    this.value = value;
  }

  public makeResponse = (code?: number, message?: string) => {
    return {
      code: code ? code : ResponseCode.SuccessCode,
      message: message ? message : 'Success',
      result: this.value,
    };
  };
}
