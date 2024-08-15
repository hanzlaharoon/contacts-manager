import {
  ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Contact } from "types";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const response = await fetch("http://localhost:3000/contacts");
  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }
  const contacts: Contact[] = await response.json();
  return json({ contacts });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactId = formData.get("contactId") as string;

  if (!contactId) {
    return json({ error: "Contact ID is required" }, { status: 400 });
  }

  try {
    await deleteContact(contactId);
    return redirect("/");
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to delete contact" }, { status: 500 });
  }
};

async function deleteContact(contactId: string): Promise<void> {
  const response = await (
    await fetch(`http://localhost:3000/contacts/${contactId}`, {
      method: "DELETE",
    })
  ).json();
  if (!response.ok) {
    throw new Error(`Failed to delete contact with ID ${contactId}`);
  }
}

export default function Index() {
  const { contacts } = useLoaderData<{ contacts: Contact[] }>();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contacts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div key={contact.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">{contact.name}</h2>
              <p>{contact.phone}</p>
              {contact.description && (
                <p className="text-sm text-gray-500">{contact.description}</p>
              )}
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/contacts/${contact.id}/edit`}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Edit
                </Link>
                <Form method="post">
                  <input type="hidden" name="contactId" value={contact.id} />
                  <button
                    type="submit"
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
