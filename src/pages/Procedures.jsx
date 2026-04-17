import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Procedures() {
  const [procedures, setProcedures] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Load procedures
  async function fetchProcedures() {
    const { data, error } = await supabase
      .from("procedures")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProcedures(data);
  }

  useEffect(() => {
    fetchProcedures();
  }, []);

  // Add procedure
  async function addProcedure() {
    if (!name) return;

    const { error } = await supabase.from("procedures").insert([
      {
        name,
        default_price: price || 0,
      },
    ]);

    if (!error) {
      setName("");
      setPrice("");
      fetchProcedures();
    }
  }

  // Delete procedure
  async function deleteProcedure(id) {
    await supabase.from("procedures").delete().eq("id", id);
    fetchProcedures();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Procedures</h2>

      {/* CREATE */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Procedure name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Default price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={addProcedure}>Add</button>
      </div>

      {/* LIST */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Default Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {procedures.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.default_price}</td>
              <td>
                <button onClick={() => deleteProcedure(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
