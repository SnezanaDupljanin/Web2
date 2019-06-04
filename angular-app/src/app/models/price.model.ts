export class Price{
    item: string;   //vremenska, dnevna...
    type: string;    //penzioner, student
    
    constructor(i:string, t:string)
    {
        this.item = i;
        this.type= t;
    }
}