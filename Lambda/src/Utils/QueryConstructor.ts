export default class {

  Query:string = '';
  Params:any[] = [];

  constructor (initialQuery:string){
    this.Query = initialQuery;
  }


  /**
   * use "$X" where you need the function
   * to substitute the param name
   */
  AddParam = (condition:string, param:any) => {

    this.Query += ' ';

    if (this.Params.length > 0){
      this.Query += 'AND ';
    }

    this.Query += condition.replace('$X',`$${this.Params.length + 1}`);
    this.Params.push(param);
  }
}