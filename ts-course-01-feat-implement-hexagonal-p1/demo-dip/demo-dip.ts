import { IMsgStorage, INotifier } from "./interfaces";
import { EmailNotification, MySQLMsgStorage, SMSNotification } from "./repository";

class NoticationDIPService {
  // Dependency Injection by constructor
  constructor(
    private notifier: INotifier,
    private readonly dbStorage: IMsgStorage,
  ) { }

  // Dependency Injection by setter method
  setNotifier(n: INotifier) {
    this.notifier = n;
  }

  sendMessage(msg: string): void {
    this.notifier.send(msg);
    // save msg to db
    this.dbStorage.save(msg);
  }
}

// setup dependencies

const smsNotifier = new SMSNotification();
const smgStorage = new MySQLMsgStorage();
const service = new NoticationDIPService(smsNotifier, smgStorage);
// run your business
service.sendMessage('hello');

service.setNotifier(new EmailNotification());
service.sendMessage('hello');


// IoC = Inversion of Control
