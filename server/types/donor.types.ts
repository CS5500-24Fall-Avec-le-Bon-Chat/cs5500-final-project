export interface CreateDonorParams {
    name: string;
    fundraiserId: number;
}

export interface CreateDonorsParams {
    donors: CreateDonorParams[];
}

export interface GetDonorParams {
    id?: number;
    name?: string;
}

export interface GetDonorByFundraiserParams {
    fundraiserId: number;
}

export interface PatchDonorParams {
    id: number;
    name?: string;
    fundraiserId?: number;
}

export interface DeleteDonorParams {
    id: number;
}