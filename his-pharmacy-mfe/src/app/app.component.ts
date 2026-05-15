import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'his-pharmacy-mfe';
  otherArguments: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Try snapshot first, then subscribe for dynamic changes
    this.otherArguments = this.route.snapshot.data?.['otherArguments'] || '';
    this.route.data.subscribe(data => {
      this.otherArguments = data?.['otherArguments'] || '';
    });
  }
}
