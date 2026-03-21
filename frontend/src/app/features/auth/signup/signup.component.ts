import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  isVerifying = false;
  emailForVerification = '';
  verificationType: 'email' | 'mobile' = 'email';
  otpValue = '';

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { firstName, lastName, ...rest } = this.signupForm.value;
      const payload = {
          full_name: `${firstName} ${lastName}`,
          ...rest
      };

      this.authService.signup(payload).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.isVerifying = true;
          this.emailForVerification = user.email;
          this.verificationType = 'email'; // Start with email verification
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = err.error?.detail || 'Signup failed';
          console.error(err);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  onVerify() {
    if (!this.otpValue || this.otpValue.length < 6) return;
    
    this.isLoading = true;
    this.authService.verifyOtp(this.emailForVerification, this.otpValue, this.verificationType).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.otpValue = '';
        if (this.verificationType === 'email') {
          this.verificationType = 'mobile';
          // In a real app, maybe show a "Email Verified" toast
        } else {
          // Mobile verified, all done
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = err.error?.detail || 'Verification failed';
      }
    });
  }

  onResend() {
    this.authService.resendOtp(this.emailForVerification, this.verificationType).subscribe({
      next: () => {
        // Show success message
      },
      error: (err: any) => {
        this.error = 'Failed to resend OTP';
      }
    });
  }
}
