export class CheckInOutModel {
    public checkInTime: string;
    public checkOutTime: string;
    public date: string;
    public position = {
        lat: null,
        long: null
    };
    public status: string;
}
export class HistoryModel {
    public empCode: string;
    public recordType: string;
    public recorderNo: string;
    public recorderOut: string;
    public recorderOutNo: string;
    public recorderDate: string;
    public recorderIn: string;
    public status: string;
}
