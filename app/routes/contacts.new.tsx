import { ActionFunction, redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Contact } from "types";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const description = formData.get("description") as string | undefined;

  const newContact: Contact = { id: "", name, phone, description };

  try {
    const res = await (
      await fetch("http://localhost:3000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      })
    ).json();
    if (res?.statusCode === 400) {
      return json(
        { error: res?.message?.join(" | ") || "Failed to create contact" },
        { status: 400 }
      );
    }

    return redirect("/");
  } catch (error) {
    return json({ error: "Failed to create contact" }, { status: 500 });
  }
};

export default function NewContact() {
  const actionData = useActionData();

  return (
    <div className="max-w-md mx-auto my-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        Create New Contact
      </h1>

      {actionData?.error && (
        <div className="alert alert-error">
          <div>
            <span>{actionData.error}</span>
          </div>
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="phone">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="text"
            name="phone"
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Create Contact
          </button>
        </div>
      </Form>
    </div>
  );
}
