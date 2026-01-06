import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Toggle password visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Getter for form controls
  get f() {
    return this.loginForm.controls;
  }

  // Check if field has error
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    if (!field) return false;
    return !!(field.touched && field.invalid);
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (field.errors['minlength']) return `Password must be at least 6 characters`;
    if (field.errors['email']) return 'Please enter a valid email address';

    return '';
  }

  // Get field label
  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  // Submit form
  onSubmit(): void {
    this.submitted = true;

    // Mark all fields as touched to show validation errors
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Login attempt:', loginData);

    // TODO: Replace this with actual authentication service
    // For now, simulate successful login
    if (loginData.email && loginData.password) {
      alert('Login successful!');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials');
    }
  }

  // Social login methods (to be implemented later)
  loginWithGoogle(): void {
    console.log('Logging in with Google...');
    // TODO: Implement Google OAuth
    alert('Google login will be implemented here');
  }

  loginWithFacebook(): void {
    console.log('Logging in with Facebook...');
    // TODO: Implement Facebook OAuth
    alert('Facebook login will be implemented here');
  }
}