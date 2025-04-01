export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  available: boolean;
  packets: string[];
  ratings: string[];
  seleccionado?: boolean;
}

export class User implements User {
  constructor() {
    this.seleccionado = false;
  }
}