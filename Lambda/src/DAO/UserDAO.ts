import ConnPool from "../Utils/DBModule";
import {UserModel, UserFromRow, UserArrayFromRows} from '../Models/UserModel';
import QueryConstructor from '../Utils/QueryConstructor';

export default {

  GetAllUser : async ():Promise<UserModel[]> => {
    return ConnPool.query('SELECT * FROM "DiariesDB"."user"')
		.then((res)=> UserArrayFromRows(res.rows))
  },

  GetUserByModel : async (model:UserModel):Promise<UserModel> => {

    let query = new QueryConstructor('SELECT * FROM "DiariesDB"."user" WHERE');

    if (model.ID){
      query.AddParam('id = $X::numeric', model.ID);
    }

    if (model.Email){
      query.AddParam('email = $X::text', model.Email);
    }

    if (model.PasswordHash){
      query.AddParam('password_hash = $X::text', model.PasswordHash);
    }

    return ConnPool.query(query.Query, query.Params)
    .then((res)=>{
			if (res.rowCount>0){ return UserFromRow(res.rows[0]); }
			else{ throw 'No Such User' }
		})
  },

  AddUser : async (user:UserModel):Promise<number|any> => {
    
    let query = `
      INSERT INTO "DiariesDB"."user" ( email, password_hash, level )
      VALUES ($1::text, $2::text, $3::numeric)
      RETURNING id;
    `

    let queryParam = [user.Email, user.PasswordHash, user.Level];
    
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