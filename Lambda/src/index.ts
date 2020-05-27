import * as router from 'aws-lambda-router';
import RDTService from './Services/RDTService';

export const handler = router.handler({
  proxyIntegration:{
    routes: [
      //#region RDT Endpoints  
      {
        path: '/rdt',
        method: 'GET',
        action: RDTService.GetRDTList
      },
      {
        path: '/rdt/{id}',
        method: 'GET',
        action: RDTService.GetRDT
      },
      {
        path: '/rdt/user/{id}',
        method: 'GET',
        action: RDTService.GetRDTListByAuthor
      },
      {
        path: '/rdt/{id}',
        method: 'POST',
        action: RDTService.PostRDT
      },
      {
        path: '/rdt/{id}',
        method: 'PUT',
        action: RDTService.PutRDT
      }
      //#endregion
    ]
  }
})