const DONORS_URL =
  "https://bc-cancer-faux.onrender.com/pmm?format=json";

interface IFundraiserResult {
  headers: string[];
  data: string[][];
}

export const GetFundraisers = async (): Promise<string[]> => {
  const res = await fetch(DONORS_URL);
  const result = (await res.json()) as IFundraiserResult;
  return result.data.flat();
};
