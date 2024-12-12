class NoticationService {
  private dbStorage: MsgStorage = new MsgStorage();

  constructor(readonly type: 'sms' | 'email') { }

  sendMessage(msg: string): void {
    if (this.type === 'sms') {
      // complex code for sending SMS message
      // import SMS gateway library, config then send msg
      console.log('sent with SMS:', msg);
    } else {
      // complex code for sending Email message
      // import Email gateway library, config then send msg
      console.log('sent with Email:', msg);
    }

    // save msg to db
    this.dbStorage.save(msg);
  }
}

// package repository
class MsgStorage {
  save(msg: string): string {
    return "ok";
  };
}