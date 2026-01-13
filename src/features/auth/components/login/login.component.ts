import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/components/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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
    this.errorMessage = '';

    // Mark all fields as touched to show validation errors
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    const { email, password } = this.loginForm.value;

    // Use AuthService to verify credentials
    const result = this.authService.login(email, password);

    if (result.success) {
      alert(`Welcome back, ${result.user?.firstName}!`);
      // Navigate to reservation page after successful login
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = result.message;
      alert(result.message);
    }
  }

  // Social login methods (to be implemented later)
  loginWithGoogle(): void {
    console.log('Logging in with Google...');
    alert('Google login will be implemented here');
  }

  loginWithFacebook(): void {
    console.log('Logging in with Facebook...');
    alert('Facebook login will be implemented here');
  }
}