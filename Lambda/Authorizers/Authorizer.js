
const JWT = require('jsonwebtoken');

const generatePolicy = (valid=true){
  return {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": valid?"Allow":"Deny",
        "Resource": "arn:aws:lambda:sa-east-1:359827409454:function:RDTMainFunction:*"
      }
    ]
  }
}

const GetPropInsensitive = (propName,obj) => {
  let found = Object.keys(obj).find(key => key.toLowerCase() === propName.toLowerCase());
  if (found != undefined){
    return obj[found];
  }
  else {
    return undefined
  }
}

exports.handler = (event,context){

  try{
    let header = GetPropInsensitive('authorization', event.headers);
    if(header!=undefined){
      JWT.verify(header,process.env.JWT_KEY);
      return generatePolicy();
    }
    return  generatePolicy(false);
  }
  catch{
    return generatePolicy(false);
  }


}