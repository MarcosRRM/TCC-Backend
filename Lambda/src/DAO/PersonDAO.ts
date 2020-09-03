import {PersonModel, PersonFromRow, PersonArrayFromRows} from '../Models/PersonModel';
import ConnPool from "../Utils/DBModule";
import QueryConstructor from '../Utils/QueryConstructor';

export default {
  
  GetAllPeople : async ():Promise<PersonModel[]> => {
    return ConnPool.query('SELECT * FROM "DiariesDB".person')
    .then((res)=> PersonArrayFromRows(res.rows))
  },

  GetPersonByModel : async ( model:PersonModel ):Promise<PersonModel> => {

    let query = new QueryConstructor('SELECT * FROM "DiariesDB"."person" WHERE');

    if (model.ID){
      query.AddParam('id = $X::numeric', model.ID);
    }

    if (model.FullName){
      query.AddParam('full_name = $X::text', model.FullName)
    }

    if (model.UserID){
      query.AddParam('user_id = $X::numeric', model.UserID)
    }

    return ConnPool.query( query.Query, query.Params )
      .then( (res) => {
        if (res.rowCount>0){ return PersonFromRow(res.rows[0]); }
			  else{ throw 'No Such Person'; }
      });
  },

  /**
   * Inserts a Person and returns it's ID
   */
  AddPerson : async (person:PersonModel):Promise<number|any> => {
    
    let query = `
      INSERT INTO "DiariesDB"."person" ( full_name, user_id )
      VALUES ($1::text, $2::numeric)
      RETURNING id;
    `

    let queryParam = [person.FullName, person.UserID];
    
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

  },

  UpdatePerson : async (person:PersonModel):Promise<boolean[]|[boolean, any?]> => {
    let query = `
      UPDATE
        "DiariesDB"."person"
      SET
        full_name = $1::text,
        user_id = $2::numeric
      WHERE
        id = $3::numeric
    `;
    
    let queryParam = [person.FullName, person.UserID, person.ID];

    return ConnPool.query( query, queryParam )
    .then(() => [true])
    .catch(err => [false,err]);
  }

}