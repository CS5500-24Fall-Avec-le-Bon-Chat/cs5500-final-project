const DONORS_URL = "https://bc-cancer-faux.onrender.com/donors?format=json&limit=1000";

interface IDonorsResult {
  headers: string[];
  data: Array<{
    pmm: string;
    smm: string;
    vmm: string;
    exclude: string;
    deceased: string;
    first_name: string;
    nick_name: string;
    last_name: string;
    organization_name: string;
    total_donations: number;
    total_pledge: number;
    largest_gift: number;
    largest_gift_appeal: string;
    first_gift_date: number;
    last_gift_date: number;
    last_gift_amount: number;
    last_gift_request: number;
    last_gift_appeal: string;
    address_line1: string;
    address_line2: string;
    city: string;
    contact_phone_type: string;
    phone_restrictions: string;
    email_restrictions: string;
    communication_restrictions: string;
    subscription_events_in_person: string;
    subscription_events_magazine: string;
    communication_preference: string;
  }>[];
}

export const GetDonors = async (): Promise<IDonorsResult> => {
  const res = await fetch(DONORS_URL);
  return res.json();
};
