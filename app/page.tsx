"use client";

import Chat from "@/components/chat";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center flex-col items-center mt-16 gap-4">
      <Image src="/logo-modified.png" width={64} height={64} alt="logo" />
      <span className="font-bold text-center">
        This is a demo for Confluent&apos;s AI Day challenge to showcase the AI
        pipeline. <br />
        This does not reflect the final website or product. The tool works only
        for information on the <i>corvus</i> codebase.
        <br />
        Access commits given an ID via
        https://github.com/corvus-app/corvus/commits/[commitId]. Learn more @{" "}
        <Link
          href="https://github.com/corvus-app/corvus"
          className="underline"
          target="_blank"
        >
          GitHub
        </Link>
      </span>
      <Chat />
    </div>
  );
}
