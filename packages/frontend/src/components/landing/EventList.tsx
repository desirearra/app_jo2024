import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sportsData = [
  {
    id: 'athletics',
    title: 'Athlétisme au Stade de France',
    description:
      'Vivez les performances exceptionnelles des meilleurs athlètes mondiaux dans ce temple mythique du sport français. Places limitées !',
    image:
      'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    delay: 0.2,
  },
  {
    id: 'swimming',
    title: 'Natation à La Défense Arena',
    description:
      "Soyez aux premières loges pour voir naître de nouveaux records olympiques dans la plus grande salle d'Europe !",
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1920',
    delay: 0.4,
  },
  {
    id: 'gymnastics',
    title: 'Gymnastique à Bercy',
    description:
      "Réservez vos places pour assister aux performances spectaculaires des meilleurs gymnastes du monde à l'Accor Arena !",
    image:
      'https://plus.unsplash.com/premium_photo-1721755913670-5d20e710df72?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    delay: 0.6,
  },
];

export function EventList() {
  return (
    <section className="flex flex-col bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-4 py-10">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Participez aux événements</h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Ne manquez pas l&apos;occasion unique d&apos; de participer aux événements sportifs les
            plus excitants du monde.
          </p>
        </motion.div>

        {/* Section Sports */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          {sportsData.map(sport => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sport.delay }}
              className="flex-1 relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src={sport.image}
                  alt={sport.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{sport.title}</h3>
                <p className="text-sm text-white/90 line-clamp-2 mb-4">{sport.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="self-start px-6 py-2.5 bg-white text-slate-900 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  <Link to="/evenements" className="flex items-center gap-2">
                    <>
                      Découvrir l&apos;événement
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
