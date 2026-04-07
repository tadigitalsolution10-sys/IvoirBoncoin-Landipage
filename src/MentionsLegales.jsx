import React from "react";
import { ArrowLeft, ShieldCheck, Building2, Globe, Mail, Trash2, CheckCircle, Clock, ExternalLink, LayoutDashboard, MessageSquare, DollarSign } from "lucide-react";import { useNavigate } from "react-router-dom";
export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Header de la page */}
      <div className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest mb-6 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
            Mentions <span className="text-green-500">Légales</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Informations officielles concernant IvoirBoncoin.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        
        {/* 1. ÉDITEUR DU SITE */}
        <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 text-orange-500 mb-2">
            <Building2 size={24} />
            <h2 className="text-xl font-black tracking-tight">Éditeur du site</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Raison Sociale</p>
              <p className="font-bold text-lg">BOLOU-HK (SARL)</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Date de création</p>
              <p className="font-bold text-lg">03 Avril 2023</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Identification</p>
              <p className="font-bold">N° RCCM : ABJ-03-2023-B12-00990</p>
              <p className="font-bold">Capital : 1 000 000 FCFA</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Siège Social</p>
              <p className="font-bold leading-relaxed">Abidjan, Cocody Angré Star 9B<br/>Côte d'Ivoire</p>
            </div>
          </div>
        </section>

        {/* 2. CONTACT & HÉBERGEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-green-500 mb-4">
              <Mail size={24} />
              <h2 className="text-xl font-black tracking-tight">Contact</h2>
            </div>
            <p className="text-slate-600 text-sm mb-1 font-medium">Pour toute question :</p>
            <a href="mailto:digital@bolouhk.com" className="font-black text-slate-900 border-b-2 border-green-100 hover:border-green-500 transition-all">
              digital@bolouhk.com
            </a>
          </section>

          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-blue-500 mb-4">
              <Globe size={24} />
              <h2 className="text-xl font-black tracking-tight">Hébergement</h2>
            </div>
            <p className="text-slate-600 text-sm font-medium italic">Ce site est hébergé par :</p>
            <p className="font-black text-slate-900 text-lg uppercase tracking-wider">02switch</p>
          </section>
        </div>

        {/* 3. PROPRIÉTÉ & RESPONSABILITÉ */}
        <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 text-slate-900">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-black tracking-tight">Propriété Intellectuelle</h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            L'ensemble des contenus présents sur ce site (textes, images, logos, etc.) sont la propriété exclusive de <strong>BOLOU-HK</strong>, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite sans l'accord écrit de <strong>BOLOU-HK</strong>.
          </p>
          
          <div className="pt-6 border-t border-slate-50">
            <h3 className="font-black text-slate-900 mb-3 tracking-tight">Responsabilité</h3>
            <p className="text-slate-600 leading-relaxed text-sm italic">
              BOLOU-HK s'efforce de fournir des informations exactes et à jour sur ce site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. L'éditeur décline toute responsabilité pour les dommages directs ou indirects qui pourraient résulter de l'accès au site.
            </p>
          </div>
        </section>

        {/* FOOTER PAGE */}
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pt-10">
          © 2026 BOLOU-HK — Tous droits réservés
        </p>
      </div>
    </div>
  );
}