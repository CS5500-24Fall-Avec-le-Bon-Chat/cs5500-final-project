import { 
    CreateDonorParams, CreateDonorsParams,
    DeleteDonorParams,
    GetDonorByFundraiserParams,
    GetDonorParams,
    PatchDonorParams
 } from "../types/donor.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DonorService {
    // Create a new donor
    static async createDonor(params: CreateDonorParams) {
        const { name, fundraiserId } = params;

        if (!name) {
            throw new Error("Missing required fields");
        }

        try {
            // check if the donor is already in the database
            const donorExists = await prisma.donor.findFirst({
                where: {
                    name: name,
                },
            });

            if (donorExists) {
                throw new Error("Donor already exists");
            }

            const donor = await prisma.donor.create({
                data: {
                    name: name,
                    fundraiserId: fundraiserId,
                },
            });

            return donor;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create donor");
        }
    }

    static async createDonors(params: CreateDonorsParams) {
        const { donors } = params;

        // Find existing donors by name
        const existingDonors = await prisma.donor.findMany({
            where: {
                name: {
                    in: donors.map(donor => donor.name),
                },
            },
        });

        // Filter out existing donors
        const existingDonorNames = new Set(existingDonors.map(donor => donor.name));
        const newDonorsData = donors.filter(donor => !existingDonorNames.has(donor.name));

        // Create new donors
        const newDonors = await prisma.donor.createMany({
            data: newDonorsData,
        });

        return newDonors;
    }

    static async getDonors() {
        return await prisma.donor.findMany();
    }

    // Get a donor by id or name
    static async getDonor(params: GetDonorParams) {
        const { id, name } = params;
        const data : {id?: number, name?: string} = {};
        if (id) data.id = id;
        if (name) data.name = name;

        try {
            return await prisma.donor.findFirst({
                where: data,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get donor");
        }
    }

    // Get all donors for a fundraiser
    static async getDonorsByFundraiser(param: GetDonorByFundraiserParams) {
        const { fundraiserId } = param;

        if (!fundraiserId) {
            throw new Error("Fundraiser id is required");
        }

        try {
            return await prisma.donor.findMany({
                where: {
                    fundraiserId: fundraiserId,
                },
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Failed to get donors");
        }
    }
    
    // Update a donor by id
    static async patchDonor(params: PatchDonorParams) {
        const { id, name, fundraiserId } = params;
        const data : {name?: string, fundraiserId?: number} = {};

        if (!id) {
            throw new Error("Donor id is required");
        }

        if (name) data.name = name;
        if (fundraiserId) data.fundraiserId = fundraiserId;

        try {
            return await prisma.donor.update({
                where: {
                    id: id,
                },
                data: data,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update donor");
        }
    }

    // Delete a donor by id
    static async deleteDonor(param: DeleteDonorParams) {
        const { id } = param;
        if (!id) {
            throw new Error("Donor id is required");
        }

        try {
            return await prisma.donor.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.error(error);
            throw new Error("Failed to delete donor");
        }
    }
}
