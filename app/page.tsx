"use client";

import { getRepoContent } from "@/actions/getRepoContent";
import { recursiveGetWholeRepoContent } from "@/actions/recursiveGetWholeRepoContent";
import SignIn from "@/components/signIn";
import SignOut from "@/components/signOut";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <SignIn />
      <SignOut />
      <Button
        onClick={async () => {
          const rootRepoContent = await getRepoContent("corvus", "");
          const data = await recursiveGetWholeRepoContent(
            "corvus",
            rootRepoContent,
            {}
          );
          console.log(data);
        }}
      ></Button>
    </div>
  );
}
