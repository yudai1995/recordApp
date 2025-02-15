import { Injectable } from '@angular/core';

interface Message {
  number: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  add(message: string) {
    // numberは1から始まる
    // 次のnumberは最後のnumber+1
    const nextNumber =
      this.messages.length > 0 ? this.messages[0].number + 1 : 1;
    this.messages = [
      { number: nextNumber, message: message },
      ...this.messages,
    ];
  }

  clear() {
    this.messages = [];
  }
}
