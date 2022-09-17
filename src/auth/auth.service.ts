import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
  signup() {
    return {
      msg: 'i am signup'
    }
  }

  login() {
    return {
      msg: 'i am login'
    }
  }
}
