namespace authDTO {
  export interface POSTemailReqDTO {
    email: string;
  }

  export interface POSTemailResDTO {
    code: string;
  }

  export interface POSTcodeReqDTO {
    email: string;
    code: string;
  }

  export interface POSTcodeResDTO {
    isOkay: Boolean;
  }

  export interface POSTsignupReqDTO {
    university: string;
    major: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    password: string;
  }

  export interface POSTsigninReqDTO {
    email: string;
    password: string;
  }

  export interface POSTsigninResDTO {
    userID: number;
    nickname: string;
    university: string;
  }

  export interface POSTnicknameReqDTO {
    nickname: string;
  }
}

export default authDTO;
