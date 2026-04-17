import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const fetchPatients = async () => {
    const { data } = await supabase
      .from("patients")
      .select("*");

    setPatients(data || []);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async () => {
    if (!name || !phone) return;

    await supabase.from("patients").insert([
      { name, phone, status: "active" }
    ]);

    setName("");
    setPhone("");
    fetchPatients();
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
        <h2>Clinic CRM</h2>
        <p>Dashboard</p>
        <p>Patients</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 30 }}>

        <h1>Patients</h1>

        {/* FORM */}
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: 10 }}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginRight: 10 }}
          />

          <button onClick={addPatient}>Add</button>
        </div>

        {/* LIST */}
        {patients.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>{p.name} - {p.phone}</span>

            <button
              onClick={async () => {
                await supabase
                  .from("patients")
                  .delete()
                  .eq("id", p.id);

                fetchPatients();
              }}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
