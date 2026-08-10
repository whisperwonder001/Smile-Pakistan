export type ServiceCategory =
  | "Restorative"
  | "Cosmetic"
  | "Surgical & Preventive"
  | "Family & Diagnostics";

export interface Service {
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDesc: string;
  overview: string;
  duration: string;
  priceFrom: number;
  priceTo: number;
  benefits: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const categoryImage: Record<ServiceCategory, string> = {
  Restorative:
    "https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1400&q=70",
  Cosmetic:
    "https://images.unsplash.com/photo-1643660526741-094639fbe53a?auto=format&fit=crop&w=1400&q=70",
  "Surgical & Preventive":
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=70",
  "Family & Diagnostics":
    "https://images.unsplash.com/photo-1522849696084-818b29dfe210?auto=format&fit=crop&w=1400&q=70",
};

export function imageForCategory(category: ServiceCategory) {
  return categoryImage[category];
}

export const services: Service[] = [
  {
    slug: "dental-fillings",
    title: "Dental Fillings",
    category: "Restorative",
    shortDesc: "Tooth-coloured composite fillings that restore cavities in a single visit.",
    overview:
      "A filling repairs a tooth damaged by decay by removing the decayed material and rebuilding the tooth with a durable, tooth-coloured composite resin. Most fillings are completed in one visit with local anaesthesia.",
    duration: "30–45 minutes",
    priceFrom: 3000,
    priceTo: 8000,
    benefits: [
      "Matches natural tooth colour",
      "Stops decay from spreading further",
      "Completed in a single appointment",
      "Preserves more of the natural tooth than a crown",
    ],
    steps: [
      { title: "Digital X-ray", desc: "We confirm the extent of decay before any drilling begins." },
      { title: "Local anaesthesia", desc: "The area is numbed so the procedure is pain-free." },
      { title: "Decay removal", desc: "Decayed material is carefully removed." },
      { title: "Composite placement", desc: "The tooth is rebuilt in layers and shaped to your bite." },
    ],
    faqs: [
      { q: "Will the filling be visible?", a: "No — composite resin is shade-matched to your surrounding teeth." },
      { q: "How long do fillings last?", a: "With good oral hygiene, composite fillings typically last 7–10 years." },
    ],
  },
  {
    slug: "root-canal-treatment",
    title: "Root Canal Treatment",
    category: "Restorative",
    shortDesc: "Save an infected tooth by removing damaged pulp and sealing the canal.",
    overview:
      "When decay or injury reaches the tooth's pulp, a root canal removes the infected tissue, cleans and shapes the canal, and seals it — relieving pain and saving the natural tooth instead of extracting it.",
    duration: "60–90 minutes, sometimes over 2 visits",
    priceFrom: 12000,
    priceTo: 30000,
    benefits: [
      "Relieves pain from an infected tooth",
      "Saves the natural tooth from extraction",
      "Digital X-rays confirm complete canal cleaning",
      "Usually followed by a protective crown",
    ],
    steps: [
      { title: "Diagnosis", desc: "A digital X-ray locates the infection and maps canal anatomy." },
      { title: "Pulp removal", desc: "Infected pulp tissue is removed under local anaesthesia." },
      { title: "Cleaning & shaping", desc: "The canal is disinfected and shaped for sealing." },
      { title: "Sealing & crown", desc: "The canal is filled and a crown is placed to protect the tooth." },
    ],
    faqs: [
      { q: "Is a root canal painful?", a: "The procedure itself is done under local anaesthesia; most patients report less pain than the infection caused." },
      { q: "Do I need a crown afterward?", a: "Usually yes — a crown protects the tooth, which becomes more brittle after treatment." },
    ],
  },
  {
    slug: "crowns",
    title: "Crowns",
    category: "Restorative",
    shortDesc: "Custom caps that restore the strength, shape and appearance of a damaged tooth.",
    overview:
      "A crown fully covers a tooth that's too damaged for a filling — after root canal treatment, a large fracture, or significant wear — restoring its shape, strength, and bite function.",
    duration: "2 visits, 1–2 weeks apart",
    priceFrom: 15000,
    priceTo: 45000,
    benefits: [
      "Restores full chewing function",
      "Protects a weakened tooth from fracture",
      "Available in porcelain, zirconia, or metal-ceramic",
      "Blends naturally with surrounding teeth",
    ],
    steps: [
      { title: "Tooth preparation", desc: "The tooth is shaped to receive the crown." },
      { title: "Digital impression", desc: "A precise scan is sent to the dental lab." },
      { title: "Temporary crown", desc: "A temporary crown protects the tooth while the permanent one is made." },
      { title: "Final fitting", desc: "The custom crown is cemented and your bite is checked." },
    ],
    faqs: [
      { q: "How long does a crown last?", a: "10–15 years on average with proper care." },
      { q: "Which material should I choose?", a: "Your dentist will recommend based on the tooth's location and your bite force." },
    ],
  },
  {
    slug: "bridges",
    title: "Bridges",
    category: "Restorative",
    shortDesc: "A fixed replacement for one or more missing teeth, anchored to neighbouring teeth.",
    overview:
      "A bridge fills the gap left by missing teeth using a false tooth (pontic) fused between two crowns, anchored to the healthy teeth on either side of the gap.",
    duration: "2–3 visits",
    priceFrom: 25000,
    priceTo: 80000,
    benefits: [
      "Restores chewing and speech function",
      "Prevents neighbouring teeth from shifting",
      "Fixed in place — no removal needed",
      "Maintains natural facial shape",
    ],
    steps: [
      { title: "Assessment", desc: "We evaluate whether anchor teeth are healthy enough to support a bridge." },
      { title: "Preparation", desc: "Anchor teeth are shaped for crowns." },
      { title: "Impression", desc: "A digital scan guides fabrication of the bridge." },
      { title: "Fitting", desc: "The finished bridge is cemented and adjusted for a natural bite." },
    ],
    faqs: [
      { q: "Bridge or implant?", a: "Your dentist will compare based on the health of neighbouring teeth and your budget." },
      { q: "How do I clean under a bridge?", a: "A floss threader or water flosser keeps the area under the pontic clean." },
    ],
  },
  {
    slug: "dentures",
    title: "Dentures",
    category: "Restorative",
    shortDesc: "Removable full or partial replacements for missing teeth.",
    overview:
      "Dentures replace some or all missing teeth with a removable appliance custom-fitted to your gums, restoring your ability to eat and speak comfortably.",
    duration: "3–5 visits over 2–4 weeks",
    priceFrom: 20000,
    priceTo: 90000,
    benefits: [
      "Restores appearance and chewing ability",
      "Available as full or partial dentures",
      "Custom-fitted for comfort",
      "Non-surgical option for tooth replacement",
    ],
    steps: [
      { title: "Impressions", desc: "Detailed impressions of your gums and remaining teeth are taken." },
      { title: "Bite registration", desc: "Your bite alignment is recorded for a natural fit." },
      { title: "Trial fitting", desc: "A trial denture is checked for fit and appearance." },
      { title: "Final fitting", desc: "The finished denture is adjusted for comfort." },
    ],
    faqs: [
      { q: "Will dentures feel natural right away?", a: "There's an adjustment period of a few weeks as your mouth adapts." },
      { q: "How often are relines needed?", a: "Typically every 1–2 years as your gum shape changes." },
    ],
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    category: "Cosmetic",
    shortDesc: "Clinically supervised whitening for a brighter, natural-looking smile.",
    overview:
      "In-office whitening uses a controlled bleaching gel and light to lift years of staining safely, typically brightening teeth several shades in a single session.",
    duration: "45–60 minutes",
    priceFrom: 15000,
    priceTo: 35000,
    benefits: [
      "Visible results in one visit",
      "Supervised for gum and enamel safety",
      "Stronger, longer-lasting results than home kits",
      "Custom take-home trays available",
    ],
    steps: [
      { title: "Shade check", desc: "Your current shade is recorded to measure results." },
      { title: "Gum protection", desc: "Gums are isolated to protect them from the whitening gel." },
      { title: "Whitening application", desc: "Gel is applied in cycles, activated with a curing light." },
      { title: "Final shade check", desc: "Results are compared and aftercare guidance is given." },
    ],
    faqs: [
      { q: "How long do results last?", a: "6–12 months typically, longer with good habits and touch-ups." },
      { q: "Is whitening safe for enamel?", a: "Yes, when supervised — over-the-counter overuse is the real risk." },
    ],
  },
  {
    slug: "veneers",
    title: "Veneers",
    category: "Cosmetic",
    shortDesc: "Thin porcelain shells that reshape and brighten the front of your teeth.",
    overview:
      "Veneers are custom, ultra-thin porcelain shells bonded to the front of teeth to correct chips, gaps, discolouration, or shape — a core building block of smile makeovers.",
    duration: "2–3 visits",
    priceFrom: 25000,
    priceTo: 60000,
    benefits: [
      "Corrects chips, gaps, and discolouration in one treatment",
      "Porcelain resists staining long-term",
      "Minimal tooth reduction compared to crowns",
      "Natural, light-reflecting appearance",
    ],
    steps: [
      { title: "Smile design", desc: "We plan shape and shade based on your facial proportions." },
      { title: "Minimal preparation", desc: "A thin layer of enamel is prepared for bonding." },
      { title: "Digital impression", desc: "Veneers are custom-fabricated to the design." },
      { title: "Bonding", desc: "Veneers are bonded and polished for a natural finish." },
    ],
    faqs: [
      { q: "Are veneers reversible?", a: "No — a small amount of enamel is removed, so the process is permanent." },
      { q: "How long do veneers last?", a: "10–15 years with proper care." },
    ],
  },
  {
    slug: "smile-makeover",
    title: "Smile Makeover",
    category: "Cosmetic",
    shortDesc: "A tailored combination of treatments designed around your ideal smile.",
    overview:
      "A smile makeover combines cosmetic and restorative treatments — whitening, veneers, alignment, or gum contouring — planned together as a single, cohesive treatment roadmap.",
    duration: "Varies by plan — typically 3–8 weeks",
    priceFrom: 60000,
    priceTo: 250000,
    benefits: [
      "One coordinated plan instead of piecemeal treatments",
      "Digital smile design preview before committing",
      "Combines whichever treatments your case needs",
      "Staged pricing so you know costs upfront",
    ],
    steps: [
      { title: "Consultation & imaging", desc: "Digital photos and X-rays map your current smile." },
      { title: "Digital smile design", desc: "You preview a mock-up of your planned result." },
      { title: "Treatment sequencing", desc: "Procedures are scheduled in the right clinical order." },
      { title: "Execution & review", desc: "Each stage is reviewed against the original design." },
    ],
    faqs: [
      { q: "How is pricing determined?", a: "After the consultation, once we know exactly which treatments your case needs." },
      { q: "Can I see results before starting?", a: "Yes — digital smile design gives you a preview mock-up first." },
    ],
  },
  {
    slug: "clear-aligners",
    title: "Clear Aligners",
    category: "Cosmetic",
    shortDesc: "Nearly invisible, removable trays that gradually straighten teeth.",
    overview:
      "Clear aligners are a series of custom, removable trays that gradually shift teeth into alignment — a discreet alternative to metal braces for mild-to-moderate cases.",
    duration: "4–14 months depending on case",
    priceFrom: 90000,
    priceTo: 250000,
    benefits: [
      "Virtually invisible compared to metal braces",
      "Removable for eating and brushing",
      "Fewer in-clinic visits than traditional braces",
      "Digital treatment preview before you start",
    ],
    steps: [
      { title: "3D scan", desc: "A digital scan replaces uncomfortable physical impressions." },
      { title: "Treatment plan", desc: "Software maps the full sequence of tooth movement." },
      { title: "Aligner series", desc: "You wear each tray for 1–2 weeks, progressing through the series." },
      { title: "Progress checks", desc: "Periodic visits confirm teeth are moving on schedule." },
    ],
    faqs: [
      { q: "How many hours a day should I wear them?", a: "20–22 hours daily for the treatment to stay on schedule." },
      { q: "Do aligners hurt?", a: "Mild pressure for a day or two after switching trays is normal." },
    ],
  },
  {
    slug: "dental-implants",
    title: "Dental Implants",
    category: "Surgical & Preventive",
    shortDesc: "Titanium tooth-root replacements that restore full bite strength.",
    overview:
      "An implant replaces a missing tooth's root with a titanium post surgically placed in the jawbone, which fuses with bone over several months before a crown is attached — the closest replica to a natural tooth.",
    duration: "3–6 months, across multiple stages",
    priceFrom: 80000,
    priceTo: 180000,
    benefits: [
      "Does not rely on neighbouring teeth for support",
      "Restores near-natural bite strength",
      "Prevents jawbone loss at the missing tooth site",
      "3D-planned for precise, predictable placement",
    ],
    steps: [
      { title: "3D imaging & planning", desc: "A scan maps bone density and the ideal implant position." },
      { title: "Implant placement", desc: "The titanium post is placed under local anaesthesia." },
      { title: "Osseointegration", desc: "Over 2–4 months, the implant fuses with the jawbone." },
      { title: "Crown attachment", desc: "A custom crown is attached to complete the restoration." },
    ],
    faqs: [
      { q: "Am I a candidate for implants?", a: "Most healthy adults with adequate jawbone are candidates — we confirm with 3D imaging." },
      { q: "Is the procedure painful?", a: "It's done under local anaesthesia; mild soreness afterward is managed with medication." },
    ],
  },
  {
    slug: "wisdom-tooth-extraction",
    title: "Wisdom Tooth Extraction",
    category: "Surgical & Preventive",
    shortDesc: "Safe removal of impacted or problematic third molars.",
    overview:
      "When wisdom teeth are impacted, crowded, or causing pain and infection risk, they're removed surgically or with a simple extraction, depending on how they're positioned.",
    duration: "20–60 minutes per tooth",
    priceFrom: 8000,
    priceTo: 25000,
    benefits: [
      "Relieves pain and pressure from impacted teeth",
      "Prevents infection and crowding of neighbouring teeth",
      "Digital X-ray confirms root position beforehand",
      "Sedation options available for anxious patients",
    ],
    steps: [
      { title: "X-ray assessment", desc: "We confirm the tooth's position and root proximity to nerves." },
      { title: "Anaesthesia", desc: "The area is numbed; sedation is available if needed." },
      { title: "Extraction", desc: "The tooth is removed, surgically if impacted." },
      { title: "Aftercare guidance", desc: "You're given instructions to support fast, safe healing." },
    ],
    faqs: [
      { q: "Do all wisdom teeth need removal?", a: "No — only when impacted, decayed, or causing crowding/pain." },
      { q: "How long is recovery?", a: "Most people return to normal activity within 3–5 days." },
    ],
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    category: "Surgical & Preventive",
    shortDesc: "Surgical procedures for complex extractions, cysts, and jaw conditions.",
    overview:
      "Beyond routine extractions, our oral surgery service covers complex tooth removals, cyst and lesion removal, and minor jaw procedures, performed with imaging-guided precision.",
    duration: "Varies by procedure",
    priceFrom: 15000,
    priceTo: 100000,
    benefits: [
      "Handled by an oral & maxillofacial specialist",
      "3D imaging for precise surgical planning",
      "Sedation options for complex procedures",
      "Coordinated with restorative follow-up care",
    ],
    steps: [
      { title: "Diagnostic imaging", desc: "X-rays or 3D scans map the surgical site." },
      { title: "Surgical planning", desc: "Your surgeon outlines the procedure and recovery plan." },
      { title: "Procedure", desc: "Performed under local or sedation anaesthesia as needed." },
      { title: "Follow-up care", desc: "Healing is monitored with scheduled follow-up visits." },
    ],
    faqs: [
      { q: "Will I need a specialist referral?", a: "No — you can book directly with our oral & maxillofacial surgeon." },
      { q: "What sedation options exist?", a: "Local anaesthesia is standard; deeper sedation is available for complex cases." },
    ],
  },
  {
    slug: "scaling-polishing",
    title: "Scaling & Polishing",
    category: "Surgical & Preventive",
    shortDesc: "Professional cleaning to remove plaque, tartar, and surface stains.",
    overview:
      "Scaling removes hardened plaque (tartar) from above and below the gumline that brushing can't reach, followed by polishing to smooth and brighten the tooth surface.",
    duration: "30–45 minutes",
    priceFrom: 3000,
    priceTo: 7000,
    benefits: [
      "Prevents gum disease and cavities",
      "Removes surface stains from tea, coffee, or tobacco",
      "Freshens breath",
      "Recommended every 6 months",
    ],
    steps: [
      { title: "Assessment", desc: "Gums and tartar buildup are checked." },
      { title: "Scaling", desc: "Tartar is removed using ultrasonic and hand instruments." },
      { title: "Polishing", desc: "Teeth are polished to a smooth, stain-resistant finish." },
      { title: "Fluoride (optional)", desc: "A fluoride treatment can be added for extra protection." },
    ],
    faqs: [
      { q: "Does scaling damage enamel?", a: "No — it removes tartar from the tooth surface without harming enamel." },
      { q: "How often should I get this done?", a: "Every 6 months is the general recommendation." },
    ],
  },
  {
    slug: "preventive-dentistry",
    title: "Preventive Dentistry",
    category: "Surgical & Preventive",
    shortDesc: "Routine check-ups and early intervention to catch problems before they start.",
    overview:
      "Preventive care — regular check-ups, digital X-rays, sealants, and fluoride treatments — catches issues like early decay or gum inflammation before they become painful or costly.",
    duration: "20–30 minutes per check-up",
    priceFrom: 2000,
    priceTo: 6000,
    benefits: [
      "Catches decay before it needs a filling",
      "Reduces long-term treatment costs",
      "Includes digital X-ray review with your dentist",
      "Recommended twice yearly",
    ],
    steps: [
      { title: "Oral exam", desc: "A full visual and digital check of teeth and gums." },
      { title: "X-ray review", desc: "Any areas of concern are confirmed with imaging." },
      { title: "Risk assessment", desc: "Your dentist flags anything needing early attention." },
      { title: "Care plan", desc: "You leave with a clear plan for the next 6 months." },
    ],
    faqs: [
      { q: "How often should I visit?", a: "Twice a year for most patients, more often if you're higher risk." },
      { q: "Are sealants worth it for kids?", a: "Yes — they significantly reduce cavity risk on molars." },
    ],
  },
  {
    slug: "braces",
    title: "Braces",
    category: "Family & Diagnostics",
    shortDesc: "Traditional fixed braces for moderate to complex alignment correction.",
    overview:
      "Metal or ceramic braces use brackets and wires to gradually move teeth into correct alignment — the most predictable option for moderate to severe crowding, gaps, or bite issues.",
    duration: "12–24 months",
    priceFrom: 70000,
    priceTo: 180000,
    benefits: [
      "Handles complex cases aligners can't",
      "Ceramic (tooth-coloured) options available",
      "Predictable, well-established results",
      "Suitable for both teens and adults",
    ],
    steps: [
      { title: "Orthodontic assessment", desc: "X-rays and impressions map your bite and alignment." },
      { title: "Bracket placement", desc: "Brackets are bonded to each tooth and connected with wire." },
      { title: "Monthly adjustments", desc: "Wires are tightened periodically to guide movement." },
      { title: "Retention phase", desc: "A retainer holds teeth in place after braces come off." },
    ],
    faqs: [
      { q: "Braces or clear aligners?", a: "Your orthodontist will recommend based on how complex your case is." },
      { q: "Do braces hurt?", a: "Mild soreness after adjustments is normal and temporary." },
    ],
  },
  {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    category: "Family & Diagnostics",
    shortDesc: "Gentle, patient-first dental care designed specifically for children.",
    overview:
      "Our pediatric dentists focus on making early dental visits comfortable and educational, covering everything from first check-ups to cavity prevention and sealants for growing teeth.",
    duration: "20–30 minutes per visit",
    priceFrom: 2500,
    priceTo: 8000,
    benefits: [
      "Child-paced, low-pressure appointments",
      "Builds positive associations with dental visits",
      "Focus on prevention — sealants and fluoride",
      "Doctors explain each step directly to the child",
    ],
    steps: [
      { title: "Gentle introduction", desc: "First visits focus on comfort, not treatment." },
      { title: "Check-up", desc: "Teeth and jaw development are checked." },
      { title: "Preventive care", desc: "Sealants or fluoride are applied if recommended." },
      { title: "Parent guidance", desc: "You get tailored home-care tips for your child's age." },
    ],
    faqs: [
      { q: "When should my child's first visit be?", a: "By their first birthday or within 6 months of the first tooth appearing." },
      { q: "Can I stay in the room?", a: "Yes, parents are welcome throughout the visit." },
    ],
  },
  {
    slug: "emergency-dentistry",
    title: "Emergency Dentistry",
    category: "Family & Diagnostics",
    shortDesc: "Same-day appointments for dental pain, trauma, and urgent issues.",
    overview:
      "For severe pain, a knocked-out or broken tooth, or swelling, we hold same-day emergency slots at every branch so urgent issues are seen quickly rather than left to worsen.",
    duration: "Same-day, walk-in or call-ahead",
    priceFrom: 3000,
    priceTo: 20000,
    benefits: [
      "Same-day slots held at every branch",
      "Handles pain, trauma, swelling, and lost restorations",
      "Digital X-ray on-site for immediate diagnosis",
      "Clear next-step plan before you leave",
    ],
    steps: [
      { title: "Call ahead", desc: "Call your nearest branch so we can prepare for your arrival." },
      { title: "Rapid assessment", desc: "Pain and any trauma are assessed immediately." },
      { title: "Stabilising treatment", desc: "Pain relief or temporary repair is provided same-day." },
      { title: "Follow-up plan", desc: "A full treatment plan is scheduled for lasting repair." },
    ],
    faqs: [
      { q: "What counts as a dental emergency?", a: "Severe pain, knocked-out or broken teeth, swelling, or uncontrolled bleeding." },
      { q: "Do I need to call first?", a: "Calling ahead helps us prepare, but walk-ins are accepted." },
    ],
  },
  {
    slug: "digital-x-rays",
    title: "Digital X-rays",
    category: "Family & Diagnostics",
    shortDesc: "Low-radiation digital imaging used to diagnose every treatment plan.",
    overview:
      "Digital X-rays use up to 90% less radiation than traditional film, producing instant, magnifiable images your dentist reviews with you on-screen — the diagnostic foundation for every treatment at Smile Pakistan.",
    duration: "5–10 minutes",
    priceFrom: 1500,
    priceTo: 5000,
    benefits: [
      "90% less radiation than film X-rays",
      "Instant results — no waiting for development",
      "Images reviewed with you on-screen",
      "Safely stored in your digital patient record",
    ],
    steps: [
      { title: "Positioning", desc: "A sensor or panoramic scanner is positioned comfortably." },
      { title: "Capture", desc: "The image is captured in seconds." },
      { title: "Review", desc: "Your dentist reviews the image with you immediately." },
      { title: "Record", desc: "The X-ray is saved to your patient chart for future reference." },
    ],
    faqs: [
      { q: "Is digital X-ray safe during pregnancy?", a: "Routine dental X-rays are generally avoided in pregnancy unless urgent — tell us if you're expecting." },
      { q: "How often will I need X-rays?", a: "Typically once a year for check-ups, more often if actively being treated." },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(service: Service, count = 3) {
  return services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, count);
}
