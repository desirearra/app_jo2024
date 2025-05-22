import { motion } from 'framer-motion';
import { EventList } from './EventList';
import { OfferCTA } from './OfferCTA';

export function ContentSection() {
  return (
    <>
      <EventList />
      {/* En-tête de section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-16"
      >
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Réservez vos places</h2>
        <p className="text-xl text-slate-600 text-center max-w-3xl">
          Ne manquez pas l&apos;occasion unique d&apos;assister aux Jeux Olympiques de Paris 2024.
          Sécurisez vos billets maintenant !
        </p>
      </motion.div>
      <OfferCTA />
    </>
  );
}
