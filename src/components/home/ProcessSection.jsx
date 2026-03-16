"use client";

import { motion } from "framer-motion";
import { MessageSquare, PenTool, Layout, CheckSquare, FileText, Scissors, Truck, PackageCheck, Map } from "lucide-react";
import styles from "./ProcessSection.module.css";

const processSteps = [
  {
    id: 1,
    title: "Enquire",
    desc: "Drop us a message via social media or email to discuss what you need.",
    icon: MessageSquare,
  },
  {
    id: 2,
    title: "Digital Design",
    desc: "See your product before you order.",
    icon: Layout,
  },
  {
    id: 3,
    title: "Bespoke Design",
    desc: "Every design is tailored to the club colours. We don't limit the design.",
    icon: PenTool,
  },
  {
    id: 4,
    title: "Confirm Sizes & Designs",
    desc: "Sizes and Design will be confirmed with the manufacturer.",
    icon: CheckSquare,
  },
  {
    id: 5,
    title: "Invoice & Payment",
    desc: "Invoice will be provided with terms & conditions and payment confirmation.",
    icon: FileText,
  },
  {
    id: 6,
    title: "Manufacturing",
    desc: "Depending on the product, here are various lead times. Sit back and relax.",
    icon: Scissors,
  },
  {
    id: 7,
    title: "Quick Delivery",
    desc: "Delivery time starting at just 3 To 10 Days.",
    icon: Truck,
  },
  {
    id: 8,
    title: "Received Products",
    desc: "Received your product safely at your location.",
    icon: PackageCheck,
  },
  {
    id: 9,
    title: "Design in India",
    desc: "Our teamwear designed and manufactured proudly in India.",
    icon: Map,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProcessSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={`heading-2 ${styles.title}`}>Our <span className="text-gradient">Process</span></h2>
          <p className={styles.subtitle}>From concept to reality in 9 simple steps</p>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.id} className={styles.card} variants={itemVariants}>
                <div className={styles.cardNumber}>{step.id}</div>
                <div className={styles.iconWrapper}>
                  <Icon size={32} />
                </div>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDesc}>{step.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
