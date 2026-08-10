import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Technology } from "@/components/sections/Technology";
import { Process } from "@/components/sections/Process";
import { Doctors } from "@/components/sections/Doctors";
import { Testimonials } from "@/components/sections/Testimonials";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { FAQ } from "@/components/sections/FAQ";
import { LatestBlogs, InsurancePartners, CTA } from "@/components/sections/BlogsAndCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <WhyChooseUs />
      <Technology />
      <Process />
      <Doctors />
      <BeforeAfter />
      <Testimonials />
      <FAQ />
      <LatestBlogs />
      <InsurancePartners />
      <CTA />
    </>
  );
}
