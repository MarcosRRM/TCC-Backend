export interface UserRow{
  id:number;
  email:string;
  password_hash:string;
}

export class User{
  ID?:number;
  Email:string;
  PasswordHash:string;

  constructor(email:string,passwordHash:string,id?:number){
    this.ID = id;
    this.Email = email;
    this.PasswordHash = passwordHash;
  }
}

export function UserFromRow(row:UserRow){
  return new User(row.email,row.password_hash,row.id);
}

export function UserArrayFromRows(rows:UserRow[]){
  return rows.map((row)=>UserFromRow(row));
}