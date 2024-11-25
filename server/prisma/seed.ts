import { PrismaClient, Role } from "@prisma/client";
import { GetDonors } from "@/lib/api/donor.api";
import { GetFundraisers } from "@/lib/api/fundraiser.api";
import { UserService } from "@/server/services/user.service";

const prisma = new PrismaClient();

async function initFundraisers() {
  if ((await prisma.user.findMany()).length > 0) {
    return;
  }
  // Fetch user data from the external API
  const fundraisers = await GetFundraisers(); // Fetch users from the external API

  // Iterate through the fetched user data and create users in the database
  for (const fundraiser of fundraisers) {
    await prisma.user.create({
      data: {
        name: fundraiser,
        role: Role.FUNDRAISER,
      },
    });
  }
}

async function initDonors() {
  if ((await prisma.donor.findMany()).length > 0) {
    return;
  }
  // Fetch user data from the external API
  const donors = await GetDonors(); // Fetch users from the external API

  // Iterate through the fetched user data and create users in the database
  for (const donor of donors) {
    const name = `${donor.first_name} ${donor.last_name}`;
    if (await prisma.donor.findFirst({ where: { name } })) {
      continue;
    }
    const fundraiserId =
      (await UserService.getUser({ name: donor.pmm }))?.id || 1;
    await prisma.donor.create({
      data: {
        name,
        fundraiserId,
      },
    });
  }

  console.log("Seeded users successfully!");
}

export async function main() {
  await initFundraisers();
  await initDonors();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
