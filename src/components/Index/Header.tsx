import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { data: sessionData } = useSession();

  const userMarkup = (
    <div className="flex w-full justify-between">
      <div>
        <div className="text-2xl">
          Hello,{" "}
          <span className="font-semibold">
            {sessionData?.user.name?.split(" ")[0]}
          </span>
        </div>
        <div className="text-sm">Let's get it.</div>
      </div>
      <div>
        <button
          className="rounded-lg bg-white/10 px-3 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signOut()}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  const loginMarkup = (
    <div className="h-full">
      <h1 className="pb-2 text-4xl font-semibold">
        Welcome to <span className="font-black">Voy</span>.
      </h1>
      <div className="pb-5">Get started with your journey</div>
      <button
        className="flex rounded-lg bg-white/10 p-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => void signIn("google")}
      >
        Log in <ArrowLeftOnRectangleIcon className="ml-2 h-6 w-6" />
      </button>
    </div>
  );

  return <div className="mb-5">{sessionData ? userMarkup : loginMarkup}</div>;
}
