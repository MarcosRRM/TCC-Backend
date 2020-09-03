export interface iRDTRow{
  id: number,
  tittle: string,
  datetime: string,
  situation: string,
  auto_thoughts: string,
  emotion: string,
  response: string,
  outcome: string,
  person_id: number,
  last_update: string
}

export class RDTModel {
  ID?:number;
  Tittle?:string;
  DateTime?:Date;
  Situation?:string;
  AutoThoughts?:string;
  Emotion?:string;
  Response?:string;
  Outcome?:string;
  PersonID?:number;
  LastUpdate?:Date;

	constructor(tittle: string, dateTime?: Date, situation?: string, autoThoughts?: string, emotion?: string, response?: string, outcome?: string,id?:number, personId?:number, lastUpdate?:Date) {
    this.ID = id;
    this.Tittle = tittle;
		this.DateTime = dateTime;
		this.Situation = situation;
		this.AutoThoughts = autoThoughts;
		this.Emotion = emotion;
		this.Response = response;
    this.Outcome = outcome;
    this.PersonID = personId;
    this.LastUpdate = lastUpdate;
	}
}

export function RDTFromRow(row:iRDTRow){
  return new RDTModel(row.tittle,new Date(row.datetime),row.situation,row.auto_thoughts,row.emotion,row.response,row.outcome,row.id,row.person_id,new Date(row.last_update));
}

export function RDTArrayFromRows(rows:iRDTRow[]){
  return rows.map((row)=>RDTFromRow(row))
}

export function ValidateRDT (rdt:RDTModel, validatePK:boolean=true, validateFK:boolean=true):[boolean,string?]{

  if (typeof rdt.Tittle !== 'string' || rdt.Tittle.length > 32){
    return [false,'Invalid Tittle'];
  }

  if (!(rdt.DateTime instanceof Date) || rdt.DateTime > new Date()){
    return [false,'Invalid DateTime'];
  }

  if (typeof rdt.Situation !== 'string' || rdt.Situation.length > 255){
    return [false,'Invalid Situation'];
  }

  if (typeof rdt.AutoThoughts !== 'string' || rdt.AutoThoughts.length > 255){
    return [false,'Invalid Situation'];
  }

  if (typeof rdt.Emotion !== 'string' || rdt.Emotion.length > 255){
    return [false,'Invalid Emotion'];
  }

  if (typeof rdt.Response !== 'string' || rdt.Response.length > 255){
    return [false,'Invalid Response'];
  }

  if (typeof rdt.Outcome !== 'string' || rdt.Outcome.length > 255){
    return [false,'Invalid Outcome'];
  }

  if (validatePK){
    if (typeof rdt.ID !== 'number' || rdt.ID <= 0){
      return [false,'Invalid ID'];
    }
  }
  
  if (validateFK){
    if (typeof rdt.PersonID !== 'number' || rdt.PersonID <= 0){
      return [false,'Invalid PersonID'];
    }
  }

  return [true];
}