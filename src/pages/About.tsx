import { motion } from "framer-motion";

const About = () => (
  <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">Our Story</p>
      <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8">About GRT Jewellery</h1>

      <div className="prose prose-lg font-body text-muted-foreground space-y-6">
        <p>
          Since 1964, GRT Jewellery has been a trusted name in fine jewellery craftsmanship. What began as a small family-run
          store in Chennai has grown into one of South India's most beloved jewellery brands, serving generations of families
          with timeless pieces.
        </p>
        <p>
          Every piece in our collection is a testament to our commitment to quality, purity, and artistry. From traditional
          temple jewellery to contemporary designs, we blend heritage with modern aesthetics to create jewellery that transcends
          time.
        </p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-12">Our Vision</h2>
        <p>
          To be the most trusted jewellery brand in India, offering unmatched quality, transparent pricing, and designs that
          celebrate every milestone of life.
        </p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          {[
            { title: "Purity", desc: "BIS Hallmarked gold with certified purity in every piece" },
            { title: "Craftsmanship", desc: "Handcrafted by master artisans with decades of expertise" },
            { title: "Trust", desc: "Transparent pricing and lifetime exchange policies" },
            { title: "Heritage", desc: "60+ years of serving families across generations" },
          ].map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default About;
