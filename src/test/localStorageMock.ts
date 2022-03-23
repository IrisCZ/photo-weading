export class LocalStorageMock {
    store: { [key: string]: string };
    length: 0;
    key: (index: number) => string | null;
  
    constructor() {
      this.store = {};
      this.length = 0;
      this.key = () => null;
    }
  
    public clear() {
      this.store = {};
    }
  
    public getItem(key: string) {
      return this.store[key] || null;
    }
  
    public setItem(key: string, value: string) {
      this.store[key] = String(value);
    }
  
    public removeItem(key: string) {
      delete this.store[key];
    }
  }
  