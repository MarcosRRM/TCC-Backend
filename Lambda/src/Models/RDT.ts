export interface iRDTRow{
  id: number,
  tittle: string,
  datetime: string,
  situation: string,
  auto_thoughts: string,
  emotion: string,
  response: string,
  outcome: string,
  person_id: number
}

export class RDT {
  ID?:number;
  Tittle:string;
  DateTime:Date;
  Situation:string;
  AutoThoughts:string;
  Emotion:string;
  Response:string;
  Outcome:string;
  PersonID?:number;

	constructor(tittle: string, dateTime: Date, situation: string, autoThoughts: string, emotion: string, response: string, outcome: string,id?:number, personId?:number) {
    this.ID = id;
    this.Tittle = tittle;
		this.DateTime = dateTime;
		this.Situation = situation;
		this.AutoThoughts = autoThoughts;
		this.Emotion = emotion;
		this.Response = response;
    this.Outcome = outcome;
    this.PersonID = personId
	}
}

export function RDTFromRow(row:iRDTRow){
  return new RDT(row.tittle,new Date(row.datetime),row.situation,row.auto_thoughts,row.emotion,row.response,row.outcome,row.id,row.person_id);
}

export function RDTArrayFromRows(rows:iRDTRow[]){
  return rows.map((row)=>RDTFromRow(row))
}