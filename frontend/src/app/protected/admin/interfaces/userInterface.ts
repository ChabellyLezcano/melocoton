export interface UserResponse {
    ok:    boolean;
    users: User[];
    user: User;
    msg?: string;
}

export interface User {
    accountStatus: string;
    _id:           string;
    username:      string;
    email:         string;
    password:      string;
    role:          string;
    token:         null | string;
    authenticated: boolean;
    __v:           number;
    photo?:        string;
}