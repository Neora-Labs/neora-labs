import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Values } from "@/components/sections/Values";

export default function Home() {
  return (
    <main id="contenido">
      <Hero />
      <Positioning />
      <Services />
      <Process />
      <Values />
    </main>
  );
}
