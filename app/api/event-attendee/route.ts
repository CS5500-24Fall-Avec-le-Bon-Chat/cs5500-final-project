import { EventAttendeeService } from "@/server/services/eventAttendee.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/event-attendee:
 *   get:
 *     description: Get event attendees by eventId or donorId
 *     parameters:
 *       - name: eventId
 *         in: query
 *         required: false
 *         description: The ID of the event
 *         schema:
 *           type: integer
 *       - name: donorId
 *         in: query
 *         required: false
 *         description: The ID of the donor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of event attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventAttendee'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const eventId = params.get("eventId");
    const donorId = params.get("donorId");

    if (eventId || donorId) {
      const eventAttendees =
        await EventAttendeeService.getEventAttendeesByFilter({
          eventId: eventId ? parseInt(eventId) : undefined,
          donorId: donorId ? parseInt(donorId) : undefined,
        });
      return NextResponse.json(eventAttendees);
    } else {
      const eventAttendees = await EventAttendeeService.getAllEventAttendees();
      return NextResponse.json(eventAttendees);
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
 * /api/event-attendee:
 *   post:
 *     description: Create a new event attendee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventAttendeeParams'
 *     responses:
 *       200:
 *         description: The created event attendee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventAttendee'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const eventAttendee =
      await EventAttendeeService.createEventAttendee(params);
    return NextResponse.json(eventAttendee);
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
 * /api/event-attendee:
 *   patch:
 *     description: Update an event attendee's amount by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchEventAttendeeParams'
 *     responses:
 *       200:
 *         description: The updated event attendee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventAttendee'
 *       400:
 *         description: Event attendee id is required or failed to update event attendee
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();
    const eventAttendee =
      await EventAttendeeService.patchEventAttendeeAmount(params);
    return NextResponse.json(eventAttendee);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Event attendee id is required" ||
        error.message === "Failed to update event attendee")
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
 * /api/event-attendee:
 *   delete:
 *     description: Delete an event attendee by id or eventId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteEventAttendeeParams'
 *     responses:
 *       200:
 *         description: The deleted event attendee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventAttendee'
 *       400:
 *         description: Event attendee not found or failed to delete event attendee
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const { id, eventId } = params;

    if (id) {
      const eventAttendee = await EventAttendeeService.deleteEventAttendee({
        id,
      });
      return NextResponse.json(eventAttendee);
    } else if (eventId) {
      const eventAttendees =
        await EventAttendeeService.deleteEventAttendeesByEventId({ eventId });
      return NextResponse.json(eventAttendees);
    } else {
      return NextResponse.json(
        { error: "id or eventId is required" },
        { status: 400 },
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Event attendee not found" ||
        error.message === "Failed to delete event attendee")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
