import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  CheckCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [annonces, setAnnonces] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // 📡 ANNONCES
  useEffect(() => {
    const q = query(collection(db, "annoncesBoost"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnonces(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📩 CONTACTS
  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔍 FILTRE
  const filteredAnnonces = annonces.filter(item => {
    const status = (item.status || "").toLowerCase().trim();

    if (filter === "all") return true;
    if (filter === "pending") return status !== "approved";
    if (filter === "approved") return status === "approved";

    return true;
  });

  // 💰 REVENUS
  const totalRevenue = annonces.reduce((acc, curr) => {
    const price = Number(String(curr.price || "0").replace(/\s/g, ""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  // ✅ APPROUVER
  const approveAnnonce = async (id) => {
    try {
      setLoadingId(id);

      await updateDoc(doc(db, "annoncesBoost", id), {
        status: "approved"
      });

    } catch (error) {
      console.error("Erreur validation :", error);
    } finally {
      setLoadingId(null);
    }
  };

  // 🗑️ SUPPRIMER
  const deleteAnnonce = async (id) => {
    if (window.confirm("Supprimer cette demande ?")) {
      await deleteDoc(doc(db, "annoncesBoost", id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-7xl mx-auto">
        <StatCard title="Total demandes" value={annonces.length} />
        <StatCard title="Revenus" value={`${totalRevenue.toLocaleString()} FCFA`} />
        <StatCard
          title="En attente"
          value={annonces.filter(a => (a.status || "") !== "approved").length}
        />
      </div>

      {/* 📩 CONTACTS */}
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="text-xl font-black mb-4">📩 Messages Contact</h2>

        <div className="bg-white rounded-3xl shadow p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-400">
              <tr>
                <th className="p-4">Nom</th>
                <th>Message</th>
                <th>WhatsApp</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4">{item.message}</td>
                  <td className="p-4">
                    {item.phone ? (
                      <a
                        href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="text-green-500 font-bold"
                      >
                        📲 WhatsApp
                      </a>
                    ) : (
                      "❌"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contacts.length === 0 && (
            <p className="text-center text-gray-400 p-6">
              Aucun message
            </p>
          )}
        </div>
      </div>

      {/* 🔍 FILTRES */}
      <div className="flex gap-3 mb-6 max-w-7xl mx-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl ${filter === "all" ? "bg-black text-white" : "bg-slate-200"}`}
        >
          Tous
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl ${filter === "pending" ? "bg-orange-400 text-white" : "bg-orange-200"}`}
        >
          En attente
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-xl ${filter === "approved" ? "bg-green-600 text-white" : "bg-green-200"}`}
        >
          Validés
        </button>
      </div>

      {/* 📋 TABLE ANNONCES */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow p-4 overflow-x-auto">

        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="p-4">Client</th>
              <th>Option</th>
              <th>Contact</th>
              <th>Images</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filteredAnnonces.map(item => {

                const phoneNumber = item.phone || item.whatsapp || "";
                const isApproved = (item.status || "").toLowerCase() === "approved";

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelected(item)}
                  >

                    <td className="p-4 font-bold">
                      {item.name}
                      <div className="text-xs text-gray-400">
                        {isApproved ? "✅ Validé" : "⏳ En attente"}
                      </div>
                    </td>

                    <td>{item.option} - {item.duration}</td>

                    <td>
                      {phoneNumber || "❌ Aucun numéro"}
                    </td>

                    <td>
                      {item.imageUrl && (
                        <img src={item.imageUrl} className="w-10 h-10 rounded object-cover" />
                      )}
                    </td>

                    <td className="text-right space-x-2">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveAnnonce(item.id);
                        }}
                        disabled={loadingId === item.id}
                        className="text-green-500"
                      >
                        {loadingId === item.id ? "⏳" : <CheckCircle />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnonce(item.id);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 />
                      </button>

                    </td>

                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

      </div>

      {/* 🧾 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

          <div className="bg-white p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">{selected.name}</h2>

            <p>📞 {selected.phone}</p>
            <p>📍 {selected.location}</p>
            <p>💰 {selected.price} FCFA</p>

            {selected.imageUrl && (
              <img src={selected.imageUrl} className="mt-4 rounded-xl w-full" />
            )}

            {selected.receiptUrl && (
              <img src={selected.receiptUrl} className="mt-4 rounded-xl w-full" />
            )}

            <a
              href={`https://wa.me/${selected.phone?.replace(/\D/g, "")}`}
              target="_blank"
              className="block mt-6 bg-green-500 text-white text-center py-3 rounded-xl font-bold"
            >
              📲 Contacter
            </a>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-black text-white py-3 rounded-xl"
            >
              Fermer
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

// 📊 CARD
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-xs uppercase text-gray-400 font-bold">{title}</p>
      <h2 className="text-2xl font-black">{value}</h2>
    </div>
  );
}