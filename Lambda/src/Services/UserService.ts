import {Return} from '../Utils/HTTPUtils';
import {UserFromRow, UserArrayFromRows} from '../Models/User';
import ConnPool from "../Utils/DBModule";

export default {
	
	GetUserArray: async function(event: any, context:any){
		
		return ConnPool.query('SELECT * FROM "DiariesDB"."user"')
		.then((res)=> Return.Ok(UserArrayFromRows(res.rows)))
		.catch((err)=>Return.Error(err));
	},

	GetUser: function(event: any, context:any){

		return ConnPool.query('SELECT * FROM "DiariesDB"."user" WHERE id = $1::numeric', [event.pathParameters.id])
		.then((res)=>{
			if (res.rowCount>0){ return Return.Ok(UserFromRow(res.rows[0])); }
			else{ return Return.NotFound('No Such User'); }
		})
		.catch((err)=>{
			if (err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});
	},

	PutUser: function(event: any, context:any){
		return Return.Ok('To Do')
	}

};