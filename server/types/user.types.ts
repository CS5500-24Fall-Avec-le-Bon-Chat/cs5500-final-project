import { City, Role } from "@prisma/client";


export interface CreateUserParams {
    name: string;
    role: Role;
    password: string;
}

export interface GetUserParams {
    id?: number;
    name?: string;
}

export interface GetUserByRoleParams {
    role: Role;
}

export interface GetUserRoleParams {
    id?: number;
    name?: string;
}

export interface PatchUserParams {
    id: number;
    name?: string;
    role?: Role;
}

export interface DeleteUserParams {
    id: number;
}