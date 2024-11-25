import { EventFundraiserService } from "@/server/services/eventFundraiser.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/event-fundraiser:
 *   get:
 *     description: Get event fundraisers by id, eventId, or fundraiserId
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: The ID of the event fundraiser
 *         schema:
 *           type: integer
 *       - name: eventId
 *         in: query
 *         required: false
 *         description: The ID of the event
 *         schema:
 *           type: integer
 *       - name: fundraiserId
 *         in: query
 *         required: false
 *         description: The ID of the fundraiser
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of event fundraisers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventFundraiser'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const id = params.get("id");
    const eventId = params.get("eventId");
    const fundraiserId = params.get("fundraiserId");

    if (id) {
      const eventFundraiser = await EventFundraiserService.getEventFundraiserById({ id: parseInt(id) });
      return NextResponse.json(eventFundraiser);
    } else if (eventId || fundraiserId) {
      const eventFundraisers = await EventFundraiserService.getEventFundraisersByFilter({
        eventId: eventId ? parseInt(eventId) : undefined,
        fundraiserId: fundraiserId ? parseInt(fundraiserId) : undefined,
      });
      return NextResponse.json(eventFundraisers);
    } else {
      const eventFundraisers = await EventFundraiserService.getAllEventFundraisers();
      return NextResponse.json(eventFundraisers);
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
 * /api/event-fundraiser:
 *   post:
 *     description: Create a new event fundraiser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventFundraiserParams'
 *     responses:
 *       200:
 *         description: The created event fundraiser
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventFundraiser'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const eventFundraiser = await EventFundraiserService.createEventFundraiser(params);
    return NextResponse.json(eventFundraiser);
  } catch (error) {
    if (error instanceof Error && error.message === "Missing required fields") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @openapi
 * /api/event-fundraiser:
 *   delete:
 *     description: Delete an event fundraiser by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteEventFundraiserParams'
 *     responses:
 *       200:
 *         description: The deleted event fundraiser
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventFundraiser'
 *       400:
 *         description: Event fundraiser not found or failed to delete event fundraiser
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const eventFundraiser = await EventFundraiserService.deleteEventFundraiser(params);
    return NextResponse.json(eventFundraiser);
  } catch (error) {
    if (error instanceof Error && (error.message === "Event fundraiser not found" || error.message === "Failed to delete event fundraiser")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}