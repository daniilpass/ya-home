import { StatUserRequest } from '../../dal/entities/StatUserRequest';

export type UserRequestInfo = Pick<StatUserRequest,
   | 'userId'
   | 'route'
   | 'path'
   | 'method'
   | 'statusCode'
   | 'timestamp'
   | 'duration'
   | 'userAddress'
   | 'userAgent'
>