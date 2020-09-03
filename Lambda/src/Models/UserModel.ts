export interface UserRow{
  id:number;
  email:string;
  password_hash:string;
  level:number;
}

export class UserModel{
  ID?:number;
  Email?:string;
  PasswordHash?:string;
  Level?:number;

  constructor(email?:string,passwordHash?:string,id?:number,level?:number){
    this.ID = id;
    this.Email = email;
    this.PasswordHash = passwordHash;
    this.Level = level;
  }
}

export function UserFromRow(row:UserRow){
  return new UserModel(row.email,row.password_hash,row.id,row.level);
}

export function UserArrayFromRows(rows:UserRow[]){
  return rows.map((row)=>UserFromRow(row));
}

export function ValidateUser(user:UserModel, validatePK:boolean=true):[boolean,string?]{
  
  if (validatePK){
    if (typeof user.ID !== 'number' || user.ID <= 0 ){
      return [false,'Invalid ID'];
    }
  }

  if (typeof user.Email !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-_]+(\.[a-zA-Z]{2,})+$/.test(user.Email) ) {
    return [false,'Invalid Email'];
  }
  
  if (typeof user.PasswordHash !== 'string' || user.PasswordHash.length !== 128 ){
    return [false,'Invalid PW Hash'];
  }

  if (typeof user.Level !== 'number' || user.Level < 0 ){
    return [false,'Invalid Level'];
  }

  return [true];
}