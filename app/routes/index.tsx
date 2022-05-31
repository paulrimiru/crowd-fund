import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative mx-4 grid min-h-screen grid-rows-[64px_1fr] gap-1 bg-white">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Morans Crowd Funding
        </h1>
        <>
          {user ? (
            <div className="flex flex-row gap-4">
              <span className="rounded py-2 px-4 text-lg font-semibold text-gray-500">
                {user.email}
              </span>
              <form action="/logout" method="POST">
                <button type="submit" className="rounded bg-blue-500  py-2 px-4 text-lg font-semibold text-white hover:bg-blue-600 focus:bg-blue-400">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              to="/join"
              className="rounded bg-blue-500  py-2 px-4 text-lg font-semibold text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Join
            </Link>
          )}
        </>
      </div>
      <div className="flex h-full flex-col gap-1">No Projects</div>
    </main>
  );
}
