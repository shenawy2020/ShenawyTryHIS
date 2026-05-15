import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'his-patient-mfe';
  otherArguments: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.otherArguments = this.route.snapshot.data?.['otherArguments'] || '';
    this.route.data.subscribe(data => {
      this.otherArguments = data?.['otherArguments'] || '';
    });
  }
}
