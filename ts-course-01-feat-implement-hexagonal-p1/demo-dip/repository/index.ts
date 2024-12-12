import { IMsgStorage, INotifier } from "../interfaces";

export class SMSNotification implements INotifier {
  send(msg: string): void {
    // complex code for sending SMS message
    // import SMS gateway library, config then send msg
    console.log('sent with SMS:', msg);
  }
}

export class EmailNotification implements INotifier {
  send(msg: string): void {
    // complex code for sending Email message
    // import Email gateway library, config then send msg
    console.log('sent with Email:', msg);
  }
}

export class MySQLMsgStorage implements IMsgStorage {
  save(msg: string): string {
    console.log('saved message:', msg);
    return "ok";
  }
}