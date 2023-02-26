import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import Button from "../components/Button";

const GetStarted: NextPage = () => {
  const { data: sessionData } = useSession();

  const headMarkup = (
    <Head>
      <title>Voy</title>
      <meta name="description" content="The Voy App" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  return (
    <>
      {headMarkup}
      <main className="h-full flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white">
        <h1>Let's get started!</h1>
        <Button>Skip this</Button>
      </main>
    </>
  );
};

export default GetStarted;
