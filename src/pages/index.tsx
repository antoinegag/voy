import { GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";

import Header from "../components/Index/Header";
import Content from "../components/Index/Content";
import { getServerAuthSession } from "../server/auth";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  if (sessionData == null) {
    return (
      <main className="flex h-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white">
        <Header />
      </main>
    );
  }

  return (
    <main className="h-full flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white">
      <Header />
      <Content />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  console.log("user", session?.user);
  if (
    session?.user != null &&
    !session?.user.onboarded &&
    !session?.user.skippedOnboarding
  ) {
    return {
      redirect: { destination: "/get-started", permanent: false },
      props: {},
    };
  }

  return { props: {} };
};

export default Home;
