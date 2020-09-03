import {Return} from '../Utils/HTTPUtils';
import {ValidatePerson} from '../Models/PersonModel';
import PersonDAO from '../DAO/PersonDAO';


export default {
	
	GetPersonArray: async function(event:any, context:any){
		return PersonDAO.GetAllPeople()
			.then ( (res)=> Return.Ok(res) )
			.catch( (err)=> Return.Error(err) );
	},

	GetPerson: function(event:any, context:any){

		return PersonDAO.GetPersonByModel({ID:event.pathParameters.id})
		.then( (res)=> Return.Ok(res) )
		.catch((err)=>{
			if (err.code && err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});

	},

	SavePerson: function(event:any, context:any){ 
		
		let [valid, error] = ValidatePerson(event.body,false);

		if (!valid){
			return Return.Error(error);
		}

		return PersonDAO.AddPerson(event.body)
		.then( (res)=> Return.Ok(res) )
		.catch( (err)=> Return.Error(err) );

	},

	UpdatePerson: function(event:any, context:any){

		let [valid, error] = ValidatePerson(event.body);

		if (!valid) {
			return Return.Error(error);
		}

		return Return.Ok('TO DO');

		let existing = PersonDAO.GetPersonByModel({ID: event.body.ID})
		.then()
		.catch()

	}

};