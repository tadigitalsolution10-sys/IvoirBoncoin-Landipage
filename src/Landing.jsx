import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Zap, Target, TrendingUp, ChevronRight, Mail, MapPin, Send, ArrowLeft, X, CheckCircle2, Upload } from 'lucide-react';
import { db } from "./firebase"; // adapte le chemin
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "./services/cloudinary"; // adapte le chemin
import { Link } from "react-router-dom";


// --- CONFIGURATION DES IMAGES ---
const CONFIG_IMAGES = {
  fondHero: "/ton-image-garba.jfif",      
  maquetteHero: "/maquette.png",         
  imageFonctionnalite: "/news-feed.png",
  maquetteDownload: "/maquette-download.png"
};

// --- VARIANTES D'ANIMATION UI/UX ---
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } }
};

const pressEffect = { scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } };
const hoverLift = { y: -10, transition: { duration: 0.3 } };

export default function Landing() {
  // --- ÉTATS ---
  const [view, setView] = useState("home"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [option, setOption] = useState(null); 
  const [duration, setDuration] = useState("1 jour");

  const [contactData, setContactData] = useState({
  name: "",
  message: "",
  phone: ""
});

const [contactLoading, setContactLoading] = useState(false);
const [contactSuccess, setContactSuccess] = useState(false);
  

  // 👉 AJOUT ICI (juste après les autres states)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    location: "",
    link: "",
    image: null,
    receipt: null
  });

  const [loading, setLoading] = useState(false);

  const prices = {
    "1 jour": "5 000",
    "3 jours": "10 000",
    "7 jours": "15 000",
    "30 jours": "25 000"
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setOption(null);
  };

      const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleFile = (e, field) => {
      setFormData({ ...formData, [field]: e.target.files[0] });
    };

    const handleSubmit = async () => {
      try {
        setLoading(true);

        let imageUrl = "";

        if (formData.image) {
          imageUrl = await uploadToCloudinary(formData.image);
        }
        let receiptUrl = "";


        if (formData.receipt) {
          receiptUrl = await uploadToCloudinary(formData.receipt);
        }

        await addDoc(collection(db, "annoncesBoost"), {
          name: formData.name,
          description: formData.description,
          phone: formData.phone,
          location: formData.location,
          link: formData.link,
          duration,
          price: prices[duration],

          imageUrl: imageUrl, // ✅ URL seulement
          receiptUrl: receiptUrl, // ✅ URL seulement

          option,
          createdAt: serverTimestamp()
        });

        setLoading(false);
        setStep(4);

      } catch (error) {
        console.log("Image URL :", imageUrl);
        alert(error.message); // 🔥 affiche le vrai problème
        setLoading(false);
      }
    };
    const handleContactSubmit = async (e) => {
  e.preventDefault();

  if (!contactData.name || !contactData.message) return;

  try {
    setContactLoading(true);

    await addDoc(collection(db, "contacts"), {
      name: contactData.name,
      message: contactData.message,
      phone: contactData.phone || "",
      createdAt: serverTimestamp()
    });

    setContactData({ name: "", message: "", phone: "" });
    setContactSuccess(true);

  } catch (error) {
    console.error("Erreur envoi contact :", error);
    alert("Erreur lors de l'envoi");
  } finally {
    setContactLoading(false);
  }
};

  return (
    <AnimatePresence mode="wait">
      {view === "home" ? (
        <motion.div 
          key="home"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
          className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-900 selection:bg-orange-100 selection:text-orange-600"
        >
          
          {/* --- 1. NAVIGATION --- */}
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-6 w-full z-[60] flex justify-center px-4">
            <nav className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-white/20 h-16 rounded-full px-8 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-black tracking-tighter cursor-pointer">
                <span className="text-green-500">Ivoir</span><span className="text-orange-500">Boncoin</span>
              </motion.div>
              <div className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
                <a href="#accueil" className="hover:text-green-500 transition-colors">accueil</a>
                <a href="#features" className="hover:text-green-500 transition-colors">Fonctionnalité</a>
                <button onClick={() => setView("contact")} className="hover:text-green-500 transition-colors uppercase tracking-widest">contact</button>
              </div>
              <motion.button 
                onClick={() => setIsModalOpen(true)}
                whileHover={pressEffect} whileTap={{ scale: 0.9 }}
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter"
              >
                Publiez ou Boostez
              </motion.button>
            </nav>
          </motion.div>

          {/* --- 2. ACCUEIL (HERO) --- */}
          <section id="accueil" className="relative min-h-[110vh] flex flex-col items-center pt-44 pb-20 px-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/60 z-10" /> 
              <img src={CONFIG_IMAGES.fondHero} alt="Background" className="w-full h-full object-cover scale-110" />
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="whileInView" className="relative z-20 text-center max-w-4xl mx-auto">
              <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6">
                Rejoins <span className="text-green-500">Ivoir</span><span className="text-orange-500">Boncoin</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-200 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                1ère application mobile de comparateurs de prix en Côte d'Ivoire.
              </motion.p>
              <motion.button 
                variants={fadeInUp} whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)" }} whileTap={pressEffect}
                className="bg-orange-500 text-white px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 mx-auto mb-16 group"
              >
                Télécharger maintenant <Download size={24} />
              </motion.button>
              <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="relative mx-auto mt-10 w-full max-w-[300px] md:max-w-[400px]">
                <motion.img animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} src={CONFIG_IMAGES.maquetteHero} alt="Maquette" className="w-full h-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] relative z-20" />
              </motion.div>
            </motion.div>
          </section>

          {/* --- 3. FONCTIONNALITÉS --- */}
                    {/* --- 3. FONCTIONNALITÉS --- */}
          <section id="features" className="py-32 bg-white px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 relative">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ rotate: -2 }} className="relative z-10 w-full max-w-[450px] bg-white p-4 rounded-[40px] shadow-2xl border border-slate-50">
                  <img src={CONFIG_IMAGES.imageFonctionnalite} alt="Feature" className="w-full h-auto rounded-[30px]" />
                </motion.div>
              </div>
              <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="flex-1 space-y-10">
                <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">
                  Les tendances <span className="text-green-500 italic">localement.</span>
                </h2>
                <div className="space-y-6">
                  <motion.div variants={fadeInUp} whileHover={hoverLift} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 cursor-pointer transition-all hover:bg-white hover:border-orange-200">
                    <h4 className="font-black text-xl mb-2">💡 Opportunités</h4>
                    <p className="text-slate-600">Flux d’actualités dynamique pour ne rien rater.</p>
                  </motion.div>
                  <motion.div variants={fadeInUp} whileHover={hoverLift} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 cursor-pointer transition-all hover:bg-white hover:border-green-200">
                    <h4 className="font-black text-xl mb-2">
                      <Target className="inline mr-2 text-orange-500" />
                      Valeur ajoutée
                    </h4>
                    <p className="text-slate-600">L'information rapide pour saisir les meilleures affaires.</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* --- 3B. POURQUOI CHOISIR --- */}
          <section className="py-32 bg-slate-50 px-6">
            <div className="max-w-7xl mx-auto text-center space-y-16">

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  Pourquoi choisir <span className="text-green-500">Ivoir</span><span className="text-orange-500">Boncoin</span> ?
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  Une application pensée pour faciliter vos achats, ventes et découvertes locales en toute simplicité.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <motion.div
                  variants={fadeInUp}
                  whileHover={hoverLift}
                  className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100"
                >
                  <Zap className="text-orange-500 mb-4 mx-auto" size={40} />
                  <h4 className="font-black text-xl mb-3">Rapide & Simple</h4>
                  <p className="text-slate-600">
                    Publiez ou trouvez une annonce en quelques secondes sans complication.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={hoverLift}
                  className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100"
                >
                  <Target className="text-green-500 mb-4 mx-auto" size={40} />
                  <h4 className="font-black text-xl mb-3">Ciblé & Local</h4>
                  <p className="text-slate-600">
                    Accédez aux meilleures offres autour de vous grâce à la géolocalisation.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={hoverLift}
                  className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100"
                >
                  <TrendingUp className="text-blue-500 mb-4 mx-auto" size={40} />
                  <h4 className="font-black text-xl mb-3">Boostez vos ventes</h4>
                  <p className="text-slate-600">
                    Augmentez votre visibilité et atteignez plus de clients avec nos options de boost.
                  </p>
                </motion.div>

              </div>
            </div>
          </section>


          {/* --- 4. SECTION TÉLÉCHARGER --- */}
          <section id="download" className="py-24 bg-white px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-7xl mx-auto bg-[#009B4D] rounded-[48px] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
              <div className="flex-1 p-12 flex justify-center items-center min-h-[450px]">
                <motion.img whileHover={{ scale: 1.1, rotate: 5 }} src={CONFIG_IMAGES.maquetteDownload} alt="App" className="w-full max-w-[280px] drop-shadow-2xl" />
              </div>
              <div className="flex-1 p-12 lg:p-20 bg-white h-full w-full">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8">Lancez-vous</h2>
                <p className="text-xl text-slate-600 leading-relaxed italic mb-10">"100% gratuite. Zéro publicité. Aucune limite."</p>
                <div className="flex flex-wrap gap-4">
                  <motion.a href="#" whileHover={{ scale: 1.05 }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-xl font-bold uppercase tracking-widest text-[15px]">Play Store</motion.a>
                  <button disabled className="bg-slate-100 text-slate-400 px-8 py-4 rounded-2xl cursor-not-allowed border border-slate-200 text-left">
                    <p className="text-[10px] uppercase opacity-70 font-bold">Bientôt sur</p>
                    <p className="text-lg font-black leading-none">App Store</p>
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* --- 5. FOOTER --- */}
          <footer className="bg-orange-500 text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div>
                  <div className="bg-white inline-block px-4 py-2 rounded-2xl shadow-xl mb-6 text-slate-900 font-black text-2xl tracking-tighter">
                    <span className="text-green-500">Ivoir</span>Boncoin
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">Achetez, vendez et découvrez le meilleur de la Côte d'Ivoire en un clic.</p>
                </div>
                {["Contact", "Légal", "Application"].map((title) => (
                  <div key={title} className="space-y-6">
                    <h4 className="font-black uppercase tracking-widest text-xs border-b border-white/20 pb-2">{title}</h4>
                    <div className="flex flex-col gap-4 text-sm font-medium">
                      {title === "Contact" && <button onClick={() => setView("contact")} className="text-left hover:translate-x-2 transition-transform">Nous contacter</button>}
                      {title === "Légal" && (
                        <div className="flex flex-col gap-4 text-sm font-medium">
                            <Link to="/mentions-legales" className="hover:underline hover:translate-x-1 transition-transform">
                            Mentions Légales
                            </Link>
                            <a href="#" className="hover:underline hover:translate-x-1 transition-transform">
                            Données
                            </a>
                        </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.2em] opacity-80 uppercase">
                <p>© 2026 — Développé par <a href="http://www.bolouhk.com" target="_blank" className="border-b border-white/40">Bolou-hk</a></p>
                <div className="flex gap-8 mt-4 md:mt-0"><span>FB</span><span>IG</span><span>LI</span></div>
              </div>
            </div>
          </footer>

          {/* --- MODALE DYNAMIQUE (PUBLIEZ OU BOOSTEZ) --- */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetModal} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
                  
                  {/* Header */}
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">
                        {step === 1 && "Choisissez votre option"}
                        {step === 2 && (option === 'option1' ? "Votre propre visuel" : "Création professionnelle")}
                        {step === 3 && "Paiement & Validation"}
                        {step === 4 && "Succès !"}
                      </h2>
                      {step < 4 && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Étape {step} sur 3</p>}
                    </div>
                    <button onClick={resetModal} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:rotate-90 transition-transform"><X size={20} /></button>
                  </div>

                  <div className="p-8 max-h-[75vh] overflow-y-auto">
                    {/* ÉTAPE 1 : CHOIX */}
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div whileHover={{ y: -5 }} onClick={() => { setOption('option1'); setStep(2); }} className="p-8 rounded-[32px] border-2 border-slate-100 hover:border-green-500 cursor-pointer transition-all group">
                          <div className="text-3xl mb-4">📸</div>
                          <h3 className="font-black text-lg mb-2 text-green-600">Option 1</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">Vous avez déjà votre visuel ? Importez-la et nous la diffuserons.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} onClick={() => { setOption('option2'); setStep(2); }} className="p-8 rounded-[32px] border-2 border-slate-100 hover:border-orange-500 cursor-pointer transition-all group">
                          <div className="text-3xl mb-4">🎨</div>
                          <h3 className="font-black text-lg mb-2 text-orange-600">Option 2</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">Vous n’avez pas de visuel ? Donnez-nous les infos, on crée pour vous.</p>
                        </motion.div>
                      </div>
                    )}

                    {/* ÉTAPE 2 : FORMULAIRE */}
                    {step === 2 && (
                      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                        <div className="space-y-4">
                          <input
                            name="name"
                            onChange={handleChange}
                            required
                            type="text"
                            placeholder="Nom de l'entreprise / Restaurant"
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white 
                            focus:outline-none focus:ring-2 focus:ring-orange-400 
                            text-slate-800 placeholder-slate-400 shadow-sm"
                            />
                          
                          {option === 'option1' ? (
                            <>
                             <label
                              htmlFor="imageUpload"
                              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer bg-slate-50/50 block"
                            >
                              <Upload className="mx-auto mb-2 text-slate-300" />
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Importer le visuel (16:9)
                              </p>
                            </label>

                            <input
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFile(e, "image")}
                              className="hidden"
                            />

                            {formData.image && (
                              <img
                                src={URL.createObjectURL(formData.image)}
                                className="w-40 mx-auto mt-4 rounded-xl"
                              />
                            )}

                              <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFile(e, "image")}
                                className="hidden"
                              />
                              <input
                                name="link"
                                onChange={handleChange}
                                type="text"
                                placeholder="Lien externe"
                                className="w-full p-4 rounded-xl border border-slate-200 bg-white 
                                focus:outline-none focus:ring-2 focus:ring-orange-400 
                                text-slate-800 placeholder-slate-400 shadow-sm"
                                />
                                <div className="relative">
                                <input
                                    name="phone"
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Numéro WhatsApp"
                                    className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-white 
                                    focus:outline-none focus:ring-2 focus:ring-green-400 
                                    text-slate-800 placeholder-slate-400 shadow-sm"
                                />
                                

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                                    📱
                                </span>
                                
                                </div>
                            </>
                          ) : (
                            <>
                              <textarea
                                name="description"
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Description"
                                className="w-full p-4 rounded-xl border border-slate-200 bg-white 
                                focus:outline-none focus:ring-2 focus:ring-orange-400 
                                text-slate-800 placeholder-slate-400 shadow-sm"
                                />
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                                <input
                                    name="phone"
                                    onChange={handleChange}
                                    required
                                    type="tel"
                                    placeholder="Numéro"
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-white 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400 
                                    text-slate-800 placeholder-slate-400 shadow-sm"
                                />
                                <input
                                name="location"
                                onChange={handleChange}
                                required
                                type="text"
                                placeholder="Adresse"
                                className="w-full p-4 rounded-xl border border-slate-200 bg-white 
                                focus:outline-none focus:ring-2 focus:ring-orange-400 
                                text-slate-800 placeholder-slate-400 shadow-sm"
                                />
                              </div>
                            </>
                          )}

                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Durée de publication</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {Object.keys(prices).map((d) => (
                                <button key={d} type="button" onClick={() => setDuration(d)} className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${duration === d ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}>
                                  {d}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-lg flex items-center justify-center gap-3 shadow-xl">
                          Passer au paiement ({prices[duration]} FCFA) <ChevronRight size={20}/>
                        </button>
                      </form>
                    )}

                    {/* ÉTAPE 3 : PAIEMENT */}
                    {step === 3 && (
                      <div className="space-y-8 text-center">
                        <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                          <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                            "💡 Après avoir rempli le formulaire, effectuez votre paiement pour valider votre demande."
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">💳 Numéro de paiement</p>
                          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-3xl font-black text-slate-900 tracking-tighter">
                            +225 07 07 16 01 70
                          </motion.div>
                        </div>
                        <div className="space-y-4">
                          <label className="block border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-orange-500 transition-colors cursor-pointer bg-slate-50/50">
                            <input
                              type="file"
                              required
                              accept="image/*"
                              onChange={(e) => handleFile(e, "receipt")}
                              className="hidden"
                            />
                            <Upload className="mx-auto mb-2 text-orange-500" />
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                              📸 Ajouter la capture du reçu
                            </p>
                          </label>

                          {/* 🔥 PREVIEW IMAGE */}
                          {formData.receipt && (
                            <div className="mt-4 text-center">
                              <img
                                src={URL.createObjectURL(formData.receipt)}
                                alt="Preview reçu"
                                className="w-40 mx-auto rounded-xl shadow-lg"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, receipt: null })}
                            className="text-xs text-red-500 mt-2"
                          >
                            Supprimer l'image
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white rounded-2xl py-5 font-black text-lg shadow-xl"
                          >
                            {loading ? "Envoi en cours..." : "Envoyer la demande"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 4 : CONFIRMATION */}
                    {step === 4 && (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-10 space-y-6">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={48} /></div>
                        <div className="space-y-2 px-4">
                          <h3 className="text-3xl font-black tracking-tight">C'est envoyé !</h3>
                          <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Votre demande a bien été envoyée. Elle sera traitée dans un délai de <span className="text-slate-900 font-bold">1 heure à 24 heures</span>.
                            <br/><br/>
                            <span className="text-xs italic">Vous serez contacté si nécessaire.</span>
                          </p>
                        </div>
                        <button onClick={resetModal} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Fermer</button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* --- VUE CONTACT --- */
        <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
          <button onClick={() => setView("home")} className="max-w-7xl mx-auto w-full flex items-center gap-2 text-slate-500 font-bold mb-12 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} /> Retour à l'accueil
          </button>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h1 className="text-6xl font-black tracking-tighter">Parlons de votre <span className="text-green-500">projet.</span></h1>
              <div className="space-y-8">
                <div className="flex items-center gap-6"><div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500"><Mail /></div><p className="font-bold">digital@bolouhk.com</p></div>
                <div className="flex items-center gap-6"><div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-500"><MapPin /></div><p className="font-bold">Abidjan, Côte d'Ivoire</p></div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
              <form className="space-y-6" onSubmit={handleContactSubmit}>

                <input
                    required
                    type="text"
                    placeholder="Nom complet"
                    value={contactData.name}
                    onChange={(e) =>
                    setContactData({ ...contactData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 transition-all font-bold"
                />

                <input
                    type="tel"
                    placeholder="Numéro WhatsApp (optionnel)"
                    value={contactData.phone}
                    onChange={(e) =>
                    setContactData({ ...contactData, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-green-500 transition-all font-bold"
                />

                <textarea
                    required
                    rows="5"
                    placeholder="Votre message"
                    value={contactData.message}
                    onChange={(e) =>
                    setContactData({ ...contactData, message: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 transition-all resize-none font-bold"
                />

                <button
                    disabled={contactLoading}
                    className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {contactLoading ? "Envoi..." : "Envoyer"}
                    <Send size={20} />
                </button>

                {contactSuccess && (
                    <p className="text-green-500 font-bold text-center">
                    Message envoyé avec succès ✅
                    </p>
                )}

                </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}