import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const features = ['Billets officiels', 'Paiement sécurisé', 'QR Code unique'] as const;

// Couleurs de la France
const colors = {
  blue: '#002395',
  red: '#ED2939',
};

// Chemins des coups de pinceau
const brushStrokes = {
  topRight: 'M100,0 Q300,100 400,50 T600,100',
  bottomLeft: 'M0,400 Q200,500 300,450 T500,500',
  middle: 'M-100,200 Q100,300 200,250 T400,300',
};

// URL de vérification du billet (fictive)
const ticketVerificationUrl = 'https://tickets.paris2024.org/verify/';
const uniqueTicketId = 'DEMO-2024-JO-PARIS';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-16 flex items-center">
      {/* Grands anneaux décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grand anneau bleu */}
        <motion.div
          className="absolute -top-[20%] -left-[5%] w-[500px] h-[500px] z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke={colors.blue}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            />
          </motion.svg>
        </motion.div>

        {/* Grand anneau rouge */}
        <motion.div
          className="absolute top-[5%] left-[15%] w-[400px] h-[400px] z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="100"
              cy="100"
              r="98"
              fill="none"
              stroke={colors.red}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: 0.3,
                ease: 'easeInOut',
              }}
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Coups de pinceau animés */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Trait bleu en haut à droite */}
        <motion.svg
          className="absolute top-0 right-0 w-[600px] h-[200px] opacity-20"
          viewBox="0 0 600 200"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <motion.path
            d={brushStrokes.topRight}
            stroke={colors.blue}
            strokeWidth="80"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>

        {/* Trait rouge en bas à gauche */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[500px] h-[200px] opacity-20"
          viewBox="0 0 500 200"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
        >
          <motion.path
            d={brushStrokes.bottomLeft}
            stroke={colors.red}
            strokeWidth="80"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>

        {/* Trait bleu au milieu */}
        <motion.svg
          className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[200px] opacity-10"
          viewBox="0 0 400 200"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.1 }}
          transition={{ duration: 2, delay: 1, ease: 'easeInOut' }}
        >
          <motion.path
            d={brushStrokes.middle}
            stroke={colors.blue}
            strokeWidth="60"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>
      </div>

      <div className="relative w-full mx-auto max-w-[88rem] sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Contenu texte */}
          <div className="relative z-10 flex-1 w-full lg:max-w-[50%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Billetterie Officielle JO 2024
              </h1>
              <p className="text-lg text-slate-600">
                Vivez l&apos;expérience unique des Jeux Olympiques 2024 à Paris. Réservez vos
                billets officiels en toute sécurité.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full"
                  >
                    <Link to="/offres">Découvrir les offres</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8"
            >
              <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 1.5 + index * 0.2 }}
                        className="h-5 w-5 text-slate-900 flex items-center justify-center"
                      >
                        ✓
                      </motion.div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{feature}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Image et animation */}
          <div className="relative flex-1 w-full lg:max-w-[50%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative w-full"
            >
              <div className="relative rounded-2xl bg-white shadow-2xl aspect-[5/3] overflow-hidden w-full">
                {/* Formes abstraites */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute inset-0 flex"
                >
                  {/* Partie gauche avec formes abstraites */}
                  <div className="w-2/3 h-full relative overflow-hidden">
                    {/* Cercle bleu */}
                    <div
                      className="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${colors.blue}40, ${colors.blue}20)`,
                        filter: 'blur(40px)',
                      }}
                    />
                    {/* Cercle rouge */}
                    <div
                      className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full"
                      style={{
                        background: `linear-gradient(45deg, ${colors.red}40, ${colors.red}20)`,
                        filter: 'blur(40px)',
                      }}
                    />
                    {/* Lignes décoratives */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, ${colors.blue}10 25%, transparent 25%),
                          linear-gradient(135deg, ${colors.red}10 50%, transparent 50%)
                        `,
                        backgroundSize: '300px 300px',
                      }}
                    />
                  </div>

                  {/* Partie droite avec QR Code */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-center p-6 bg-white">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.6 }}
                      className="w-32 h-32 bg-white p-2 mb-6"
                    >
                      <QRCodeSVG
                        value={`${ticketVerificationUrl}${uniqueTicketId}`}
                        size={112}
                        level="H"
                        includeMargin={true}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        imageSettings={{
                          src: 'https://img.olympics.com/images/image/private/w_300/f_auto/primary/gpo3co3bpkqsikyznrns',
                          x: undefined,
                          y: undefined,
                          height: 24,
                          width: 24,
                          excavate: true,
                        }}
                      />
                    </motion.div>
                    <div className="text-center">
                      <motion.img
                        src="https://img.olympics.com/images/image/private/w_300/f_auto/primary/gpo3co3bpkqsikyznrns"
                        alt="Logo Officiel JO Paris 2024"
                        className="w-32 h-auto object-contain mx-auto"
                        style={{ mixBlendMode: 'multiply' }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                      />
                      <motion.div
                        className="mt-4 text-sm font-bold text-slate-900"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2 }}
                      >
                        26 juillet - 11 août 2024
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Effet de brillance */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 1.5,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transform: 'skewX(-20deg)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
