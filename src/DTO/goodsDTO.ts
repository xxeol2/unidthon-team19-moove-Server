namespace goodsDTO {
  export interface GETgoodsResDTO {
    goods: goodsInfo[];
  }
  
  export interface goodsInfo {
    genGoodsID: number;
    name: string;
    price: number;
    min: number;
    unit: string;
    count: number;
    desc: string;
    photo: string;
    completeNum: number;
    degree: number;
  }

  export interface GETGenGoodsidResDTO {
    name: String;
    min: number;
    price: number;
    count: number;
    completeNum: number;
    photo: String;
    desc: String;
  }

  export interface POSTGoodsidDTO {
    id: Number;
    name: string;
    category: Number;
    min: Number;
    price: Number;
    completeNum: string;
    photo: string;
    isDeleted: boolean;
    desc: string;
  }
}

export default goodsDTO;
