import * as router from 'aws-lambda-router';
import RDTService from './Services/RDTService';
import PersonService from './Services/PersonService';
import UserService from './Services/UserService';

export const handler = router.handler({
  proxyIntegration:{
    routes: [

      //#region RDT Endpoints  
      {
        path: '/rdt',
        method: 'GET',
        action: RDTService.GetRDTArray
      },
      {
        path: '/rdt/{id}',
        method: 'GET',
        action: RDTService.GetRDT
      },
      {
        path: '/rdt/sync',
        method: 'POST',
        action: RDTService.SyncUserRDT
      },
      //#endregion

      //#region Person Endpoints
      {
        path: '/person',
        method: 'GET',
        action: PersonService.GetPersonArray
      },
      // {
      //   path: '/person/{id}',
      //   method: 'GET',
      //   action: PersonService.GetPerson
      // },
      {
        path: '/person/rdt',
        method: 'GET',
        action: RDTService.GetRDTArrayByAuthor
      },
      // {
      //   path: '/person/{id}',
      //   method: 'PUT',
      //   action: PersonService.PutPerson
      // },
      //#endregion
    
      //#region User Endpoints
      {
        path: '/login',
        method: 'POST',
        action: UserService.LogIn
      },
      {
        path: '/user',
        method: 'GET',
        action: UserService.GetUserArray
      },
      {
        path: '/user',
        method: 'POST',
        action: UserService.NewUser
      },
      {
        path: '/user/password',
        method: 'PUT',
        action: UserService.ChangePW
      },
      {
        path: '/user/password/reset',
        method: 'POST',
        action: UserService.ResetPW
      },
      {
        path: '/testtoken',
        method: 'GET',
        action: UserService.TestToken
      }
      //#endregion
    
    ]
  }
})