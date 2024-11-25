import { UserService } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to get users
 *       400:
 *         description: Bad Request
 */
export async function GET() {
  try {
    const users = await UserService.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to get users") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

/**
 * @openapi
 * /api/users:
 *   post:
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserParams'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const user = await UserService.createUser(params);
    return NextResponse.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "User already exists" ||
        error.message === "Missing required fields")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @openapi
 * /api/users:
 *   patch:
 *     description: Update a user's information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchUserParams'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User id is required or failed to update user
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();
    const user = await UserService.patchUser(params);
    return NextResponse.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "User id is required" ||
        error.message === "Failed to update user")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @openapi
 * /api/users:
 *   delete:
 *     description: Delete a user by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserParams'
 *     responses:
 *       200:
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found or failed to delete user
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const user = await UserService.deleteUser(params);
    return NextResponse.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "User not found" ||
        error.message === "Failed to delete user")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
