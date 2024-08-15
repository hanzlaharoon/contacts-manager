import {
  LoaderFunction,
  ActionFunction,
  redirect,
  json,
} from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { Contact } from "types";

export const loader: LoaderFunction = async ({ params }) => {
  const { contactId } = params;

  const response = await fetch(`http://localhost:3000/contacts/${contactId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contact");
  }

  const contact: Contact = await response.json();
  return json({ contact });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const description = formData.get("description") as string | undefined;
  const { contactId } = params;

  if (!contactId) {
    return json({ error: "Contact ID is required" }, { status: 400 });
  }

  const updatedContact: Contact = { id: contactId, name, phone, description };
  try {
    const result = await (
      await fetch(`http://localhost:3000/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      })
    ).json();
    if (result?.statusCode === 400) {
      return json(
        { error: result?.message?.join(" | ") || "Failed to update contact" },
        { status: 400 }
      );
    }

    return redirect("/");
  } catch (error) {
    return json({ error: "Failed to update contact" }, { status: 500 });
  }
};

export default function EditContact() {
  const { contact } = useLoaderData<{ contact: Contact }>();
  const actionData = useActionData();

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Contact</h1>

      {actionData?.error && (
        <div className="alert alert-error mb-4">
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
            defaultValue={contact.name}
            required
            className="input input-bordered w-full"
            placeholder="John Doe"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="phone">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={contact.phone}
            required
            className="input input-bordered w-full"
            placeholder="+923336001234"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            defaultValue={contact.description || ""}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Update Contact
          </button>
        </div>
      </Form>
    </div>
  );
}
