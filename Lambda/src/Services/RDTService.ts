import {Return} from '../Utils/HTTPUtils';
import RDTDAO from '../DAO/RDTDAO';
import { ValidateRDT, RDTModel } from '../Models/RDTModel';

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

		return RDTDAO.GetAllRDT()
		.then((res)=> Return.Ok(res.filter((rdt=>rdt.PersonID===event.pathParameters.id))))
		.catch((err)=>Return.Error(err));
	},

	SyncUserRDT: async function(event: any, context:any){

		//#region Request Validation
		if (!event.body || !Array.isArray(event.body)){
			return Promise.resolve(Return.BadReq('Invalid Body'));
		}

		let validArray = true,
		    arrayError:any = '',
		 		index;
		for(index = 0; index < event.body.length ; index ++){
			[validArray, arrayError] = ValidateRDT(event.body[index],false,false);
			if (!validArray) { break; }
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

		let UserRDT:RDTModel[] = await RDTDAO.GetAllRDT()
		.then((res)=> res.filter((rdt=>rdt.PersonID===event.pathParameters.id)))
		.catch((err)=>getCurrentError=err);

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
		await Promise.all(exeAdd)
		.then(results=>{
			results.forEach(result=>{
				if (typeof result !== 'number'){
					errors.push(result);
				}
			})
		});

		toUpdate.forEach( _rdt => {
			exeUpd.push(RDTDAO.UpdateRDT(_rdt));
		})
		await Promise.all(exeUpd)
		.then(results=>{
			results.forEach(result=>{
				if (result[0]===false){
					errors.push(result[1]);
				}
			})
		});

		toDelete.forEach( _rdt => {
			exeDel.push(RDTDAO.DeleteRDT(_rdt));
		})
		await Promise.all(exeDel)
		.then(results=>{
			results.forEach(result=>{
				if (typeof result !== 'number'){
					errors.push(result);
				}
			})
		});

		if ( errors.length > 0 ) {
			return Promise.resolve(Return.Error(errors));
		}
		else{
			 return Promise.resolve(Return.Ok('Synced'));
		}

		//#endregion

		
	}

};