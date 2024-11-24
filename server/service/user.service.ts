import { PrismaClient, Role } from "@prisma/client";
import {
    CreateUserParams, 
    DeleteUserParams, 
    GetUserByRoleParams, 
    GetUserParams,
    GetUserRoleParams,
    PatchUserParams
} from "../types/user.types";
import bcrypt from "bcrypt";

// work flow:
// 1. create a new user and assign a role
// 2. create a new event and assign a fundraiser. Only a coordinator can create an event.
// 3. pull donors from Juancho's api and store them in the database. Assign a fundraiser to each donor.
// 4. create a eventAttendee and assign a donor to an event simultaneously.
// 5. when a donor donates, update the donor's total donation amount and the event's total donation amount.
// 6. when attendee list changes, update the eventAttendee table.
// 7. make a comment on a donor's profile. Only a fundraiser can make a comment.

const prisma = new PrismaClient();

export class UserService {

    private static async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    // Create a new user
    static async createUser(params: CreateUserParams) {
        const { name, role, password } = params;
        
        if (!name || !role || !password) {
            throw new Error("Missing required fields");
        }

        try {
            // check if the user is already in the database
            const userExists = await prisma.user.findFirst({
                where: {
                    name: name,
                },
            });

            if (userExists) {
                throw new Error("User already exists");
            }
            
            const hashedPassword = await this.hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    name: name,
                    role: role,
                    password: hashedPassword,
                },
            });
            return user;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to create user");
        }
    };

    // Get all users
    static async getUsers() {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get users");
        }
    };

    // Get a user by id or name
    static async getUser(param: GetUserParams) {
        const { id, name} = param;
        const data: { id?: number; name?: string; } = {};
        if (id) data.id = id;
        if (name) data.name = name;

        try {
            const users = await prisma.user.findFirst({
                where: data,
            });
            return users;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user");
        }
    };

    static async getUserByRole(param: GetUserByRoleParams) {
        try {
            const users = await prisma.user.findMany({
                where: {
                    role: param.role,
                },
            });
            return users;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user");
        }
    }

    // Get user role by id or name
    static async getUserRole(param: GetUserRoleParams) {
        const { id, name } = param;
        const data: { id?: number; name?: string } = {};
        if (id) data.id = id;
        if (name) data.name = name;

        try {
            const user = await prisma.user.findFirst({
                where: data,
            });

            if (!user) {
                throw new Error("User not found");
            }

            return user.role;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to get user");
        }
    }

    // Update user role by id
    static async patchUser(param: PatchUserParams) {
        const { id, name, role } = param;
        if (!id) {
            throw new Error("User id is required");
        }

        // Prepare the data object with the fields to update
        const data: { name?: string; role?: Role } = {};
        if (name) data.name = name;
        if (role) data.role = role;
    
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: id,
                },
                data: data,
            });
            return updatedUser;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to update user");
        }
    }

    // Delete user by id
    static async deleteUser(param: DeleteUserParams) {

        try {
            // if the user does not exist, prisma will throw an error
            const user = await prisma.user.findUnique({
                where: {
                    id: param.id,
                },
            });

            if (!user) {
                throw new Error("User not found");
            }

            const deletedUser = await prisma.user.delete({
                where: {
                    id: param.id,
                },
            });
            return deletedUser;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to delete user");
        }
    }
}
