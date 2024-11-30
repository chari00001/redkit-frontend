import Image from "next/image";
import PostCard from "@/components/PostComponents/PostCard";
import PopularCommunities from "@/components/PopularCommunities";

export default function Home() {
  return (
    <div className="mt-20 flex justify-center gap-8 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-2">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
      <PopularCommunities />
    </div>
  );
}
