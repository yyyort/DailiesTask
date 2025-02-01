import checking from "@/assets/logo/loading-check.gif";
import Image from "next/image";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Image src={checking} alt="loading" width={500} height={500} />u
    </div>
  );
}
