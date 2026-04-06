import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-20 px-6">
      
      {/* --- BOUTON RETOUR --- */}
      <motion.button 
        onClick={() => window.history.back()}
        whileHover={{ x: -5 }}
        className="max-w-7xl mx-auto w-full flex items-center gap-2 text-slate-500 font-bold text-sm mb-12 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft size={18} /> Retour à l'accueil
      </motion.button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* --- INFOS DE CONTACT --- */}
        <motion.div {...fadeInUp} className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              Parlons de votre <span className="text-green-500">projet.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Une question sur l'application ? Une proposition de partenariat ? 
              L'équipe d'IvoirBoncoin est à votre écoute.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email</p>
                <p className="text-lg font-bold">contact@ivoirboncoin.ci</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Bureau</p>
                <p className="text-lg font-bold">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- FORMULAIRE --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-2">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Jean Kouassi"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-2">Email</label>
                <input 
                  type="email" 
                  placeholder="jean@gmail.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-2">Sujet</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none">
                <option>Support technique</option>
                <option>Partenariat</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-2">Votre message</label>
              <textarea 
                rows="5"
                placeholder="Dites-nous tout..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-orange-500 transition-colors"
            >
              Envoyer le message <Send size={20} />
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}