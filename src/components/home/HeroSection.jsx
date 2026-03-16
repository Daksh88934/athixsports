"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import styles from "./HeroSection.module.css";
import ThreeDShirt from "./ThreeDShirt";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundGlow}></div>

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.badge}
          >
            <Star size={16} fill="var(--primary)" color="var(--primary)" />
            <span>Over 9+ Years of Excellence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`heading-1 ${styles.title}`}
          >
            WEAR THE <span className="text-gradient">WIN.</span>
            <br />
            DOMINATE THE <span className="text-gradient">GAME.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.subtitle}
          >
            High-performance custom sportswear tailored for athletes,
            academies, and champions. Designed in India, crafted for greatness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.ctaGroup}
          >
            <Link href="/products" className="btn-primary">
              Explore Collection <ArrowRight size={18} />
            </Link>

            <Link href="/custom-builder" className="btn-outline">
              Customize Your Jersey
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={styles.stats}
          >
            <div className={styles.statItem}>
              <h3>1.2L+</h3>
              <p>Jerseys Delivered</p>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <h3>2700+</h3>
              <p>Happy Clients</p>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <h3>420+</h3>
              <p>Locations Served</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.imageWrapper}
        >
          <motion.div
            className={styles.imagePlaceholder}
            style={{
              background: "none",
              boxShadow: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              perspective: "1000px"
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
              <ThreeDShirt />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}