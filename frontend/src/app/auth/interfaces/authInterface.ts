export interface AuthResponse {
    ok: boolean;
    _id?: string;
    username?: string
    email?: string;
    role?: string;
    token?: string;
    msg?: string;
    photo?: string
}

export interface User {
    _id: string;
    email: string;
    role: string;
    username: string;
    photo: string
}