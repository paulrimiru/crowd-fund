import type { Project } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProjectContract } from "~/contract-utils.server";

import { deleteProject } from "~/models/project.server";
import { getProject } from "~/models/project.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  note: Project;
  amount: number;
  target: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "projectId not found");

  const note = await getProject({ userId, id: params.projectId });

  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  const projectContract = await getProjectContract(note?.address);
  const amount = await projectContract.methods.getAmount().call();
  const target = await projectContract.methods.target().call();

  return json<LoaderData>({ note, amount, target });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "projectId not found");

  await deleteProject({ userId, id: params.projectId });

  return redirect("/projects");
};

export default function ProjectDetailsPage() {
  const data = useLoaderData() as LoaderData;

  const { state } = useTransition();

  if (state === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.name}</h3>
      <p className="py-6">{data.note.description}</p>
      <p className="py-6">Contract Address : {data.note.address}</p>
      <p className="py-6">Target Amount : {data.target}</p>
      <p className="py-6">
        Raised Amount : {data.amount / 1000000000000000000}
      </p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
