import { EntryStatus, Request } from 'express'

export class NotificationRequestParams {
    public static createFromRequest(request: Request): NotificationRequestParams {
      const requestParams = new NotificationRequestParams();
      requestParams.id = request.body.entry_id;       
      requestParams.status = request.body.entry_status;
      requestParams.name = request.body.entry_name;
      return requestParams;
    }
  
    private _id: string;
    private _name: string;
    private _status: EntryStatus;
  
    get status(): number {
      return this._status;
    }
    set status(status: number) {
      this._status = status;
    }
  
    get id(): string {
      return this._id;
    }
    set id(id: string) {
      this._id = id;
    }

    get name(): string {
      return this._name;
    }

    set name(name: string) {
    this._name = name;
    }
  
    public validate() {
        // TODO Should provide better validate function
    }
  }
  