export class RDT {
  ID:number;
  Tittle:string;
  DateTime:Date;
  Situation:string;
  AutoThoughts:string;
  Emotion:string;
  Response:string;
  Outcome:string;

	constructor(id:number, tittle: string, dateTime: Date, situation: string, autoThoughts: string, emotion: string, response: string, outcome: string) {
    this.ID = id;
    this.Tittle = tittle;
		this.DateTime = dateTime;
		this.Situation = situation;
		this.AutoThoughts = autoThoughts;
		this.Emotion = emotion;
		this.Response = response;
		this.Outcome = outcome;
	}
}

export function RDTFromRow(
row:{
  id: number,
  tittle: string,
  datetime: string,
  situation: string,
  auto_thoughts: string,
  emotion: string,
  response: string,
  outcome: string,
  person_id: number
}){
  return new RDT(row.id,row.tittle,new Date(row.datetime),row.situation,row.auto_thoughts,row.emotion,row.response,row.outcome);
}

export function RDTArrayFromRows(
rows:{
  id: number,
  tittle: string,
  datetime: string,
  situation: string,
  auto_thoughts: string,
  emotion: string,
  response: string,
  outcome: string,
  person_id: number
}[]){
  return rows.map((row)=>RDTFromRow(row))
}