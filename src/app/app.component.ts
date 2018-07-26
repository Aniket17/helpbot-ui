import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  title = 'Helpbot';
  isOpen = true;
  message = "";
  messages = [
    {
      text: "You are connected to helpbot!",
      dateSent: (new Date()).toDateString(),
      type: "recieve"
    }];
  isLoading = false;
  http;
  constructor(private client: HttpClient) {
    this.http = client;
  }

  public toggleChat = () => {
    this.isOpen = !this.isOpen;
  }

  public sendMessage = (message) => {
    if (!message) { return; }
    this.isLoading = true;
    let self = this;
    self.processMessage(message, "sent", false);
    this.http.post('http://localhost:5004/chat/', { sender: "", message: this.message })
      .subscribe(data => {
        self.message = "";
        self.isLoading = false;
        //data is array of fukcing strings and json
        data.forEach(msg => {
          try {
            self.processMessage(msg, "recieve", true);
          } catch (error) {
            //continue.. dont bother.. its normal message
            self.processMessage(msg, "recieve", false);
          }
        });
      });
  }
  public processMessage = (msg, type, isJson) => {
    let date = new Date();
    let dd = date.getDay();
    let mm = date.getMonth();
    let hour = date.getHours();
    let mins = date.getMinutes();

    let obj = {
      text: isJson ? "<ol>" + JSON.parse(msg) + "</ol>" : msg,
      type: type,
      dateSent: dd+"/"+mm+" - "+ hour+":"+mins
    }
    this.messages.push(obj);
    //this.document.getElementsByClassName('.msg_container_base')[0].scrollTop = this.document.getElementsByClassName('.msg_container_base')[0].scrollHeight
  }
  public keyDownFunction = (event) => {
    if (event.keyCode == 13) {
      this.sendMessage(this.message);
    }
  }
}
