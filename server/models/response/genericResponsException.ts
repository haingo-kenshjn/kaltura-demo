import { ResponseCode } from '../../commons/const';
import { CommonError } from '../../commons/commonError';

export default class GenericResponseException<T> {
  private code: number;
  private error: CommonError;

  constructor(error: CommonError, code?: number) {
    if (code) {
      this.code = code;
    }

    this.error = error;

    if (error.response && error.response.status === parseInt(ResponseCode.ServerInnerErrorCode, 10)) {
      this.error.code = error.response.status.toString();
    }
  }

  public makeResponse = () => {
    return {
      code: this.code ? this.code : this.error.code ? this.error.code : ResponseCode.NotFoundCode,
      message: this.error.message ? this.error.message : 'ERROR',
      result: {},
    };
  };
}
