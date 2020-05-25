import { ResponseCode } from './const';

export class CommonError {
  public static create(message: string, httpCode: string, code: string = ResponseCode.Forbidden): CommonError {
    const error = new CommonError();
    error.config = {};
    error.code = code;
    error.httpCode = parseInt(httpCode, 10);
    error.name = error.message = message;
    return error;
  }

  public config: any;
  public code?: string;
  public httpCode?: number;
  public request?: any;
  public response?: any;
  public name: string;
  public message: string;
  public stack?: string;

  public getTrace(): string {
    const trace = [];

    if (this.stack) {
      trace.push(this.stack);
    }

    if (this.config.url || this.config.method) {
      trace.push(`url: ${this.config.url}`);
      trace.push(`method: ${this.config.method}`);
      trace.push(`body: ${this.config.data}`);
    }

    return trace.join('\n');
  }
}
