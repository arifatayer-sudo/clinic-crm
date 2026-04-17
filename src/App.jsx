import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setPatients(data || []);
    };

    fetchPatients();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Patients</h1>

      {patients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        patients.map((p) => (
          <div key={p.id}>
            {p.name} - {p.phone}
          </div>
        ))
      )}
    </div>
  );
}