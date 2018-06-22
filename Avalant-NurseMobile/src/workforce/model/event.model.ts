export class EventModel{
    public type:string;
    public topic:string;
    public place = {
        coords:{
            lat:null,
            lng:null,
        },
        name:null
    };
    public room:string; //only type meeting
    public startDateTime:string;
    public endDateTime:string;
    public invite:string;
    public colorAlert:string;
}