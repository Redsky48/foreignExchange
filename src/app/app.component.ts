import { Component } from "@angular/core";
import { GlobalService } from "./global.service";
import { Subscription } from "rxjs";
import { MessageService } from "./message.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public baseCurrency = this.global.baseCurrency;
  public currencies = this.global.currencies;
  public datePeriod=this.global.datePeriod
  public loading = false;

  public subscription: Subscription;
  constructor(
    private global: GlobalService,
    private messageService: MessageService,
  ) {
    this.subscription = this.messageService.getMessage().subscribe(
      (message) => {
        if (message["text"] == "updateStarted") {
          this.loading = true;
        }

        if (message["text"] == "updateFinished") {
          this.loading = false;
        }
      },
    );
  }
  ngOnInit() {
    this.global.getCurrencies();
  }
  async changeDateBoth($event?: Event) {
    let dateNumber = this.getvalidDateTime($event.target["value"]);
    this.loading = true;
    this.global.datePeriod.from = dateNumber;
    this.global.datePeriod.to = dateNumber;
    await this.global.getCurrencies();
  }
  async changeDateFrom($event?: Event) {
    let dateNumber = this.getvalidDateTime($event.target["value"]);
    this.loading = true;
    this.global.datePeriod.from = dateNumber;
    await this.global.getCurrencies();
  }
  async changeDateTo($event?: Event) {
    let dateNumber = this.getvalidDateTime($event.target["value"]);
    this.loading = true;
    this.global.datePeriod.to = dateNumber;
    await this.global.getCurrencies();
  }
  async openSingleCurrency(currency: string) {
    this.loading = true;
    this.global.currencies.selected.currency = currency;


    let now = new Date().getTime();
    let days = 10;
    let period = 100 * 60 * 60 * 24;

    this.global.datePeriod.from = now - (period * days);
    this.global.datePeriod.to = now;

    console.log(this.global.datePeriod.from, this.global.datePeriod.to);
    await this.getLatestCurrency();
    this.global.currencies.selected.active = true;
    await this.global.getCurrencies();
  }
  async changeValutes() {
    console.log("changed");
    this.loading = true;
  }
  getLatestCurrency() {
    let currency = this.currencies.selected.currency;
    this.global.HTTPReq(
      "GET",
      this.global.exchangeAPI,
      `latest?base=${this.baseCurrency.active}&symbols=${currency}`,
    ).then((res) => {
      this.currencies.selected.lastPrice = res.rates[currency];
    });
  }

  getvalidDateTime(datestring: string) {
    let now = new Date().getTime();
    let date = new Date(datestring).getTime();
    if (!date || typeof date != "number" || date > now) {
      console.log('INVALID DATE')

      return now
    }

    return date;
  }

  
}
