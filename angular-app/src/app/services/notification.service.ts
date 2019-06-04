import { Injectable, EventEmitter } from '@angular/core';

declare var $: any;

@Injectable()

export class NotificationService{
    private proxy: any;
    private proxyName: string = "notifications";
    private connection: any;

    public notificationsForServices: EventEmitter<string>;
    public notificationsForUsers: EventEmitter<string>;
    public connectionEstablished: EventEmitter<Boolean>;
    public connectionExist: Boolean;

    constructor(){
    }

    public startFunction(){
        this.connectionEstablished = new EventEmitter<Boolean>();
        this.connectionExist = false;
        this.notificationsForUsers = new EventEmitter<string>();
        this.notificationsForServices = new EventEmitter<string>();

        if(localStorage.jwt){
            this.startConnection();
        }
    }

    public startConnection(): void{
        this.connection = $.hubConnection("https://localhost:52295/");
        this.connection.qs = {"token" : "Bearer " + localStorage.getItem('jwt')};
        this.proxy = this.connection.createHubProxy(this.proxyName);

        this.registerOnServerNotificationsAboutUser();
        this.registerOnServerNotificationsAboutSerice();
        this.connection.start().done((data: any) =>{
            console.log('Now connected ' + data.transport.name + ', connection ID=' + data.id);
            this.connectionEstablished.emit(true);
            this.connectionExist = true;
        }).fail((error: any) => {
            console.log('Could not connect ' + error);
            this.connectionEstablished.emit(false);
        });
    }

    private registerOnServerNotificationsAboutUser(): void{
        this.proxy.on('notifyAboutUser', (data: string) => {
            this.notificationsForUsers.emit(data);
        })
    }

    private registerOnServerNotificationsAboutSerice(): void{
        this.proxy.on('notifyAboutService', (data: string) => {
            this.notificationsForServices.emit(data);
        })
    }

}



