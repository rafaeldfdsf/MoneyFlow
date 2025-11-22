import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { DTO_Login } from '@/shared/dtos/DTO_Login';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.component.html'
})
export class Login {
    email = '';
    password = '';
    checked = false;
    loading = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onLogin() {
        this.loading = true;
        this.errorMessage = '';

        const dto: DTO_Login = {
            email: this.email,
            password: this.password
        };

        this.authService.login(dto).subscribe({
            next: (res) => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = 'Email ou senha inválidos.';
            }
        });
    }
}
