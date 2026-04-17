import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch = `${p.name} ${p.phone}`
        .toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "active") return p.status === "active";

      if (filter === "recent") {
        const created = new Date(p.created_at);
        const now = new Date();
        const diff = (now - created) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }

      return true;
    });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{
        width: 220,
        background: "#111827",
        color: "white",
        padding: 20
      }}>
        <h2>Clinic CRM</h2>
        <p
          style={{ cursor: "pointer", opacity: 0.8 }}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </p>

        <p
          style={{ cursor: "pointer", opacity: 0.8 }}
          onClick={() => setPage("patients")}
        >
          Patients
        </p>
      </div>

      {/* MAIN */}
      <div style={{
        flex: 1,
        padding: 40,
        background: "#f9fafb"
      }}>
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{
              background: "white",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              width: 220
            }}>
              <h4 style={{ margin: 0, color: "#666" }}>Total Patients</h4>
              <p style={{ fontSize: 28, fontWeight: "bold", margin: "10px 0 0" }}>
                {total}
              </p>
            </div>
          </>
        )}

        {page === "patients" && (
          <>
            <h1>Patients</h1>

            {/* KEEP YOUR EXISTING PATIENT SYSTEM HERE */}
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

              <button
                onClick={addPatient}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#3b82f6",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>

            <div style={{
              background: "white",
              padding: 15,
              borderRadius: 12,
              marginBottom: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button onClick={() => setFilter("all")}>
                  All
                </button>

                <button onClick={() => setFilter("active")}>
                  Active
                </button>

                <button onClick={() => setFilter("recent")}>
                  Recent
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 15, alignItems: "center" }}>
                <input
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: 8,
                    width: "100%",
                    maxWidth: 300
                  }}
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      padding: "8px 10px",
                      cursor: "pointer"
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {search && filteredPatients.length === 0 && (
              <p>No patients found</p>
            )}

            {loading ? (
              <p>Loading patients...</p>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    background: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                  }}
                >
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
                        <button
                          onClick={() => startEdit(p)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                            cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deletePatient(p.id)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: 6,
                            marginLeft: 5,
                            cursor: "pointer"
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
          </>
        )}
      </div>
    </div>
  );
}
