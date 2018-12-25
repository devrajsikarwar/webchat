import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import domtoimage from 'dom-to-image';
import { UserstatusProvider } from '../../providers/userstatus/userstatus';

/**
 * Generated class for the StatuscanvasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statuscanvas',
  templateUrl: 'statuscanvas.html',
})
export class StatuscanvasPage {
// @ViewChild('canvas') canvas :ElementRef;
@ViewChild('statusdiv') statusdiv :ElementRef;

  newmessage : string;
  bgcolor : string;
  colorindex :number=0;
  colors :any[] = ['#F08080','#B22222','#FF8C00','#8B008B','#4B0082','#2E8B57','#20B2AA','#F4A460','#DAA520','#8B4513']
  canvasboard: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private statusprovider : UserstatusProvider) {
 
    this.bgcolor = this.colors[this.colorindex];
  }

  ionViewDidLoad() {
    // this.canvasboard = this.canvas.nativeElement.getContext('2d');
    
    console.log('ionViewDidLoad StatuscanvasPage');
  }
  changeColor(){
  this.colorindex;
    if(this.colorindex>=this.colors.length-1)
    {
      this.colorindex= -1;
    }
    this.colorindex = this.colorindex+1;
    this.bgcolor = this.colors[this.colorindex];
  }

  OnStatusTyping(event){
    debugger;
let el = this.statusdiv.nativeElement;
  let fontSize = parseInt(el.style.fontSize);
  for (let i = fontSize; i >= 0; i--) {
      let overflow = isOverflown(el);
      if (overflow) {
       fontSize--;
       el.style.fontSize = fontSize + "px";
      }
  }

  function isOverflown(element) {
    
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

    // this.canvasboard.clearRect(0,0,this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    // this.canvasboard.fillStyle = 'white';
    // this.canvasboard.textAlign="center"; 
    // this.canvasboard.font="30px Arial";

    // var maxWidth = 40; 
    // var x = (this.canvas.nativeElement.width - maxWidth)/2;
    // var y= 50;
    // var lineHeight = 20;
    // var words = event.target.value.split(' ');
    // var line = '';
    // for(var n = 0; n < words.length; n++) {
    //   var testLine = line + words[n] + ' ';
    //   var metrics = this.canvasboard.measureText(testLine);
    //   var testWidth = metrics.width;
    //   if (testWidth > maxWidth && n > 0) { 
    //     this.canvasboard.fillText(line, x, y);
    //     line = words[n] + ' ';
    //     y += lineHeight;
    //   }
    //   else {
    //     line = testLine;
    //   }
    // }
    // this.canvasboard.fillText(line, x, y);

  }

  generateImage(){
    domtoimage.toPng(this.statusdiv.nativeElement).then((dataUrl)=>{
      this.sendStatus(dataUrl);
    }).catch((err)=>{
    console.log(err);
    })  
  }

  sendStatus(dataUrl){
    this.statusprovider.uploadStatus(dataUrl,'image/png').then(res=>{
      this.statusprovider.SaveStatus(res).then(res=>{
          console.log(res);
      }).catch(err=>{
        console.log(err);
      })
    })
  }

}
