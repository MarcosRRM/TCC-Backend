export interface iRDTRow{
  id: number,
  title: string,
  datetime: Date,
  situation: string,
  auto_thoughts: string,
  emotion: string,
  response: string,
  outcome: string,
  person_id: number,
  last_update: Date
}

export class RDTModel {
  ID?:number;
  Title?:string;
  DateTime?:Date;
  Situation?:string;
  AutoThoughts?:string;
  Emotion?:string;
  Response?:string;
  Outcome?:string;
  PersonID?:number;
  LastUpdate?:Date;

	constructor(title: string, dateTime?: Date, situation?: string, autoThoughts?: string, emotion?: string, response?: string, outcome?: string,id?:number, personId?:number, lastUpdate?:Date) {
    this.ID = id;
    this.Title = title;
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
  return new RDTModel(row.title,row.datetime,row.situation,row.auto_thoughts,row.emotion,row.response,row.outcome,row.id,row.person_id,row.last_update);
}

export function RDTArrayFromRows(rows:iRDTRow[]){
  return rows.map((row)=>RDTFromRow(row))
}

export function ValidateRDT (rdt:RDTModel, validatePK:boolean=true, validateFK:boolean=true):[boolean,string?]{

  if (typeof rdt.Title !== 'string' || rdt.Title.length > 32){
    return [false,'Invalid Title'];
  }

  if (rdt.DateTime && (!(rdt.DateTime instanceof Date) || rdt.DateTime > new Date())){
    return [false,'Invalid DateTime'];
  }

  if (rdt.Situation && (typeof rdt.Situation !== 'string' || rdt.Situation.length > 255)){
    return [false,'Invalid Situation'];
  }

  if (rdt.AutoThoughts && (typeof rdt.AutoThoughts !== 'string' || rdt.AutoThoughts.length > 255)){
    return [false,'Invalid Situation'];
  }

  if (rdt.Emotion && (typeof rdt.Emotion !== 'string' || rdt.Emotion.length > 255)){
    return [false,'Invalid Emotion'];
  }

  if (rdt.Response && (typeof rdt.Response !== 'string' || rdt.Response.length > 255)){
    return [false,'Invalid Response'];
  }

  if (rdt.Outcome && (typeof rdt.Outcome !== 'string' || rdt.Outcome.length > 255)){
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