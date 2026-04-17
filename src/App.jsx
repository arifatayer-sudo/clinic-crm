import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(0);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [loading, setLoading] = useState(true);

  // 📊 Fetch patients
  const fetchPatients = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("patients")
      .select("*");

    if (error) console.log(error);

    setPatients(data || []);
    setTotal(data?.length || 0);

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ⌨️ ESC closes edit mode
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        cancelEdit();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ➕ Add patient (fast UI update)
  const addPatient = async () => {
    if (!name || !phone) return;

    const { data, error } = await supabase
      .from("patients")
      .insert([{ name, phone, status: "active" }])
      .select()
      .single();

    if (error) return console.log(error);

    setPatients((prev) => [data, ...prev]);
    setTotal((prev) => prev + 1);

    setName("");
    setPhone("");
  };

  // ✏️ Start edit
  const startEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditPhone(p.phone);
  };

  // 💾 Save edit
  const saveEdit = async () => {
    if (!editId) return;

    const { error } = await supabase
      .from("patients")
      .update({
        name: editName,
        phone: editPhone,
      })
      .eq("id", editId);

    if (error) return console.log(error);

    setEditId(null);
    setEditName("");
    setEditPhone("");
    fetchPatients();
  };

  // ❌ Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditPhone("");
  };

  // 🗑 Delete patient
  const deletePatient = async (id) => {
    await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    setPatients((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
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

        {/* DASHBOARD */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div style={{ padding: 15, border: "1px solid #ddd" }}>
            <h3>Total Patients</h3>
            <p>{total}</p>
          </div>
        </div>

        <h1>Patients</h1>

        {/* ADD FORM */}
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
        {loading ? (
          <p>Loading patients...</p>
        ) : (
          patients.map((p) => (
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

              {/* EDIT MODE */}
              {editId === p.id ? (
                <div>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ marginRight: 5 }}
                  />

                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ marginRight: 5 }}
                  />

                  <button
                    onClick={saveEdit}
                    disabled={!editName || !editPhone}
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    style={{
                      marginLeft: 5,
                      background: "gray",
                      color: "white"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{p.name} - {p.phone}</span>

                  <div>
                    <button onClick={() => startEdit(p)}>Edit</button>

                    <button
                      onClick={() => deletePatient(p.id)}
                      style={{
                        background: "red",
                        color: "white",
                        marginLeft: 5
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
