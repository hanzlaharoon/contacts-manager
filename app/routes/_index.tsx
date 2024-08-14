import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans">
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="#">
            Contacts Manager
          </a>
        </div>
        <div className="navbar-end">
          <button className="btn">New Contact</button>
        </div>
      </div>
    </div>
  );
}
