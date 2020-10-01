import {RDTModel, RDTFromRow, RDTArrayFromRows} from '../Models/RDTModel';
import ConnPool from "../Utils/DBModule";
import QueryConstructor from '../Utils/QueryConstructor';

export default {

  GetAllRDT: async ():Promise<RDTModel[]> => {
    return ConnPool.query('SELECT * FROM "DiariesDB".rdt')
		.then((res)=> RDTArrayFromRows(res.rows))
  },

  GetRDTByModel: async (model:RDTModel, single=true):Promise<RDTModel|RDTModel[]> => {

    let query = new QueryConstructor('SELECT * FROM "DiariesDB"."rdt" WHERE');

    if (model.ID){
      query.AddParam('id = $X::numeric', model.ID);
    }

    if (model.PersonID){
      query.AddParam('person_id = $X::numeric', model.PersonID);
    }

    if (model.DateTime){
      query.AddParam('datetime = $X', model.DateTime);
    }

    if (model.Title){
      query.AddParam('title = $X::text', model.Title)
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
      if (res.rowCount>0){
        return single ? RDTFromRow(res.rows[0]) : RDTArrayFromRows(res.rows);
      }
      else {
        return single ? null : [];
      }
    })
    .catch((err)=>{ console.log('ERROR_SELECTING_RDT: ', err, ' || MODEL: ',model); return err});
  },

  AddRDT: async (rdt:RDTModel):Promise<number|any> => {
  
    let query = `
    INSERT INTO "DiariesDB"."rdt"
    (
      title,
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
      $2,
      $3::text,
      $4::text,
      $5::text,
      $6::text,
      $7::text,
      $8::numeric,
      $9
    )
    RETURNING id;
    `
    let queryParam = [rdt.Title, rdt.DateTime, rdt.Situation, rdt.AutoThoughts, rdt.Emotion, rdt.Response, rdt.Outcome, rdt.PersonID, rdt.LastUpdate];

    let error = '';

    let id = await ConnPool.query( query, queryParam )
    .then((res)=> res.rows[0].id )
    .catch((err)=> { console.log(`ERROR_ADDING_RDT: `, err, ' || RDT: ',rdt); error = err; return 0;})

    if (id>0){
      return Promise.resolve(id);
    }
    else{
      return Promise.reject(error);
    }
  },

  UpdateRDT : async (rdt:RDTModel):Promise<boolean[]|[boolean, any?]> => {
    let query = `
      UPDATE
        "DiariesDB"."rdt"
      SET
        title         = $1::text,
        datetime      = $2,
        situation     = $3::text,
        auto_thoughts = $4::text,
        emotion       = $5::text,
        response      = $6::text,
        outcome       = $7::text,
        last_update   = $8
      WHERE
        id = $9::numeric
    `;
    
    let queryParam = [rdt.Title,rdt.DateTime,rdt.Situation,rdt.AutoThoughts, rdt.Emotion,rdt.Response,rdt.Outcome,rdt.LastUpdate,rdt.ID];

    return ConnPool.query( query, queryParam )
    .then(() => [true])
    .catch(err => { console.log(`ERROR_UPDATING_RDT: `, err, ' || RDT: ',rdt); return [false,err]});
  },

  DeleteRDT : async (rdt:RDTModel):Promise<boolean[]|[boolean, any?]> => {
    
    let query = 'DELETE from "DiariesDB"."rdt" WHERE id = $1::numeric';
    
    return ConnPool.query( query, [rdt.ID] )
    .then(() => [true])
    .catch(err => { console.log(`ERROR_DELETING_RDT: `, err, ' || RDT: ',rdt); return [false,err]});
  }
}