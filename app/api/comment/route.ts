import { CommentService } from "@/server/services/comment.service";
import { NextRequest, NextResponse } from "next/server";
import { ReasonType } from "@prisma/client";

/**
 * @openapi
 * /api/comment:
 *   get:
 *     description: Get all comments, a comment by ID, or comments by fundraiserId, donorId, eventId, or type
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *       - name: fundraiserId
 *         in: query
 *         required: false
 *         description: The ID of the fundraiser
 *         schema:
 *           type: integer
 *       - name: donorId
 *         in: query
 *         required: false
 *         description: The ID of the donor
 *         schema:
 *           type: integer
 *       - name: eventId
 *         in: query
 *         required: false
 *         description: The ID of the event
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         required: false
 *         description: The type of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments or a single comment
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 - $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const id = params.get("id");
    const fundraiserId = params.get("fundraiserId");
    const donorId = params.get("donorId");
    const eventId = params.get("eventId");
    const type = params.get("type");

    if (id) {
      const comment = await CommentService.getCommentById({ id: parseInt(id) });
      return NextResponse.json(comment);
    } else if (fundraiserId || donorId || eventId || type) {
      const comments = await CommentService.getCommentsByFilter({
        fundraiserId: fundraiserId ? parseInt(fundraiserId) : undefined,
        donorId: donorId ? parseInt(donorId) : undefined,
        eventId: eventId ? parseInt(eventId) : undefined,
        type: type ? (type as ReasonType) : undefined,
      });
      return NextResponse.json(comments);
    } else {
      const comments = await CommentService.getAllComments();
      return NextResponse.json(comments);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

/**
 * @openapi
 * /api/comment:
 *   post:
 *     description: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentParams'
 *     responses:
 *       200:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const comment = await CommentService.createComment({
      ...params,
      createdAt: new Date(),
    });
    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof Error && error.message === "Missing required fields") {
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
 * /api/comment:
 *   delete:
 *     description: Delete a comment by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteCommentByIdParams'
 *     responses:
 *       200:
 *         description: The deleted comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Comment not found or failed to delete comment
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const comment = await CommentService.deleteComment(params);
    return NextResponse.json(comment);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Comment not found" ||
        error.message === "Failed to delete comment")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
