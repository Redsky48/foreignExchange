import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownComponent implements OnInit {
  @Input("list") list: [];
  @Input("exclude") exclude: string;
  public activeString = "";
  @Input() get active() {
    return this.activeString;
  }
  set active(val) {
    this.activeString = val;
    this.activeChange.emit(this.activeString);
  }
  @Output() activeChange = new EventEmitter();



  public showDropdown = false;


  constructor(private global: GlobalService) {
   
  }

  async ngOnInit() {
    setTimeout(()=>{
      this.list=this.list.sort()
      console.log(this.list)
    },1000)

  }

  setCurrency(currency) {
    this.activeString = currency;
    this.showDropdown=false
    this.activeChange.emit(this.activeString);
    this.global.getCurrencies()
  }
}
