import {IDonor} from "@/types/donor.types";

const DONORS_URL =
  "https://bc-cancer-faux.onrender.com/donors?format=json";
const DEFAULT_LIMIT = 100;

interface IDonorsParams {
  limit?: number;
}

interface IDonorsResult {
  headers: string[];
  data: (string | number)[][];
}

export const GetDonors = async (params?: IDonorsParams): Promise<IDonor[]> => {
  const url = DONORS_URL + `&limit=${params?.limit ?? DEFAULT_LIMIT}`;
  const res = await fetch(url);
  const result = (await res.json()) as IDonorsResult;
  return result.data.map((donor): IDonor => ({
    pmm: donor[0] as string,
    smm: donor[1] as string,
    vmm: donor[2] as string,
    exclude: donor[3] as string,
    deceased: donor[4] as string,
    first_name: donor[5] as string,
    nick_name: donor[6] as string,
    last_name: donor[7] as string,
    organization_name: donor[8] as string,
    total_donations: donor[9] as number,
    total_pledge: donor[10] as number,
    largest_gift: donor[11] as number,
    largest_gift_appeal: donor[12] as string,
    first_gift_date: donor[13] as number,
    last_gift_date: donor[14] as number,
    last_gift_amount: donor[15] as number,
    last_gift_request: donor[16] as number,
    last_gift_appeal: donor[17] as string,
    address_line1: donor[18] as string,
    address_line2: donor[19] as string,
    city: donor[20] as string,
    contact_phone_type: donor[21] as string,
    phone_restrictions: donor[22] as string,
    email_restrictions: donor[23] as string,
    communication_restrictions: donor[24] as string,
    subscription_events_in_person: donor[25] as string,
    subscription_events_magazine: donor[26] as string,
    communication_preference: donor[27] as string,
  }));
};
