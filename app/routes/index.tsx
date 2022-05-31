import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative mx-4 min-h-screen grid grid-rows-[64px_1fr] gap-1 bg-white">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Morans Crowd Funding
        </h1>
        <Link to="/join" className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 text-lg font-semibold">
          Join
        </Link>
      </div>
      <div className="flex flex-col gap-1 h-full">
        No Projects
      </div>
    </main>
  );
}
