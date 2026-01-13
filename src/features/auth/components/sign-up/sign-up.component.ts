import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/components/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  submitted = false;
  errorMessage = '';

  // password visibility
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Update confirmPassword validation when password changes
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // toggle password
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Password match validator
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const passwordControl = group.get('password');
    const confirmControl = group.get('confirmPassword');
    if (!passwordControl || !confirmControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmControl.value;

    if (!confirmControl.dirty && !confirmControl.touched && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getter for access to form fields
  get f() {
    return this.signupForm.controls;
  }

  // Check if field has error
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.signupForm.get(fieldName);
    if (!field) return false;
    return errorType
      ? !!(field.touched && field.errors?.[errorType])
      : !!(field.touched && field.invalid);
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['passwordMismatch']) return 'Passwords do not match';
    if (field.errors['requiredTrue']) return 'You must accept the terms and conditions';

    return '';
  }

  // Get field label
  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      terms: 'Terms and conditions'
    };
    return labels[fieldName] || fieldName;
  }

  // Submit form
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Mark all fields as touched to show validation errors
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });

    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    const formData = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    // Use AuthService to register user
    const result = this.authService.signup(formData);

    if (result.success) {
      alert(`Account created successfully! Welcome, ${formData.firstName}!`);
      // Navigate to reservation page after successful signup
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = result.message;
      alert(result.message);
    }
  }

  // social login methods will be later implemented.
  signUpWithGoogle(): void {
    console.log('Signing up with Google...');
    alert('Google sign-up will be implemented here');
  }

  signUpWithFacebook(): void {
    console.log('Signing up with Facebook...');
    alert('Facebook sign-up will be implemented here');
  }
}