export interface loginResponse{
    message: string;
    userId: string;
}

export interface RegisterResponse{
    message: string;
}

export interface User{
    nombre: string;
    email: string;
    password: string
}

export interface CheckEmailResponse {
    exists: boolean;
}