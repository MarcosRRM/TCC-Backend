import {Return} from '../Utils/HTTPUtils';
import {PersonFromRow, PersonArrayFromRows} from '../Models/Person';
import ConnPool from "../Utils/DBModule";

export default {
	
	GetPersonArray: async function(event: any, context:any){
		
		return ConnPool.query('SELECT * FROM "DiariesDB".person')
		.then((res)=> Return.Ok(PersonArrayFromRows(res.rows)))
		.catch((err)=>Return.Error(err));
	},

	GetPerson: function(event: any, context:any){

		return ConnPool.query('SELECT * FROM "DiariesDB"."person" WHERE id = $1::numeric', [event.pathParameters.id])
		.then((res)=>{
			if (res.rowCount>0){ return Return.Ok(PersonFromRow(res.rows[0])); }
			else{ return Return.NotFound('No Such Person'); }
		})
		.catch((err)=>{
			if (err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});
	},

	PutPerson: function(event: any, context:any){
		return Return.Ok('To Do')
	}

};