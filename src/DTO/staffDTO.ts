namespace staffDTO {
  export interface POSTsignupReqDTO {
    email: string;
    password: string;
    name: string;
    phone: string;
    university: string;
  }

  export interface POSTsigninReqDTO {
    email: string;
    password: string;
  }

  export interface POSTsigninResDTO {
    staffID: number;
    university: string;
  }
}

export default staffDTO;
