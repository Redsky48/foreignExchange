import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currencies } from './interfaces';
import { Subscription } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public date = new Date().getTime()-100*60*60*12;
  public datePeriod = {
    from: this.date,
    to: this.date,
  };
  public baseCurrency = {
    dropdownList: [],
    active: "EUR",
    showDropdown: false,
  };
  public currencies: currencies = {
    list: {},
    selected: {
      lastPrice: 0,
      prices: [],
      currency: "USD",
      active:false
    },
  };
  public subscription:Subscription
  public exchangeAPI ='https://api.exchangeratesapi.io/'

  constructor(private http: HttpClient,private messageService:MessageService) {
   }

  async HTTPReq(type, API, location?, element?, AddHeader?): Promise<any> {
    if (!element) {
      element = {}
    }


    // ////console.log('notiek izsauciens uz ' + API)
    return new Promise((resolve, reject) => {
      let result;
      if (type == 'GET') {
        result = this.http.get(API + location, element,
        ).subscribe(result => {

          let body = result;
          if (body) {
            return resolve(body);
          } else {
            return reject(body);
          }
        });
      }
      if (type == 'POST') {
        result = this.http.post(API + location, element
        ).subscribe(result => {
          //   ////console.log(result);
          let body = result;
          //let body = result;
          if (body) {
            return resolve(body);
          } else {
            return reject(body);
          }
        });
      }
      if (type == 'DELETE') {
        result = this.http.delete(API + location, element
        ).subscribe(result => {
          //   ////console.log(result);
          let body = result;
          //let body = result;
          if (body) {
            return resolve(body);
          } else {
            return reject(body);
          }
        });
      }

    });



  }

 
  async getCurrencies() {
    this.formatValidTimePeriod()
    this.messageService.sendMessage('updateStarted')
    let result = new Promise(async (resolve, reject)=> {
    let datePeriodURLString = this.formatDatePeriodURLString()
     // console.log(this.datePeriod)
      await this.HTTPReq("GET",this.exchangeAPI,`${datePeriodURLString}base=${this.baseCurrency.active}`).then((res)=>{
       let rates=res.rates
        if (this.baseCurrency.dropdownList.length < 1) {
          this.setCurrencyDropdownList(rates)
        }
        if (!this.currencies.selected.active) {
          this.currencies.list = rates;
        } else {
         this.setPricesForSelectedCurrency(rates)
        }
        resolve()
        this.messageService.sendMessage('updateFinished')
      })

    });
    return result
  }

  formatDate(dateTime: number): string {
    let now = new Date().getTime()
    
    if (typeof dateTime != "number" || dateTime <= 0 || dateTime > now) dateTime = this.date;
    let date = new Date(dateTime);
    return date.getFullYear() + "-" + (date.getMonth()+ 1 ) + "-" +
      (date.getDate() );
  }
  formatValidTimePeriod(){
    if(this.datePeriod.from>this.datePeriod.to){
      console.log('time period validating ---- ',this.datePeriod.to,this.datePeriod.from)
      this.datePeriod.from=this.datePeriod.to
    }
  }
  setPricesForSelectedCurrency(rates){
    let selectedExchange=this.currencies.selected.currency
    this.currencies.selected.prices=[]
    for(let time of Object.keys(rates)){
      this.currencies.selected.prices.push({
        time:time,
        value:rates[time][selectedExchange]
      })
    }
  }
  formatDatePeriodURLString(){
    let selectedExchange=this.currencies.selected.currency
    let dateFormat = this.formatDate(this.datePeriod.to) + "?";
    if (this.datePeriod.to != this.datePeriod.from) {
      dateFormat =
        `history?start_at=${this.formatDate(this.datePeriod.from)}&end_at=${this.formatDate(this.datePeriod.to)}&symbols=${selectedExchange}&`;
    }
    return dateFormat
  }
  setCurrencyDropdownList(rates){
    this.baseCurrency.dropdownList.push('EUR')
          for (let currency of Object.keys(rates)) {
            this.baseCurrency.dropdownList.push(currency);
      }
  }
}
