import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdleService } from '../idle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-page',
  standalone: false,
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css'
})
export class TablePageComponent implements OnInit, OnDestroy{
  formData: FormGroup;
  data: any[] = [];
  isIdle = false;

  constructor(private fb: FormBuilder) {
    this.formData = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(20), Validators.max(60)]],
    });
  }

  idleService = inject(IdleService);
  private idleSubscription?: Subscription;
  private sessionInterval?: ReturnType<typeof setInterval>;
  private activeInterval?: ReturnType<typeof setInterval>;

  sessionSeconds = 0;
  activeSeconds = 0;

  ngOnInit(): void {
    this.sessionInterval = setInterval(() => {
      this.sessionSeconds++;
    }, 1000);

    this.activeInterval = setInterval(() => {
      if (!this.isIdle) {
        this.activeSeconds++;
      }
    }, 1000);

    this.idleSubscription = this.idleService.IdleState.subscribe((isIdle) => {
      this.isIdle = isIdle; 
      if (isIdle) {
        this.activeSeconds = 0; 
      }
    });
  }

  ngOnDestroy(): void {
    if(this.idleSubscription) {
      this.idleSubscription.unsubscribe();
      clearInterval(this.sessionInterval);
      clearInterval(this.activeInterval);
    }
  }

  onUserAction(){
    this.idleService.resetTimer();
  };

  formatTime(seconds: number): string {
    const hr = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const min = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${hr}:${min}:${sec}`;
  }

  deleteUser(item:number) {
    this.data.splice(item, 1);
  }

  onSubmit() {
    this.data.push(this.formData.value);
    this.formData.reset();
  }

}
