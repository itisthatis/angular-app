import { Injectable } from '@angular/core';
import { Observable, Subject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleSubject = new Subject<boolean>();
  private timeout = 30;
  private lastActivity:Date = new Date();
  private idleCheckInterval = 1; 
  private idleSubscription?: Subscription;
  private isCurrentlyIdle = false;

  constructor() { 
    this.startWatching();
  }

  get IdleState(): Observable<boolean> {
    return this.idleSubject.asObservable();
  }

  private startWatching(){
    this.idleSubscription = interval(this.idleCheckInterval * 1000).subscribe(() => {
      const now = new Date();
      const diff = now.getTime() - this.lastActivity.getTime();

      if (diff > this.timeout * 1000 && !this.isCurrentlyIdle) {
        this.isCurrentlyIdle = true;
        this.idleSubject.next(true); // enter idle
      } else if (diff <= this.timeout * 1000 && this.isCurrentlyIdle) {
        this.isCurrentlyIdle = false;
        this.idleSubject.next(false); // back to active
      }
    });
  }

  resetTimer() {
    this.lastActivity = new Date();

    if (this.isCurrentlyIdle) {
      this.isCurrentlyIdle = false;
      this.idleSubject.next(false);
    }
  }

  stopWatching() {
    this.idleSubscription?.unsubscribe();
  }

}
