export interface iPersonRow{
  id:number,
  full_name:string,
  user_id:number
}

export class Person{
  ID?:number;
  FullName:string;
  UserID?:number;

constructor(fullName:string, userId?:number,id?:number){
    this.ID = id;
    this.FullName = fullName;
    this.UserID = userId;
  }
}

export function PersonFromRow(row:iPersonRow){
  return new Person(row.full_name,row.user_id,row.id);
}

export function PersonArrayFromRows(rows:iPersonRow[]){
  return rows.map((row)=> PersonFromRow(row));
}