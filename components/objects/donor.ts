// components/objects/Donor.ts
export interface Donor {
  name: string;
  totalDonations: number;
  address: string;
  lastGiftDate: string;
  communicationPreference: string;
  communicationRestriction: string;
  subscriptions: string;
  invited: boolean;
}

export interface DonorAPIResponse {
  first_name: string;
  last_name: string;
  total_donations: number;
  address: string;
  last_gift_date: string;
  communication_preference: string;
  communication_restriction: string;
  subscriptions: string;
}

export const transformDonorData = (apiData: DonorAPIResponse[]): Donor[] => {
  return apiData.map(donor => ({
    name: `${donor.first_name} ${donor.last_name}`,
    totalDonations: donor.total_donations,
    address: donor.address,
    lastGiftDate: donor.last_gift_date,
    communicationPreference: donor.communication_preference,
    communicationRestriction: donor.communication_restriction,
    subscriptions: donor.subscriptions,
    invited: false, // Default unchecked
  }));
};