export class Ticket{

    TicketType: string;
    DateOfPurchase : Date;
    User_Id:string;
    Valid:boolean;

    constructor(){
        this.TicketType = "";
        this.Valid = false;
        this.User_Id = "";
       
    }
}