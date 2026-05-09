import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { DTO_Register } from '@/shared/dtos/DTO_Register';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './register.component.html'
})
export class Register {
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onRegister() {
        this.errorMessage = '';
        this.successMessage = '';

        if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
            this.errorMessage = 'Preencha todos os campos.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'As passwords nao coincidem.';
            return;
        }

        this.loading = true;

        const dto: DTO_Register = {
            name: this.name.trim(),
            email: this.email.trim(),
            password: this.password
        };

        this.authService.register(dto).subscribe({
            next: () => {
                this.loading = false;
                this.successMessage = 'Conta criada com sucesso. Vai ser redirecionado para o login.';
                setTimeout(() => this.router.navigate(['/auth/login']), 1200);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err?.error || 'Nao foi possivel criar a conta.';
            }
        });
    }
}
