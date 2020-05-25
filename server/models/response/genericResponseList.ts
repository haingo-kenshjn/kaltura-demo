import { ResponseCode } from '../../commons/const';

export default class GenericResponseList<T> {
  public list: T[];

  constructor(list: T[]) {
    this.list = list;
  }

  public makeResponse = (code?: number, message?: string) => {
    return {
      code: code ? code : ResponseCode.SuccessCode,
      message: message ? message : 'Success',
      result: this.list,
    };
  };
}
