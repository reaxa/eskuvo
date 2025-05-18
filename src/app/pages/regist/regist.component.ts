import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-regist',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.css']
})
export class RegistComponent {
  constructor(private authService: AuthService, private router: Router) {}

  showPassword1 = false;
  showPassword2 = false;

  togglePasswordVisibility(field: 'first' | 'second') {
    if (field === 'first') {
      this.showPassword1 = !this.showPassword1;
    } else {
      this.showPassword2 = !this.showPassword2;
    }
  }


 async onRegister(form: NgForm) {
  const { name, email, password1, password2 } = form.value;

  if (password1 !== password2) {
    alert('A jelszavak nem egyeznek!');
    return;
  }

  const success = await this.authService.register(email, password1, name);
  if (success) {
    await this.authService.login(email, password1); 
    this.router.navigate(['/profile']);
  } else {
    alert('Ez az email már regisztrálva van.');
  }
}
}
