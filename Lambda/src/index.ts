import * as router from 'aws-lambda-router';
import RDTService from './Services/RDTService';

export const handler = router.handler({
  proxyIntegration:{
    routes: [
      {
        path: '/rdt',
        method: 'GET',
        action: RDTService.RDTListAll
      },
      {
        path: '/rdt/user/{id}',
        method: 'GET',
        action: RDTService.RDTListByAuthor
      }
    ]
  }
})