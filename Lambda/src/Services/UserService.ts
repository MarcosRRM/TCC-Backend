import {GetPropInsensitive, Return}  from '../Utils/HTTPUtils';
import PersonDAO from '../DAO/PersonDAO';
import UserDAO   from '../DAO/UserDAO';
import { ValidateUser, ValidateRawPW, UserModel, GenerateRandomPassword }   from '../Models/UserModel';
import { ValidatePerson } from '../Models/PersonModel';
import { HTTPReturnModel } from '../Models/HTTPReturnModel';

const AWS = require('aws-sdk');
const SHA512 = require( 'js-sha512' );
const JWT    = require( 'jsonwebtoken' );

export default {
	
	GetUserArray: async function(event: any, context:any){
		
		return UserDAO.GetAllUser()
		.then((res)=> Return.Ok(res))
		.catch((err)=>Return.Error(err));
		
	},

	GetUser: async function(event:any, context:any){

		return UserDAO.GetUserByModel({ID: event.pathParameters.id})
		.then((res)=> Return.Ok(res) )
		.catch((err)=>{
			if (err.code && err.code==='22P02'){ return Return.BadReq('Invalid Resource') }
			else{ return Return.Error(err)}
		});
	},

	LogIn : async function(event:any, context:any){
		
		try{
			let parsedBody = event.body;

			if ( parsedBody && parsedBody.email && parsedBody.pw ){

				return UserDAO.GetUserByModel({Email:parsedBody.email.toLowerCase()},true)
				.then(async (user:any)=>{
					
					if (user.PasswordHash === SHA512(parsedBody.pw)){

						let person = await PersonDAO.GetPersonByModel({UserID: user.ID})

						let jwtPayload = {
							userId   : user.ID,
							personId : person.ID,
							email    : user.Email,
							name     : person.FullName
						}

						return Return.Ok({
							Token: JWT.sign(jwtPayload, process.env.JWT_KEY),
							PasswordReseted : user.PasswordReseted
						});

					}
					else{
						throw 'Negado';
					}
				})
				.catch((e)=>{
					return Return.Unauth('Negado');
				})

			}
			else{
				throw Return.BadReq('Request inválido');
			}
		}
		catch(e){
			if (e instanceof HTTPReturnModel) return Promise.resolve(e);
			else return Promise.resolve(Return.Error(e));
		}
	},

	NewUser : async function(event:any, context:any){

		if (!ValidateRawPW(event.body.pw)[0]){
			return Promise.resolve(Return.Error('Senha inválida.'));
		}

		let newUser = {
			Email: event.body.email.toLowerCase(),
			Level: 1,
			PasswordHash: SHA512(event.body.pw)
		}

		let newPerson = {
			FullName: event.body.fullName,
			BirthDay: new Date(event.body.birthDay),
			UserID: 0
		}

		let [validUser,userError] = ValidateUser(newUser, false);
		if (!validUser) return Promise.resolve(Return.Error(userError));
		
		let [validPerson, personError] = ValidatePerson(newPerson, false, false);
		if (!validPerson) return Promise.resolve(Return.Error(personError));

		let userTest = <UserModel>await UserDAO.GetUserByModel({Email:newUser.Email})
		
		let emailInUse = userTest !== null;

		if(!emailInUse){
			return UserDAO.AddUser(newUser)
			.then( (userID)=>{
				newPerson.UserID = userID;

				return PersonDAO.AddPerson(newPerson)
				.then( () => Return.Ok(userID) )
				.catch( (err) => Return.Error(err))
			})
			.catch((err)=> Return.Error(err));
		}
		else{
			return Promise.resolve(Return.Error('O email já está em uso!'))
		}

	},

	ChangePW : async function(event:any, context:any){

		if (!event.body){
			return Promise.resolve(Return.BadReq('Request Inválido'));
		}
		if  (!event.body.currentPW || !event.body.currentPW ){
			return Promise.resolve(Return.BadReq('Request Inválido'));
		}

		try{
			let userInfo = JWT.decode(GetPropInsensitive('authorization',event.headers).split(' ')[1]);
			let currentInfo = <UserModel>await UserDAO.GetUserByModel({ID:userInfo.userId},true);
			
			let hashedOldPW = SHA512(event.body.currentPW);
			if (currentInfo.PasswordHash !== hashedOldPW){
				return Promise.resolve(Return.BadReq('Senha atual inválida.'));
			}
			let [validNewPW,PWError] = ValidateRawPW(event.body.newPW);
			if (!validNewPW){
				return Promise.resolve(Return.BadReq('Nova senha inválida: '+PWError));
			}

			let hashedNewPW = SHA512(event.body.newPW);

			currentInfo.PasswordHash = hashedNewPW;
			currentInfo.PasswordReseted = false;

			return UserDAO.UpdateUser(currentInfo)
			.then(()=>Promise.resolve(Return.Ok()))
			.catch((e)=>Promise.resolve(Return.Error(e[1])))

		}
		catch(e){
			return Promise.resolve(Return.Error(e));
		}

	},

	ResetPW : async function(event:any, context:any){
		
		if (typeof event.body.email != 'string'){
			return Promise.resolve(Return.BadReq('Email inválido'));
		}

		let userInfo = await <UserModel>UserDAO.GetUserByModel({Email:event.body.email.toLowerCase()},true)
		
		if (userInfo != null){
			let newPW = GenerateRandomPassword();
			userInfo.PasswordHash = SHA512(newPW);
			userInfo.PasswordReseted = true;
			await new AWS.SES({apiVersion: '2010-12-01'})
			.sendEmail({
				Destination: {
					ToAddresses: [
						'contato.mroberto@gmail.com'
					],
				},
				Message: {
					Body: {
						Text: {
							Charset: "UTF-8",
							Data: `Sua nova senha é ${newPW}
Ao entrar no sistema com esta senha, será necessário a troca por uma nova.

Não responda este email.`
						}
					},
					Subject: {
						Charset: 'UTF-8',
						Data: 'Esqueci minha senha - RPD'
					},
				},
				Source: 'i.maroky@gmail.com'
			})
			.promise();

			return UserDAO.UpdateUser(userInfo)
			.then(()=>Return.Ok())
			.catch((err)=>Return.Error(err));
		}
		else {
			return Promise.resolve(Return.Ok());
		}

	},

	TestToken : async function(event:any, context:any){
		return Promise.resolve(Return.Ok(true));
	}
};