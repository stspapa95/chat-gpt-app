import Chat from "@/components/Chat";
import { getServerSession } from "next-auth";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className={"py-4 px-6"}>
      <h1 className={"text-4xl font-bold"}>Welcome to GPT Chat</h1>
      {!session?.user?.email && (
        <div className={"mt-2"}>You need to log in to use this chat.</div>
      )}
      {session?.user?.email && (
        <>
          <Separator className={"my-5"} />
          <Chat />
        </>
      )}
    </main>
  );
}
