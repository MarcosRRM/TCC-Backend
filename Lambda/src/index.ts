import * as router from 'aws-lambda-router';
//import RDTService from './Services/RDTService';
import PersonService from './Services/PersonService';
import UserService from './Services/UserService';

export const handler = router.handler({
  proxyIntegration:{
    routes: [
      // //#region RDT Endpoints  
      // {
      //   path: '/rdt',
      //   method: 'GET',
      //   action: RDTService.GetRDTArray
      // },
      // {
      //   path: '/rdt/{id}',
      //   method: 'GET',
      //   action: RDTService.GetRDT
      // },
      // {
      //   path: '/rdt/person/{id}',
      //   method: 'GET',
      //   action: RDTService.GetRDTArrayByAuthor
      // },
      // {
      //   path: '/rdt/{id}',
      //   method: 'PUT',
      //   action: RDTService.PutRDT
      // },
      // //#endregion

      //#region Person Endpoints
      {
        path: '/person',
        method: 'GET',
        action: PersonService.GetPersonArray
      },
      {
        path: '/person/{id}',
        method: 'GET',
        action: PersonService.GetPerson
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
        path: '/user/{id}',
        method: 'GET',
        action: UserService.GetUser
      },
      {
        path: '/user',
        method: 'POST',
        action: UserService.NewUser
      }
      //#endregion
    ]
  }
})