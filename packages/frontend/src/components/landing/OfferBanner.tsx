import { Link } from 'react-router-dom';

const parisHighlights = [
  {
    id: 'seine',
    title: 'Billetterie Officielle JO 2024',
    description:
      "Vivez l'expérience unique des Jeux Olympiques 2024 à Paris. Réservez dès maintenant vos billets officiels en toute sécurité.",
    image:
      'https://cdn.prod.website-files.com/64e5b997fb8451552f7fd7c9/64f753cec675da6c5b682c1a_banniere-jo-intramuros.jpg',
    delay: 0.8,
  },
];

export function OfferBanner() {
  return (
    <section className="flex flex-col bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-2 sm:px-4 pb-6 sm:pb-10">
        {parisHighlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${200 + index * 200}ms` }}
          >
            <div className="aspect-[21/9] sm:aspect-[21/7] w-full overflow-hidden">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-start bg-gradient-to-r from-black/80 via-black/50 to-transparent p-4 sm:p-8 md:p-12 text-white">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 max-w-2xl">
                {highlight.title}
              </h3>
              <p className="text-start hidden md:block sm:text-xl text-white/90 max-w-2xl mb-4 sm:mb-8">
                {highlight.description}
              </p>
              <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/offres"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-slate-900 rounded-full font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors hover:scale-105 active:scale-95 transition-transform text-base sm:text-lg"
                >
                  Découvrir les offres
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <div className="md:flex flex-col hidden sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-white/90 whitespace-nowrap text-sm sm:text-base">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Billets officiels
                  </div>
                  <div className="flex items-center gap-2 text-white/90 whitespace-nowrap text-sm sm:text-base">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Paiement sécurisé
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
