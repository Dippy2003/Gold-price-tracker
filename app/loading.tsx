import Image from "next/image";
import vector from "@/Vector.svg";

export default function Loading() {
  return (
    <main className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f0ea]/75 backdrop-blur-md">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-white/70 blur-sm" />
        <div className="relative flex h-28 w-28 items-center justify-center">
          <Image
            src={vector}
            alt="Loading"
            priority
            className="h-16 w-16 select-none object-contain opacity-95 animate-spin"
          />
        </div>
      </div>
    </main>
  );
}
