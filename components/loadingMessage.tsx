import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex flex-row items-end">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/logo-modified.png" />
          <AvatarFallback>O</AvatarFallback>
        </Avatar>
        <div className="mx-2 py-2 px-4 rounded-lg bg-secondary text-secondary-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    </div>
  );
}
