import {Return} from '../Utils/HTTPUtils';
import PersonDAO from '../DAO/PersonDAO';
import UserDAO from '../DAO/UserDAO';
import { ValidateUser } from '../Models/UserModel';
import { ValidatePerson } from '../Models/PersonModel';
import { HTTPReturnModel } from '../Models/HTTPReturnModel';

const SHA512 = require('js-sha512');
const JWT    = require( 'jsonwebtoken' );

export default {
	
	GetUserArray: async function(event: any, context:any){
		
		return UserDAO.GetAllUser()
		.then((res)=> Return.Ok(res))
		.catch((err)=>Return.Error(err));
		
	},

	GetUser: async function(event: any, context:any){

		return UserDAO.GetUserByModel({ID: event.pathParameters.id})
		.then((res)=> Return.Ok(res) )
		.catch((err)=>{
			if (err.code && err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});
	},

	LogIn : async function(event: any, context:any){
		
		try{
			let parsedBody = event.body;

			if ( parsedBody && parsedBody.email && parsedBody.pw ){

				return UserDAO.GetUserByModel({Email:parsedBody.email})
				.then(async (user)=>{
					
					if (user.PasswordHash === SHA512(parsedBody.pw)){

						let person = await PersonDAO.GetPersonByModel({UserID: user.ID})

						let jwtPayload = {
							userId: user.ID, 
							personId: person.ID,
							email: user.Email,
							name: person.FullName
						}

						return Return.Ok( JWT.sign(jwtPayload, process.env.JWT_KEY) );

					}
					else{
						throw 'Denied';
					}
				})
				.catch((e)=>{
					return Return.Unauth('Denied');
				})

			}
			else{
				throw Return.BadReq('InvalidBody');
			}
		}
		catch(e){
			if (e instanceof HTTPReturnModel) return Promise.resolve(e);
			else return Promise.resolve(Return.Error(e));
		}
	},

	NewUser : async function(event: any, context:any){

		if ( typeof event.body.pw !== 'string' || event.body.pw.length < 8 ){
			return Promise.resolve(Return.Error('Invalid Password'));
		}

		let newUser = {
			Email: event.body.email,
			Level: 1,
			PasswordHash: SHA512(event.body.pw)
		}

		let newPerson = {
			FullName: event.body.fullName,
			UserID: 0
		}

		let [validUser,userError] = ValidateUser(newUser, false);
		if (!validUser) return Promise.resolve(Return.Error(userError));
		
		let [validPerson, personError] = ValidatePerson(newPerson, false, false);
		if (!validPerson) return Promise.resolve(Return.Error(personError));

		return UserDAO.AddUser(newUser)
		.then( (userID)=>{
			newPerson.UserID = userID;

			return PersonDAO.AddPerson(newPerson)
			.then( () => Return.Ok(userID) )
			.catch( (err) => Return.Error(err))
		})
		.catch((err)=> Return.Error(err));

	}

};