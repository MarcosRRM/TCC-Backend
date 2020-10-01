import {GetPropInsensitive, Return} from '../Utils/HTTPUtils';
import RDTDAO from '../DAO/RDTDAO';
import { ValidateRDT, RDTModel } from '../Models/RDTModel';

const JWT = require( 'jsonwebtoken' );

export default {
	
	GetRDTArray: async function(event: any, context:any){
		
		return RDTDAO.GetAllRDT()
		.then((res)=> Return.Ok(res))
		.catch((err)=>Return.Error(err));

	},

	GetRDT: async function(event: any, context:any){

		return RDTDAO.GetRDTByModel({ID:event.pathParameters.id})
		.then( (res)=> Return.Ok(res) )
		.catch((err)=>{
			if (err.code && err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});

	},

	GetRDTArrayByAuthor: async function(event: any, context:any){

		try{
			let userInfo = JWT.decode(GetPropInsensitive('authorization',event.headers).split(' ')[1]);
			return RDTDAO.GetRDTByModel({PersonID: userInfo.personId},false)
			.then((data)=>Return.Ok(data))
			.catch((err)=>Return.Error(err));
		}
		catch(e){
			return Promise.resolve(Return.Error(e));
		}

	},

	SyncUserRDT: async function(event: any, context:any){

		//#region Request Validation
		if (!event.body || !Array.isArray(event.body)){
			return Promise.resolve(Return.BadReq('Invalid Body'));
		}

		let validArray = true,
		    arrayError:any = '',
				index;
			
		let userInfo = JWT.decode(GetPropInsensitive('authorization',event.headers).split(' ')[1]);
		
		for(index = 0; index < event.body.length ; index ++){
			event.body[index].DateTime   = new Date(event.body[index].DateTime);
			event.body[index].LastUpdate = new Date(event.body[index].LastUpdate);
			[validArray, arrayError] = ValidateRDT(event.body[index],false,false);
			if (!validArray) { break; }
			event.body[index].PersonID = userInfo.personId;
		}
		if (!validArray) {
			return Promise.resolve(Return.BadReq(`Invalid RDT at position ${index}: ${arrayError}.`));
		}

		let reqArray = event.body as RDTModel[];
		//#endregion

		//#region Set Up
		let toUpdate:RDTModel[] = [],
				toSave  :RDTModel[] = [],
				toDelete:RDTModel[] = [];
		
		let getCurrentError = null;

		let UserRDT:RDTModel[] = await RDTDAO.GetRDTByModel({PersonID:userInfo.personId},false)
		.catch((err)=>getCurrentError=err);
		console.log('USERRDT:',UserRDT);
		if (getCurrentError) return Promise.resolve(Return.Error(getCurrentError));

		//#endregion

		//#region Comparison
		UserRDT.forEach( rdt => {
			
			let reqRdt = reqArray.find( _reqRdt => _reqRdt.ID === rdt.ID );
			
			//If not found on request, mark for DELETE
			if (!reqRdt){
				toDelete.push(rdt);
				return;
			}
			else{

				//If updated on client, UPDATE
				if (rdt.LastUpdate !== reqRdt.LastUpdate){
					let a = rdt.LastUpdate || new Date();
					let b = reqRdt.LastUpdate || a;
					if (a < b){
						toUpdate.push(reqRdt);
					}
				}
			}
		
		});
		toSave = reqArray.filter(_rdt=>!_rdt.ID);
		//#endregion

		//#region Execution

		let exeAdd:Promise<any>[] = [],
				exeUpd:Promise<any>[] = [],
				exeDel:Promise<any>[] = [],
				errors:any[] = [];

		//Addition
		toSave.forEach( _rdt => {
			exeAdd.push(RDTDAO.AddRDT(_rdt));
		})
		let addAll = Promise.all(exeAdd)
		.then(results=>{
			results.forEach((result,index)=>{
				if (typeof result !== 'number'){
					errors.push(result);
				}
				else{
					toSave[index].ID = result;
				}
			})
		});

		toUpdate.forEach( _rdt => {
			exeUpd.push(RDTDAO.UpdateRDT(_rdt));
		})

		let updAll = Promise.all(exeUpd)
		.then(results=>{
			results.forEach(result=>{
				if (result[0]===false){
					errors.push(result[1]);
				}
			});
		});

		toDelete.forEach( _rdt => {
			exeDel.push(RDTDAO.DeleteRDT(_rdt));
		})
		let delAll = Promise.all(exeDel)
		.then(results=>{
			results.forEach(result=>{
				if (!result[0]){
					errors.push(result[1]);
				}
			})
		});

		await Promise.all([addAll,updAll,delAll]);

		if ( errors.length > 0 ) {
			return Promise.resolve(Return.Error(errors));
		}
		else{
			return Promise.resolve(Return.Ok({Added:toSave}));
		}

		//#endregion
	},

};