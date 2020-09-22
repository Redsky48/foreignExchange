export type currency = {
    lastPrice: number;
    prices: price[];
    currency: string;
    active:boolean
  };
  export type currencies = {
    list: {};
    selected: currency;
    
  };
  export type prices = {
    list: {};
    selected: currency;
    
  };
  export type price = {
    time:string,
    value:number
     
  };
