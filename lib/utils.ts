import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const excludedExtensions = ["png", "jpg", "jpeg", "ico", ".woff"];
export function isExcludedFile(fileName: string) {
  return (
    fileName === "package-lock.json" ||
    excludedExtensions.some((ext) => fileName.endsWith(ext))
  );
}
