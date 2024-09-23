import { User } from './types';
export {}

declare global {
    interface CustomJwtSession extends User{}
        

}


declare global {
  interface CustomJwtSessionClaims {
    firstName?: string
    lastName?: string
  }
}