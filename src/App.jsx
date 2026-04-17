import { useState } from "react";

export default function App() {
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "Clinic CRM",
      dashboard: "Dashboard",
      patients: "Patients",
      appointments: "Appointments",
      stats: "Quick Stats",
      totalPatients: "Total Patients",
      todayAppointments: "Today Appointments"
    },
    tr: {
      title: "Klinik CRM",
      dashboard: "Panel",
      patients: "Hastalar",
      appointments: "Randevular",
      stats: "Hızlı İstatistikler",
      totalPatients: "Toplam Hastalar",
      todayAppointments: "Bugünkü Randevular"
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#f5f7ff", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{t[lang].title}</h1>

        <button
          onClick={() => setLang(lang === "en" ? "tr" : "en")}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          🌐 {lang === "en" ? "Türkçe" : "English"}
        </button>
      </div>

      {/* DASHBOARD TITLE */}
      <h2 style={{ marginTop: 30 }}>{t[lang].dashboard}</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ background: "white", padding: 20, borderRadius: 10, flex: 1 }}>
          <h3>{t[lang].totalPatients}</h3>
          <p style={{ fontSize: 24 }}>128</p>
        </div>

        <div style={{ background: "white", padding: 20, borderRadius: 10, flex: 1 }}>
          <h3>{t[lang].todayAppointments}</h3>
          <p style={{ fontSize: 24 }}>14</p>
        </div>
      </div>

      {/* SECTIONS */}
      <div style={{ marginTop: 30, background: "white", padding: 20, borderRadius: 10 }}>
        <h3>{t[lang].patients}</h3>
        <ul>
          <li>Ahmet Yılmaz</li>
          <li>Elif Demir</li>
          <li>Mehmet Kaya</li>
        </ul>
      </div>

    </div>
  );
}