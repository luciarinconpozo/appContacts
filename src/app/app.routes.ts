import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { loginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
    {
        path: "", redirectTo: "/login", pathMatch: 'full'
    },
    {
        path: "login", component: LoginComponent
    },
    {
        path: "register", component: RegisterComponent
    },
    {
        path: "contacts", loadChildren: () => import('./contacts/routes').then( mod => mod.routes), canMatch: [loginGuard]
    }
];
