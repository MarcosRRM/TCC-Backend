import {APIGatewayProxyResult} from 'aws-lambda/trigger/api-gateway-proxy';

export class HTTPReturn implements APIGatewayProxyResult{
  isBase64Encoded:boolean;
  statusCode:number;
  body:string;
  headers:{[header: string]: boolean | number | string;};
  multiValueHeaders?: { [header: string]: Array<boolean | number | string>;};

	constructor(IsBase64Encoded: boolean, StatusCode: number, Body: any, Headers: {[header: string]: boolean | number | string;}, MultiValueHeaders: { [header: string]: Array<boolean | number | string>;}={}) {

    let parsedBody = Body;

    if (typeof parsedBody !== "string") parsedBody = JSON.stringify(Body)

		this.isBase64Encoded = IsBase64Encoded;
		this.statusCode = StatusCode;
		this.body = parsedBody;
		this.headers = Headers;
    this.multiValueHeaders = MultiValueHeaders;
  }
  
  public toString():string {
    return JSON.stringify(this);
  }
  
}