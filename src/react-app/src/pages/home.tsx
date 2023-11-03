import { Create } from "../components/home/create";
import { Header } from "../components/home/header";
import { Projects } from "../components/home/projects";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-full">
      <div className="min-h-full max-w-7xl mx-auto pt-12 xl:px-0 px-8">
        <Header />
        <div className="grid grid-cols-[auto] md:grid-cols-[2fr_1fr] gap-6 mt-8 pb-10">
          <Create />
          <Projects />
        </div>
      </div>
    </div>
  );
}
