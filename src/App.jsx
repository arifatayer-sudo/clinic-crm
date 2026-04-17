import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const fetchPatients = async () => {
    const { data } = await supabase.from("patients").select("*");
    setPatients(data || []);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async () => {
    if (!name || !phone) return;

    await supabase.from("patients").insert([
      {
        name,
        phone,
        status: "active"
      }
    ]);

    setName("");
    setPhone("");

    fetchPatients(); // refresh list
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Patients</h1>

      {/* ADD FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={addPatient}>
          Add Patient
        </button>
      </div>

      {/* LIST */}
      {patients.map((p) => (
        <div key={p.id}>
          {p.name} - {p.phone}
        </div>
      ))}
    </div>
  );
}