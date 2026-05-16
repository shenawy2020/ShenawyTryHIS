import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

const ALL_PATIENTS = [
  { id: 'P001', name: 'محمد أحمد علي', age: 42, gender: 'ذكر', phone: '01012345678', bloodType: 'A+' },
  { id: 'P002', name: 'سارة محمود حسن', age: 28, gender: 'أنثى', phone: '01122334455', bloodType: 'O-' },
  { id: 'P003', name: 'ياسين ابراهيم', age: 55, gender: 'ذكر', phone: '01223344556', bloodType: 'B+' },
  { id: 'P004', name: 'ليلى ناصر', age: 34, gender: 'أنثى', phone: '01556677889', bloodType: 'AB+' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  otherArguments: string = '';
  patients = ALL_PATIENTS;

  constructor(@Optional() private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route) {
      this.route.data.subscribe(data => {
        this.otherArguments = data?.['otherArguments'] || '';
      });
    }
  }

  openEMR(patient: any) {
    window.parent.postMessage({ 
      type: 'OPEN_EMR', 
      patientId: patient.id, 
      patientName: patient.name 
    }, '*');
  }
}
