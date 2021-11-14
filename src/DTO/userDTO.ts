namespace userDTO {
  export interface GETuserResDTO {
    nickname: string;
  }

  export interface POSTemailReqDTO {
    genGoodsID: number;
  }
  export interface POSTuserResDTO {
    name: string;
    desc: string;
    photo: string;
    state: string;
    key: number;
    storageNum: number;
    degree: number;
  }
  export interface POSTphotoResDTO {
    photo: string;
  }
}

export default userDTO;
