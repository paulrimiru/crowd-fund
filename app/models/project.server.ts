import type { User, Project } from "@prisma/client";

import { prisma } from "~/db.server";
import deploy from "~/deploy.server";

export function getProject({
  id,
  userId,
}: Pick<Project, "id"> & {
  userId: User["id"];
}) {
  return prisma.project.findFirst({
    where: { id, ownerId: userId },
  });
}

export function getProjectListItems({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, address: true, name: true},
    orderBy: { updatedAt: "desc" },
  });
}

export async function createProject({
  name,
  description,
  address,
  target,
  ownerId,
}: Pick<Project, "name" | "description" | "address"> & {
  target: number;
  ownerId: User["id"];
}) {
  const contractAddress = await deploy({name, description, target, account: address});

  return prisma.project.create({
    data: {
      name,
      description,
      address: contractAddress,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
  });
}

export function deleteProject({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) {
  return prisma.project.deleteMany({
    where: { id, ownerId: userId },
  });
}
