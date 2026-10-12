import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Nav } from "@/components/Nav";
import { StorySection } from "@/components/story/StorySection";
import { Intro } from "@/components/sections/Intro";
import { Benefits } from "@/components/sections/Benefits";
import { Collection } from "@/components/sections/Collection";
import { Showcase } from "@/components/sections/Showcase";
import { BrandStory } from "@/components/sections/BrandStory";
import { Sourcing } from "@/components/sections/Sourcing";
import { Shop } from "@/components/sections/Shop";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <CartProvider>
        <Nav />
        <CartDrawer />
        <main id="top">
          {/* Reference-derived: white coconut hero → brown KEEP SIPPING → yellow PALMO */}
          <StorySection />

          {/* Additional sections, continuing the reference's design language */}
          <Intro />
          <Benefits />
          <Collection />
          <Showcase />
          <BrandStory />
          <Sourcing />
          <Shop />
        </main>
        <Footer />
      </CartProvider>
    </SmoothScroll>
  );
}
