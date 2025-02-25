"use client";
import { useSession, signIn, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getFirstTwoCapitalLetters = (str?: string | null) => {
  const match = (str || "").match(/[A-Z]/g);
  return match ? match.slice(0, 2).join("") : "GT";
};

function UserButton() {
  const { data: session, status } = useSession();

  const handleSignIn = () => signIn();
  const handleSignOut = () => signOut();

  return (
    <div>
      {status === "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className={"cursor-pointer"}>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {getFirstTwoCapitalLetters(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={handleSignOut}
              className={"cursor-pointer"}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {status === "unauthenticated" && (
        <Button onClick={handleSignIn}>Sign in</Button>
      )}
    </div>
  );
}

export default UserButton;
