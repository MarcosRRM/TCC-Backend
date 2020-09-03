import {HTTPReturnModel} from '../Models/HTTPReturnModel';

const Return = {
  
  //2XX - Success
  Ok: function(Body:any="",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,200,Body,Headers)
  },
  Created: function(Body:any="Entity(ies) Created",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,201,Body,Headers)
  },
  NoContent: function(Body:any="",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,204,Body,Headers)
  },

  //4XX - Client Errors
  BadReq: function(Body:any="Invalid Request",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,400,Body,Headers)
  },
  NotFound: function(Body:any="",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,404,Body,Headers)
  },
  Unauth: function(Body:any="Unauthorized",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,401,Body,Headers)
  },


  //5XX Server Errors
  Error: function(Body:any="Internal Server Error",Headers:{[header: string]: boolean | number | string;}={},IsBase64Encoded=false){
    return new HTTPReturnModel(IsBase64Encoded,500,Body,Headers)
  }
  
}

export {Return}