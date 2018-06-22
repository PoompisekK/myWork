import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
/**
 * Messenger Service
 * 
 * Bridge between DMP Application and Chativa
 * 
 * @author NorrapatN
 * @since Tue May 23 2017
 */
@Injectable()
export class MessengerService {

  // Variables
  public messageUnreadCount: number = 0;

  // Events
  private messageUnreadCountSource: Subject<any> = new Subject<any>();
  public messageUnreadCount$: Observable<any> = this.messageUnreadCountSource.asObservable();

  constructor(

  ) {
    
    // Example
    // setInterval((() => {
    //   this.pushMessageMock();
    // }).bind(this), 1500);
  }

  // Implements

  private pushMessageMock(): void {
    this.messageUnreadCount++;
    this.messageUnreadCountSource.next(this.messageUnreadCount);
  }

}
