import type { StatUserRequest } from '../../dal/entities/StatUserRequest';

export type UserRequestInfo = Pick<StatUserRequest,
   | 'userId'
   | 'route'
   | 'path'
   | 'method'
   | 'statusCode'
   | 'date'
   | 'duration'
   | 'userAddress'
   | 'userAgent'
>