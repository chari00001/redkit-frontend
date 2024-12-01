import Image from "next/image";
import PostCard from "@/components/PostComponents/PostCard";
import PopularCommunities from "@/components/PopularCommunities";
import Feed from "@/components/Feed/Feed";
import HomeSlider from "@/components/HomeSlider/HomeSlider";

export default function Home() {
  return (
    <div className="mt-20 flex flex-col gap-8 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <HomeSlider />
      <div className="flex justify-center gap-8">
        <div className="flex flex-col gap-2">
          <Feed/>
        </div>
        <PopularCommunities />
      </div>
    </div>
  );
}
