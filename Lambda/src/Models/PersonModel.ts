export interface iPersonRow{
  id:number,
  full_name:string,
  user_id:number
}

export class PersonModel{
  ID?:number;
  FullName?:string;
  UserID?:number;

constructor(fullName?:string, userId?:number,id?:number){
    this.ID = id;
    this.FullName = fullName;
    this.UserID = userId;
  }
}

export function PersonFromRow(row:iPersonRow){
  return new PersonModel(row.full_name,row.user_id,row.id);
}

export function PersonArrayFromRows(rows:iPersonRow[]){
  return rows.map((row)=> PersonFromRow(row));
}

export function ValidatePerson(person:PersonModel, validatePK:boolean=true, validateFK:boolean=true):[boolean,string?]{
  
  if (validatePK){
    if (typeof person.ID !== 'number' || person.ID <= 0 ){
      return [false,'Invalid ID'];
    }
  }

  if (typeof person.FullName !== 'string' || person.FullName.length > 64 || person.FullName.length < 1 ){
    return [false,'Invalid FullName'];
  }

  if (validateFK){
    if ( typeof person.UserID !== 'number' || person.UserID <=0 ){
      return [false,'Invalid UserID'];
    }
  }

  return [true];
}