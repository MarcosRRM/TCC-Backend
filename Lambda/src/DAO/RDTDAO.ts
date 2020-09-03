import {RDTModel, RDTFromRow, RDTArrayFromRows} from '../Models/RDTModel';
import ConnPool from "../Utils/DBModule";
import QueryConstructor from '../Utils/QueryConstructor';

export default {

  GetAllRDT: async ():Promise<RDTModel[]> => {
    return ConnPool.query('SELECT * FROM "DiariesDB".rdt')
		.then((res)=> RDTArrayFromRows(res.rows))
  },

  GetRDTByModel: async (model:RDTModel):Promise<RDTModel> => {

    let query = new QueryConstructor('SELECT * FROM "DiariesDB"."person" WHERE');

    if (model.ID){
      query.AddParam('id = $X::numeric', model.ID);
    }

    if (model.PersonID){
      query.AddParam('person_id = $X::numeric', model.PersonID);
    }

    if (model.DateTime){
      query.AddParam('datetime = $X', model.DateTime);
    }

    if (model.Tittle){
      query.AddParam('tittle = $X::text', model.Tittle)
    }

    if (model.AutoThoughts){
      query.AddParam('auto_thoughts = $X::text', model.AutoThoughts)
    }

    if (model.Emotion){
      query.AddParam('emotion = $X::text', model.Emotion)
    }
    
    if (model.Outcome){
      query.AddParam('outcome = $X::text', model.Outcome)
    }

    if (model.Situation){
      query.AddParam('situation = $X::text', model.Situation)
    }
    
    if (model.Response){
      query.AddParam('response = $X::text', model.Response)
    }

    return ConnPool.query( query.Query, query.Params )
      .then( (res) => {
        if (res.rowCount>0){ return RDTFromRow(res.rows[0]); }
			  else{ throw 'No Such RDT'; }
      });
  },

  AddRDT: async (rdt:RDTModel):Promise<number|any> => {
  
    let query = `
    INSERT INTO "DiariesDB"."rdt"
    (
      tittle,
      datetime,
      situation,
      auto_thoughts,
      emotion,
      response,
      outcome,
      person_id,
      last_update
    ) VALUES(
      $1::text,
      $2::timestamp,
      $3::text,
      $4::text,
      $5::text,
      $6::text,
      $7::text,
      $8::numeric,
      $9::timestamp
    )
    RETURNING id;
    `
    let queryParam = [rdt.Tittle, rdt.DateTime, rdt.Situation, rdt.AutoThoughts, rdt.Emotion, rdt.Response, rdt.Outcome, rdt.PersonID, rdt.LastUpdate];

    let error = '';

    let id = await ConnPool.query( query, queryParam )
    .then((res)=> res.rows[0].id )
    .catch((err)=> {error = err; return 0;})

    if (id>0){
      return Promise.resolve(id);
    }
    else{
      return Promise.reject(error);
    }
  }
}