export enum ResponseCode {
  SuccessCode = '200',
  NotFoundCode = '404',
  ServerInnerErrorCode = '500',
  BadRequest = '400',
  UnAuthorized = '401',
  Forbidden = '403',
  TooManyRequests = '429',
}

export enum SystemEnv {
  PRODUCTION = 'production',
  LOCAL = 'local',
  BETA = 'beta',
  DEVELOPMENT = 'development',
}

export enum EntryStatus {
  ERROR_IMPORTING = '-2',
  ERROR_CONVERTING = '-1',
  IMPORT ='0',
  INFECTED ='virusScan.Infected',
  SCAN_FAILURE ='virusScan.ScanFailure',
  PRECONVERT ='1',
  READY ='2',
  DELETED ='3',
  PENDING ='4',
  MODERATE ='5',
  BLOCKED ='6',
  NO_CONTENT ='7',
};