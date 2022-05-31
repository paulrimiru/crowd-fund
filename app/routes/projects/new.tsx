import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import * as React from "react";

import { createProject } from "~/models/project.server";
import { requireUser } from "~/session.server";

type ActionData = {
  errors?: {
    target?: string;
    name?: string;
    body?: string;
    address?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const target = Number(formData.get("target"));
  const description = formData.get("body");
  const address = user.address;

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }
  
  if (typeof target !== "number" || target === 0) {
    return json<ActionData>(
      { errors: { name: "Target is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }
  
  if (typeof address !== "string" || address.length === 0) {
    return json<ActionData>(
      { errors: { address: "Account not connected" } },
      { status: 400 }
    );
  }

  const note = await createProject({ name, description, target, address, ownerId: user.id });

  return redirect(`/notes/${note.id}`);
};

export default function NewProjectPage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const transition = useTransition();

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={titleRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.name}
          </div>
        )}
      </div>
      
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Target: </span>
          <input
            ref={titleRef}
            name="target"
            type="number"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.target ? true : undefined}
            aria-errormessage={
              actionData?.errors?.target ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.target && (
          <div className="pt-1 text-red-700" id="target-error">
            {actionData.errors.target}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          disabled={transition.state !== "idle"}
        >
          {transition.state === "submitting" ? "Creating project..." : "Create project"}
        </button>
      </div>
    </Form>
  );
}
