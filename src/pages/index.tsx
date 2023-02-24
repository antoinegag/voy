import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const habits = api.habits.getHabits.useQuery();

  return (
    <>
      <Head>
        <title>Voy</title>
        <meta name="description" content="The Voy App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="py-16">
          <h2 className="text-3xl">Your habits</h2>
          <div>
            {habits.data
              ? habits.data.length > 0
                ? habits.data.map((habit) => (
                    <div>
                      {habit.title} - {habit.id}
                    </div>
                  ))
                : "No habits"
              : "Loading habits..."}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
