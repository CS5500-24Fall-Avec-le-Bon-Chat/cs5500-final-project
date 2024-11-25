import { DonorService } from "@/server/services/donor.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/donor:
 *   get:
 *     description: Get a donor by ID or name, or get donors by fundraiserId
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: The ID of the donor
 *         schema:
 *           type: integer
 *       - name: name
 *         in: query
 *         required: false
 *         description: The name of the donor
 *         schema:
 *           type: string
 *       - name: fundraiserId
 *         in: query
 *         required: false
 *         description: The ID of the fundraiser
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A donor or a list of donors
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Donor'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const id = params.get("id");
    const name = params.get("name");
    const fundraiserId = params.get("fundraiserId");

    if (id || name) {
      const donor = await DonorService.getDonor({
        id: id ? parseInt(id) : undefined,
        name: name || undefined,
      });
      return NextResponse.json(donor);
    } else if (fundraiserId) {
      const donors = await DonorService.getDonorsByFundraiser({
        fundraiserId: parseInt(fundraiserId),
      });
      return NextResponse.json(donors);
    } else {
      const donors = await DonorService.getDonors();
      return NextResponse.json(donors);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to get donor") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

/**
 * @openapi
 * /api/donor:
 *   patch:
 *     description: Update a donor's information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchDonorParams'
 *     responses:
 *       200:
 *         description: The updated donor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Donor id is required or failed to update donor
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();
    const donor = await DonorService.patchDonor(params);
    return NextResponse.json(donor);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Donor id is required" ||
        error.message === "Failed to update donor")
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
 * /api/donor:
 *   delete:
 *     description: Delete a donor by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteDonorParams'
 *     responses:
 *       200:
 *         description: The deleted donor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Donor id is required or failed to delete donor
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(req: NextRequest) {
  try {
    const params = await req.json();
    const donor = await DonorService.deleteDonor(params);
    return NextResponse.json(donor);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Donor id is required" ||
        error.message === "Failed to delete donor")
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
 * /api/donors:
 *   post:
 *     description: Create new donors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDonorsParams'
 *     responses:
 *       200:
 *         description: The created donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Donor already exists or missing required fields
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const donor = await DonorService.createDonor(params);
    return NextResponse.json(donor);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Donor already exists" ||
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
