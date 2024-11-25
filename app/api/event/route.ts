import { EventService } from "@/server/services/event.service";
import { NextRequest, NextResponse } from "next/server";
import { City } from "@prisma/client";

/**
 * @openapi
 * /api/event:
 *   get:
 *     description: Get all events, an event by ID, or events by title, topic, date, or city
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: The ID of the event
 *         schema:
 *           type: integer
 *       - name: title
 *         in: query
 *         required: false
 *         description: The title of the event
 *         schema:
 *           type: string
 *       - name: topic
 *         in: query
 *         required: false
 *         description: The topic of the event
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         required: false
 *         description: The date of the event
 *         schema:
 *           type: string
 *           format: date
 *       - name: city
 *         in: query
 *         required: false
 *         description: The city of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of events or a single event
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 - $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const id = params.get("id");
    const title = params.get("title");
    const topic = params.get("topic");
    const date = params.get("date");
    const city = params.get("city");

    if (id) {
      const event = await EventService.getEventById({ id: parseInt(id) });
      return NextResponse.json(event);
    } else if (title || topic || date || city) {
      const events = await EventService.getEventsByFilter({
        title: title || undefined,
        topic: topic || undefined,
        date: date ? new Date(date) : undefined,
        city: (city as City) || undefined,
      });
      return NextResponse.json(events);
    } else {
      const events = await EventService.getAllEvents();
      return NextResponse.json(events);
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
 * /api/event:
 *   post:
 *     description: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventParams'
 *     responses:
 *       200:
 *         description: The created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const event = await EventService.createEvent(params);
    return NextResponse.json(event);
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
 * /api/event:
 *   patch:
 *     description: Update an event's information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchEventParams'
 *     responses:
 *       200:
 *         description: The updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Event id is required or failed to update event
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();
    const event = await EventService.patchEvent(params);
    return NextResponse.json(event);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Event id is required" ||
        error.message === "Failed to update event")
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
 * /api/event:
 *   delete:
 *     description: Delete an event by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteEventParams'
 *     responses:
 *       200:
 *         description: The deleted event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Event not found or failed to delete event
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const event = await EventService.deleteEvent(params);
    return NextResponse.json(event);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Event not found" ||
        error.message === "Failed to delete event")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
