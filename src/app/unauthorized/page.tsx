"use client";

import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <LockIcon className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page.
        </p>

        <Button onClick={() => router.push("/")} className={"mt-4"}>
          Return to homepage
        </Button>
      </div>
    </div>
  );
}
