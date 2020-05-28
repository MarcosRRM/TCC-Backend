import {Return} from '../Utils/HTTPUtils';
import {RDTFromRow, RDTArrayFromRows} from '../Models/RDT';
import ConnPool from "../Utils/DBModule";

export default {
	
	GetRDTArray: async function(event: any, context:any){
		
		return ConnPool.query('SELECT * FROM "DiariesDB".rdt')
		.then((res)=> Return.Ok(RDTArrayFromRows(res.rows)))
		.catch((err)=>Return.Error(err));

	},

	GetRDT: function(event: any, context:any){

		return ConnPool.query('SELECT * FROM "DiariesDB".rdt WHERE id = $1::numeric', [event.pathParameters.id])
		.then((res)=>{
			if (res.rowCount>0){ return Return.Ok(RDTFromRow(res.rows[0])); }
			else{ return Return.NotFound('No Such RDT'); }
		})
		.catch((err)=>{
			if (err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});
	},

	GetRDTArrayByAuthor: function(event: any, context:any){

		return ConnPool.query('SELECT * FROM "DiariesDB".rdt WHERE person_id = $1::numeric', [event.pathParameters.id])
		.then((res)=> Return.Ok(RDTArrayFromRows(res.rows)))
		.catch((err)=>{
			if (err.code==='22P02'){ return Return.BadReq("Invalid Author") }
			else{ return Return.Error(err)}
		});
	},

	PutRDT: function(event: any, context:any){

		return Return.Ok('To Do')

	}

};