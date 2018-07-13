import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Helpbot';
  isOpen = true;
  message = "";
  messages = [
    {
      text: "Hi! I am Mr.Helpbot!",
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
    let obj = {
      text: isJson ? "<ol>" + JSON.parse(msg) + "</ol>" : msg,
      type: type,
      dateSent: (new Date()).toDateString()
    }
    this.messages.push(obj);
    setTimeout(()=>$('.msg_container_base')[0].scrollTop = $('.msg_container_base')[0].scrollHeight,200)
  }
  public keyDownFunction = (event) => {
    if (event.keyCode == 13) {
      this.sendMessage(this.message);
    }
  }
}
