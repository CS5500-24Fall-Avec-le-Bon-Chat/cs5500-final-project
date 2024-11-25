import { PrismaClient, Role } from "@prisma/client";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByRoleParams,
  GetUserParams,
  GetUserRoleParams,
  PatchUserParams,
} from "@/server/types/user.types";

const prisma = new PrismaClient();

export class UserService {
  // Create a new user
  static async createUser(params: CreateUserParams) {
    const { name, role } = params;

    if (!name || !role) {
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

      const user = await prisma.user.create({
        data: {
          name: name,
          role: role,
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
  }

  // Get all users
  static async getUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get users");
    }
  }

  // Get a user by id or name
  static async getUser(param: GetUserParams) {
    const { id, name } = param;
    const data: { id?: number; name?: string } = {};
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
  }

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
