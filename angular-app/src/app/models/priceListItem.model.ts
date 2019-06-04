export class PriceListItem{
    id: number;   
    priceList_Id: number;
    item_Id : number;  
    price : number;  

    constructor(id:number, priceList_Id:number,item_Id:number,price:number)
    {
        this.id = id;
        this.priceList_Id= priceList_Id;
        this.item_Id = item_Id;
        this.price = price;
    }
}