import {Return} from '../Utils/HTTPUtils';
import {RDTFromRow, RDTArrayFromRows} from '../Models/RDT';
import {Pool} from "pg";




const ConnPool = new Pool({
	max: 5,
	connectionTimeoutMillis: 5000
})

export default {
	

	RDTListAll: async function(event: any, context:any){
		
		return ConnPool.query('SELECT * FROM "DiariesDB".rdt')
		.then((res)=>{
			if (res.rowCount>0){ return Return.Ok(RDTArrayFromRows(res.rows)); }
			else{ return Return.NoContent(); }
		})
		.catch((err)=>Return.Error(err));

	},

	RDTListByAuthor: function(event: any, context:any){

		return ConnPool.query('SELECT * FROM "DiariesDB".rdt WHERE person_id = $1::numeric', [event.pathParameters.id])
		.then((res)=>{
			if (res.rowCount>0){ return Return.Ok(RDTArrayFromRows(res.rows)); }
			else{ return Return.NoContent(); }
		})
		.catch((err)=>{
			if (err.code==='22P02'){ return Return.BadReq("Invalid Author") }
			else{ return Return.Error(err)}
		});
	}

};