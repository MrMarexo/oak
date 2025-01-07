import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
};

export const isEmtpyObject = (obj: Record<string, unknown>) => {
  return Object.keys(obj).length === 0;
};
