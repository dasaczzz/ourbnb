import { ClientSingleton } from "../lib/prisma";
import { Facility } from "@prisma/client";

const prisma = ClientSingleton.getInstance();

const facilityService = {
  getFacilitiesByPostId: async (post_id: string): Promise<Facility[] | null> => {
    const post = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      select: {
        facilities: true,
      },
    });

    if (!post || !post.facilities || post.facilities.length === 0) {
      return null;
    }

    const facilities = await prisma.facility.findMany({
      where: {
        id: {
          in: post.facilities,
        },
      },
    });

    return facilities;
  },
};

export default facilityService; 