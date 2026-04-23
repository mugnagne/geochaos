import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Trophy, RefreshCcw, ArrowRight, Star, Zap, Target } from 'lucide-react';
import { COUNTRIES } from './data/countries';
import { CATEGORIES } from './data/categories';
import { Country, CategorySpec, GameCategory, GameState, Round } from './types';
import { MaxButton, MaxCard, FloatingShape } from './components/MaximalistComponents';
import { calculateRank } from './lib/gameUtils';
import { FlagShuffle } from './components/FlagShuffle';
import { Info, MapPin, Languages, Coins, Landmark, HelpCircle, XCircle } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('geochaos_coins');
    return saved ? parseInt(saved) : 0;
  });
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [usedCategoryIds, setUsedCategoryIds] = useState<Set<string>>(new Set());
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [revealStatus, setRevealStatus] = useState<'SHUFFLING' | 'REVEALED'>('REVEALED');
  const [showInfo, setShowInfo] = useState(false);
  const [infoCategory, setInfoCategory] = useState<GameCategory | null>(null);

  const totalScore = useMemo(() => rounds.reduce((acc, r) => acc + r.rank, 0), [rounds]);
  const isWinner = totalScore < 200;

  const startNewGame = useCallback(() => {
    // Pick 6 random categories and assign a random direction
    const rawCategories = [...CATEGORIES].sort(() => 0.5 - Math.random()).slice(0, 6);
    const selected: GameCategory[] = rawCategories.map(cat => ({
      ...cat,
      direction: Math.random() > 0.5 ? 'HIGHER' : 'LOWER'
    }));
    
    setGameCategories(selected);
    setUsedCategoryIds(new Set());
    setRounds([]);
    
    // Pick first country
    const firstCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    setCurrentCountry(firstCountry);
    setRevealStatus('SHUFFLING');
    setGameState('PLAYING');
    setShowInfo(false);
  }, [coins]);

  const handleRevealComplete = () => {
    setRevealStatus('REVEALED');
  };

  const handleCategorySelect = (category: GameCategory) => {
    if (usedCategoryIds.has(category.id)) return;
    if (!currentCountry) return;

    // Use our utility to calculate the exact competition rank
    const rank = calculateRank(currentCountry, category, COUNTRIES);
    const value = currentCountry[category.id] as number;

    const newRound: Round = {
      country: currentCountry,
      category,
      rank,
      value
    };

    const nextUsed = new Set(usedCategoryIds);
    nextUsed.add(category.id);
    
    const nextRounds = [...rounds, newRound];
    setRounds(nextRounds);
    setUsedCategoryIds(nextUsed);

    if (nextUsed.size === 6) {
      setGameState('END');
      const newCoins = coins + 10;
      setCoins(newCoins);
      localStorage.setItem('geochaos_coins', newCoins.toString());
    } else {
      // Pick next country (avoiding duplicates if possible)
      const usedCountryNames = nextRounds.map(r => r.country.name);
      const availableCountries = COUNTRIES.filter(c => !usedCountryNames.includes(c.name));
      const nextCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)] || COUNTRIES[0];
      
      // Petit délai pour savourer le rang avant de repartir en shuffle
      setTimeout(() => {
        setCurrentCountry(nextCountry);
        setRevealStatus('SHUFFLING');
        setShowInfo(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full relative p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorations */}
      <FloatingShape type="star" color="#FF3AF2" size="w-24 h-24" top="10%" left="5%" delay={0} />
      <FloatingShape type="circle" color="#00F5D4" size="w-16 h-16" top="20%" left="85%" delay={1} />
      <FloatingShape type="square" color="#FFE600" size="w-20 h-20" top="70%" left="15%" delay={2} />
      <FloatingShape type="star" color="#7B2FFF" size="w-32 h-32" top="80%" left="75%" delay={3} />
      
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div
            key="start"
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotate: 5 }}
            className="text-center z-10 max-w-2xl px-4"
          >
            <h1 className="text-7xl md:text-9xl mb-8 text-shadow-mega text-white">
              GEO<span className="text-accent-yellow">CHAOS</span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-8 bg-max-muted border-4 border-accent-yellow p-4 rounded-2xl w-fit mx-auto shadow-max-yellow animate-pulse">
               <Coins className="text-accent-yellow" size={32} />
               <span className="text-3xl font-black">{coins}</span>
            </div>

            <MaxCard accent="cyan" className="mb-12">
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                6 pays. 6 catégories. <br/>
                Classe-les pour obtenir le <span className="text-accent-magenta">MEILLEUR RANG</span>.<br/>
                Score total <span className="text-accent-yellow">&lt; 150</span> pour gagner !
              </p>
            </MaxCard>
            <div className="flex justify-center w-full">
              <MaxButton onClick={startNewGame} className="text-2xl h-24 px-16 group flex items-center justify-center">
                <span className="flex items-center justify-center gap-4">
                  C'EST PARTI ! <Zap className="group-hover:animate-bounce shrink-0" />
                </span>
              </MaxButton>
            </div>
          </motion.div>
        )}

        {gameState === 'PLAYING' && (
          <motion.div
            key="playing"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Header / Stats Panel */}
            <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 bg-max-muted p-4 rounded-2xl border-4 border-accent-purple shadow-max-cyan">
                <Target className="text-accent-cyan" />
                <span className="font-black text-2xl uppercase">Ronde {rounds.length + 1} / 6</span>
              </div>
              <div className="flex items-center gap-4 bg-max-muted p-4 rounded-2xl border-4 border-accent-yellow p-4 shadow-max-yellow">
                 <Coins className="text-accent-yellow" size={24} />
                 <span className="text-2xl font-black">{coins}</span>
              </div>
              <div className="flex items-center gap-4 bg-max-muted p-4 rounded-2xl border-4 border-accent-magenta shadow-max-yellow">
                <Star className="text-accent-yellow" />
                <span className="font-black text-2xl uppercase">Score: {totalScore}</span>
              </div>
            </div>

            {/* Current Country Card & Category Selection */}
            <div className="lg:col-span-12">
              <AnimatePresence mode="wait">
                {revealStatus === 'SHUFFLING' && currentCountry ? (
                  <motion.div
                    key="shuffling"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full"
                  >
                    <FlagShuffle targetCountry={currentCountry} onComplete={handleRevealComplete} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    <div className="lg:col-span-5 h-full">
                      <MaxCard accent="yellow" className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="w-24 h-24 bg-accent-magenta rounded-full mb-6 flex items-center justify-center border-4 border-white animate-float overflow-hidden shadow-xl">
                          {currentCountry && (
                            <img 
                              src={`https://flagcdn.com/w160/${currentCountry.abbreviation.toLowerCase()}.png`} 
                              className="w-full h-full object-cover"
                              alt="Flag"
                            />
                          )}
                        </div>
                        
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl mb-4 text-shadow-magenta text-white font-black leading-tight break-words w-full">
                          {currentCountry?.name}
                        </h2>
                        
                        <div className="w-full h-2 bg-max-muted rounded-full overflow-hidden mb-4">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(rounds.length) / 6 * 100}%` }}
                            className="h-full bg-accent-cyan"
                          />
                        </div>

                        <MaxButton 
                          variant="secondary" 
                          className="h-12 w-full mb-4 flex items-center justify-center gap-3 border-dashed border-2"
                          onClick={() => setShowInfo(!showInfo)}
                        >
                          {showInfo ? <XCircle size={20} /> : <Target size={20} />}
                          {showInfo ? "CACHER LES INDICES" : "BESOIN D'INDICES ?"}
                        </MaxButton>

                        <AnimatePresence>
                          {showInfo && currentCountry && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="w-full bg-max-bg/50 p-4 rounded-2xl border-2 border-accent-cyan text-left space-y-2 overflow-hidden shadow-inner"
                            >
                              <div className="flex items-center gap-3 text-sm font-bold">
                                <Landmark className="text-accent-yellow shrink-0" size={18} />
                                <span className="text-white/60">Capitale:</span> {currentCountry.capital}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-bold">
                                <Languages className="text-accent-magenta shrink-0" size={18} />
                                <span className="text-white/60">Langue:</span> {currentCountry.officialLanguage}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-bold">
                                <Coins className="text-accent-cyan shrink-0" size={18} />
                                <span className="text-white/60">Monnaie:</span> {currentCountry.currency}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-bold">
                                <MapPin className="text-accent-purple shrink-0" size={18} />
                                <span className="text-white/60">Grande Ville:</span> {currentCountry.largestCity}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </MaxCard>
                    </div>

                    <div className="lg:col-span-7 relative">
                      {/* Floating Info Overlay */}
                      <AnimatePresence>
                        {infoCategory && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute inset-0 z-50 flex items-center justify-center p-4"
                          >
                            <MaxCard accent="purple" className="w-full max-w-sm flex flex-col items-center text-center !bg-max-bg border-style-solid">
                               <HelpCircle className="text-accent-purple mb-4" size={48} />
                               <h4 className="text-2xl font-black uppercase mb-2 text-white">{infoCategory.label}</h4>
                               <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">
                                 {infoCategory.description}
                               </p>
                               <MaxButton onClick={() => setInfoCategory(null)} className="w-full bg-accent-purple">
                                  COMPRIS !
                               </MaxButton>
                            </MaxCard>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {gameCategories.map((cat, idx) => {
                          const isUsed = usedCategoryIds.has(cat.id);
                          const colors = ['magenta', 'cyan', 'yellow', 'orange', 'purple'];
                          const accent = colors[idx % colors.length];
                          
                          return (
                            <motion.div
                              key={cat.id}
                              className="relative"
                            >
                              <motion.button
                                disabled={isUsed}
                                whileHover={!isUsed ? { scale: 1.05, rotate: 1, filter: 'brightness(1.2)' } : {}}
                                whileTap={!isUsed ? { scale: 0.95 } : {}}
                                onClick={() => handleCategorySelect(cat)}
                                className={`relative w-full p-6 pb-12 rounded-2xl border-4 text-left group transition-all duration-300 h-36 overflow-hidden
                                  ${isUsed 
                                    ? 'border-gray-600 bg-gray-600/20 grayscale opacity-40 cursor-not-allowed font-black' 
                                    : `border-accent-${accent} bg-max-muted hover:shadow-max-${accent}`
                                  }
                                `}
                              >
                              <h3 className={`font-black text-xl lg:text-2xl uppercase mb-1 ${isUsed ? 'text-gray-500' : 'text-white'}`}>
                                {cat.label}
                              </h3>
                              <div className={`text-xs font-black px-2 py-1 rounded inline-block mb-2 ${cat.direction === 'HIGHER' ? 'bg-accent-yellow text-max-bg' : 'bg-accent-cyan text-max-bg'}`}>
                                CHERCHE LE {cat.direction === 'HIGHER' ? 'PLUS GRAND' : 'PLUS PETIT'}
                              </div>
                              {isUsed ? (
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <span className="text-6xl font-black text-white/5">USED</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-accent-cyan font-bold text-xs">
                                     DÉCOUVRE LE RANG <ArrowRight className="ml-2 w-4 h-4" />
                                  </div>
                                )}
                              </motion.button>

                              {!isUsed && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInfoCategory(cat);
                                  }}
                                  className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20"
                                >
                                   <Info size={16} />
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* History Feed */}
            <div className="lg:col-span-12 mt-8">
              <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                {rounds.map((round, idx) => (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={idx}
                    className="min-w-[200px] bg-max-muted border-2 border-accent-purple rounded-xl p-4 flex flex-col items-center shadow-max-cyan"
                  >
                    <span className="text-xs font-black text-accent-magenta uppercase">
                      {round.category.label} ({round.category.direction === 'HIGHER' ? '+' : '-'})
                    </span>
                    <span className="text-lg font-bold truncate w-full text-center">{round.country.name}</span>
                    <div className="text-sm font-medium text-white/70">
                      {round.value?.toLocaleString()} {round.category.unit} 
                      {round.country.isEstimated?.[round.category.id] && <span className="text-accent-yellow ml-1 text-[10px]">(Est.)</span>}
                    </div>
                    <div className="text-3xl font-black text-accent-yellow mt-2">
                      Rank #{round.rank} <span className="text-sm text-white/50">/ {COUNTRIES.length}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'END' && (
          <motion.div
            key="end"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10 max-w-4xl px-4"
          >
            <div className="mb-8">
              {isWinner ? (
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 bg-accent-yellow rounded-full flex items-center justify-center border-8 border-white mb-6"
                  >
                    <Trophy className="w-20 h-20 text-max-bg" />
                  </motion.div>
                  <h1 className="text-8xl md:text-9xl text-accent-cyan text-shadow-mega mb-4 animate-gradient-shift bg-gradient-to-r from-accent-cyan via-accent-yellow to-accent-magenta bg-clip-text text-transparent">
                    VICTOIRE !
                  </h1>
                </div>
              ) : (
                <h1 className="text-8xl md:text-9xl text-accent-orange text-shadow-mega mb-4">
                  PERDU...
                </h1>
              )}
              <div className="text-4xl md:text-6xl font-black uppercase mb-12">
                Score Final: <span className={isWinner ? 'text-accent-cyan' : 'text-accent-orange'}>{totalScore}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
               <MaxCard accent="purple" className="flex flex-col items-center">
                 <p className="text-lg font-bold mb-4 opacity-70">RÉSUMÉ DES RANGS</p>
                 <div className="space-y-2 w-full">
                   {rounds.map((r, i) => (
                     <div key={i} className="flex justify-between border-b-2 border-dashed border-max-bg pb-1 text-sm">
                       <span>{r.country.name}</span>
                       <span className="font-black text-accent-yellow">#{r.rank}</span>
                     </div>
                   ))}
                 </div>
               </MaxCard>
               <div className="flex flex-col gap-4">
                 <MaxButton onClick={startNewGame} className="h-24 text-3xl">
                   REJOUER <RefreshCcw className="ml-4" />
                 </MaxButton>
                 <MaxButton variant="outline" onClick={() => setGameState('START')} className="h-16 text-xl">
                   MENU PRINCIPAL
                 </MaxButton>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-4 z-20 hidden md:block">
        <p className="font-black text-accent-magenta/30 uppercase tracking-widest text-xs">
          GEO-CHAOS V1 // MAXIMALIST EDITION
        </p>
      </footer>
    </div>
  );
}
