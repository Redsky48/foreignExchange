import { Component, OnInit, Input } from '@angular/core';
import {  price } from '../interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input('active') active:string
  @Input('prices') prices:price[]
  public Object=Object
  public Math = Math

  public barSettings={
    width:36,
    padding:5,
    maxHeight:0,
    minHeight:0,
    heightDiference:0

  }
  public chartWidth=1600
  public chartheight=800

 public hoverInfo={
    i:null,
    x:0,
    y:0
  }
  constructor() { 
  }

  ngOnInit(): void {
    this.redraw()
    this.prices.sort((a, b) => (a.time > b.time) ? 1 : -1)
  }
  redraw(){
    let maxHeight=null
    let minHeight=null

    let availablesingleBarSpace=this.chartWidth/this.prices.length
    this.barSettings.padding=availablesingleBarSpace/10
    this.barSettings.width=availablesingleBarSpace-this.barSettings.padding


    for(let price of this.prices){
      if(!maxHeight || price.value > maxHeight) maxHeight=price.value;
      if(!minHeight || price.value < minHeight) minHeight=price.value;
    }


    this.barSettings.maxHeight=maxHeight
    this.barSettings.minHeight=minHeight
    let multiplier=100;
    this.barSettings.heightDiference= ((maxHeight*multiplier)- (minHeight*multiplier))/multiplier
  
  }


  generateHight(value){
    let diff=this.barSettings.heightDiference
    let part= this.chartheight/diff
    let curSize=(value-this.barSettings.maxHeight)
    let res=(curSize*part)
    //console.log(diff,part,curSize,res)
    return res
  }

  barHoverEvent(event,i){
    this.hoverInfo.i=i
    this.hoverInfo.x=event.x+20
    this.hoverInfo.y=event.y+10
    //console.log(event)
  }

}
