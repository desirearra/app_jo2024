import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const features = ['Billets officiels', 'Paiement sécurisé', 'QR Code unique'] as const;

// URL de vérification du billet (fictive)
const ticketVerificationUrl = 'https://tickets.paris2024.org/verify/';
const uniqueTicketId = 'DEMO-2024-JO-PARIS';

export function HeroSection() {
  return (
    <section className="relative flex-col overflow-hidden bg-white py-16 sm:py-16 flex items-center">
      {/* Anneaux olympiques décoratifs */}
      {/* <OlympicRings className="absolute inset-0 pointer-events-none" /> */}
      <div className="w-full relative h-[50vh] overflow-hidden">
        <img
          src={
            'https://il.srgssr.ch/images/?imageUrl=https%3A%2F%2Fimg.rts.ch%2Fmedias%2F2024%2Fimage%2Fu5itu0-28596283.image%2F16x9&format=jpg&width=1920'
          }
          alt={'JO 2024'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {/* {eventDetails.category} */}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {/* {eventDetails.title} */}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">{/* {eventDetails.description} */}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full mx-auto max-w-[88rem] sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Contenu texte */}
          <div className="relative z-10 flex-1 w-full lg:max-w-[50%]">
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Billetterie Officielle JO 2024
              </h1>
              <p className="text-lg text-slate-600">
                Vivez l&apos;expérience unique des Jeux Olympiques 2024 à Paris. Réservez vos
                billets officiels en toute sécurité.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                  <Link to="/offres">Découvrir les offres</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 animate-fade-in [animation-delay:200ms]">
              <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <div className="h-5 w-5 text-slate-900 flex items-center justify-center animate-fade-in [animation-delay:600ms]">
                        ✓
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image et animation */}
          <div className="relative flex-1 w-full lg:max-w-[50%]">
            <div className="relative w-full animate-fade-in-up [animation-delay:200ms]">
              <div className="relative rounded-2xl bg-[#161638] shadow-2xl aspect-[5/3] overflow-hidden w-full">
                <div className="absolute inset-0 flex">
                  {/* Partie gauche avec l'image */}
                  <div className="w-[60%] h-full relative overflow-hidden">
                    {/* Image de fond */}
                    <img
                      src="https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=2139&auto=format&fit=crop&ixlib=rb-4.1.0"
                      alt="Fond décoratif"
                      className="w-full h-full object-cover brightness-90"
                    />
                    {/* Overlay pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-blue-900/20 to-transparent" />
                  </div>

                  {/* Partie droite avec QR Code, Logo et Date (2/5) */}
                  <div className="w-[40%] h-full flex flex-col items-center justify-between p-6 bg-white/95">
                    {/* Logo JO */}
                    <img
                      src="https://img.olympics.com/images/image/private/w_300/f_auto/primary/gpo3co3bpkqsikyznrns"
                      alt="Logo JO Paris 2024"
                      className="w-20 h-auto mb-4"
                    />

                    {/* QR Code - Taille réduite */}
                    <div className="w-24 aspect-square bg-white rounded-lg">
                      <QRCodeSVG
                        value={`${ticketVerificationUrl}${uniqueTicketId}`}
                        className="w-full h-full"
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    {/* Date */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-slate-500">Date de l&apos;événement</p>
                      <p className="text-lg font-semibold text-slate-900">
                        26 Juillet - 11 Août 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
