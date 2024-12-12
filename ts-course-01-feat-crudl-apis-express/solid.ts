// Problem: A messy class

class Item {
  constructor(
    readonly id: number,
    readonly spec: ItemSpec,
    readonly imgUrl: string,
    public price: number,
    public quantity: number
  ) { }

  // getters & setters...

  // demo business logic
  setPrice(newPrice: number): boolean {
    if (newPrice <= 0) return false;

    this.price = newPrice;
    return true;
  }

  increaseQuantity(amount: number): boolean {
    if (amount <= 0) return false;

    this.quantity += amount;
    return true;
  }

  decreaseQuantity(amount: number): boolean {
    if (amount <= 0 || (this.quantity - amount) < 0) return false;

    this.quantity -= amount;
    return true;
  }

  compare(spec: ItemSpec): boolean {
    return this.spec.compare(spec);
  }

  // encodeToString(): string {
  //   return `${this.id} - ${this.spec.name} - ${this.spec.type} - ${this.spec.color}`;
  // }

  // encodeToJSON(): string {
  //   return `{
  //     "id": ${this.id}, 
  //     "name": ${this.spec.name},
  //     "type": ${this.spec.type},
  //     "color": ${this.spec.color},
  //   }`;
  // }

  encode(encoder: IItemEncoder): string {
    return encoder.encode(this);
  }

  saveToDb(dbConn: any): boolean {
    // complex code to save to db
    console.log('saving to db...');
    return true;
  }

  removeFromDb(dbConn: any): boolean {
    // complex code to remove from db
    console.log('saving from db...');
    return true;
  }
}

class ItemSpec {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly color: string,
  ) { }

  compare(item: ItemSpec): boolean {
    return this.name === item.name &&
      this.type === item.type &&
      this.color === item.color;
  }
}

class DigitalItemSpec extends ItemSpec {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly color: string,
    readonly fileExt: string) {
    super(name, type, color);
  }

  compare(item: DigitalItemSpec): boolean {
    return super.compare(item) && // don't forget this line
      this.fileExt === item.fileExt; // ok
  }
}

// === compare without convert
// == compare with some convert data
// === is faster than ==

interface IItemEncoder {
  encode(item: Item): string;
}

class ItemStringEncoder implements IItemEncoder {
  encode(item: Item): string {
    return `${item.id} - ${item.spec.name} - ${item.spec.type} - ${item.spec.color}`;
  }
}

class ItemJSONEncoder implements IItemEncoder {
  encode(item: Item): string {
    return `{
      "id": ${item.id}, 
      "name": ${item.spec.name},
      "type": ${item.spec.type},
      "color": ${item.spec.color},
    }`;
  }
}

// class ItemWrongEncoder implements IItemEncoder {
//   encode(item: Item): string {
//     throw new Error('error');
//     return "";
//   }
// }

abstract class Shape {
  abstract area(): number
}

interface Encode {
  encode(): void
}

interface Decode {
  decode(): void
}

interface Endecode extends Encode, Decode {}

class NeedEncode implements Encode {
  encode(): void {
    
  }
}

class Something implements Encode, Decode {
  decode(): void {
    
  }
  encode(): void {
    
  }
}


console.log('SOLID');