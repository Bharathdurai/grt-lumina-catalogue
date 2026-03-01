import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories, products } from "@/data/products";
import { useGoldRate } from "@/contexts/GoldRateContext";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const { goldRate } = useGoldRate();
  const featured = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="GRT Jewellery Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <p className="text-gold-light font-body text-sm uppercase tracking-[0.3em] mb-3">Since 1964</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
              Timeless Elegance, Crafted in Gold
            </h1>
            <p className="text-primary-foreground/80 font-body text-base md:text-lg mb-8">
              Discover exquisite jewellery collections handcrafted with precision and passion. Today's gold rate: ₹{goldRate.toLocaleString("en-IN")}/g
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity"
              >
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-6 py-3 rounded-lg font-body hover:bg-primary-foreground/10 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">Browse By</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/shop?category=${cat.name}`}
                className="group block bg-card rounded-xl p-6 text-center shadow-card hover:shadow-elevated border border-border transition-all hover:-translate-y-1"
              >
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <h3 className="font-display font-semibold text-foreground text-sm">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-body">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gold Rate Banner */}
      <section className="gradient-gold py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-primary-foreground">
            <p className="font-body text-sm uppercase tracking-wider opacity-80">Today's Rate</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold">₹{goldRate.toLocaleString("en-IN")}<span className="text-lg font-normal">/gram</span></h3>
          </div>
          <div className="text-primary-foreground text-center md:text-left">
            <p className="font-display text-xl font-semibold">Special Offer: ₹150/gram Discount</p>
            <p className="text-sm opacity-80 font-body">On all gold jewellery purchases</p>
          </div>
          <Link
            to="/shop?metal=Gold"
            className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity"
          >
            Shop Gold →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">Handpicked</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Pieces</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-body font-semibold text-primary hover:underline"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
