export interface UserRow{
  id:number;
  email:string;
  password_hash:string;
  level:number;
  password_reseted:boolean;
}

export class UserModel{
  ID?:number;
  Email?:string;
  PasswordHash?:string;
  Level?:number;
  PasswordReseted?:boolean;

  constructor(email?:string,passwordHash?:string,id?:number,level?:number,passwordReseted?:boolean){
    this.ID = id;
    this.Email = email;
    this.PasswordHash = passwordHash;
    this.Level = level;
    this.PasswordReseted = passwordReseted;
  }
}

export function UserFromRow(row:UserRow){
  return new UserModel(row.email,row.password_hash,row.id,row.level,row.password_reseted);
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

export function ValidateRawPW(password:string=''):[boolean,string?]{

  //Minimum size
  if (password.length < 8){
    return [false,'Senha muito curta.'];
  }

  //Lower Case Characters
  if (!password.match(/[a-z]/g)){
    return [false,'Falta de um caracter minúsculo.'];
  }

  //Upper Case Characters
  if (!password.match(/[A-Z]/g)){
    return [false,'Falta de um caracter minúsculo.'];
  }

  //Numbers and special characters
  if (!password.match(/[0-9\'\"\!\@\#\$\%\&\*\(\)\_\-\+\=\{\[\}\]\<\,\>\.\:\;\?\/]/)){
    return [false,'Falta de número ou caracter especial.']
  }

  return [true];

}

export function GenerateRandomPassword():string{
  let lowerCase = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  let upperCase = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let special  = ['1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','*','(',')'];
  const randomChars = ():string =>{
    let final = '';
    for(let i = 0; i<=10 ; i++){
      switch(i%3){
        case 0:
          final+=lowerCase[Math.floor(Math.random()*lowerCase.length)];
          break;
        case 1:
          final+=upperCase[Math.floor(Math.random()*upperCase.length)];
          break;
        case 2:
          final+=special[Math.floor(Math.random()*special.length)];
          break;
      }
    }
    return final;
  }

  let generatedPW = '';

  while (true){
    generatedPW = randomChars();
    if (ValidateRawPW(generatedPW)[0]){ break; }
  }

  return generatedPW;

}