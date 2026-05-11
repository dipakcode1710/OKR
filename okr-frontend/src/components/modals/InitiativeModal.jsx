import { useState } from "react";
import { Modal, FormGroup, Input, Textarea, Select, Btn } from "../common";
import { s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

const INIT = {
  krId: "",
  title: "",
  desc: "",
  priority: "high",
  startDate: "",
  dueDate: "",
};

export default function InitiativeModal({ open, onClose, defaultKrId }) {
  const { keyResults, createInitiative } = useOkr();
  const [form, setForm] = useState({ ...INIT, krId: defaultKrId ?? "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    setErr(null);
    try {
      await createInitiative({
        ...form,
        krId: form.krId ? Number(form.krId) : keyResults[0]?.id,
      });
      setForm({ ...INIT, krId: defaultKrId ?? "" });
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to add initiative");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Initiative">
      <FormGroup label="Initiative Title">
        <Input
          placeholder="What action will be taken?"
          value={form.title}
          onChange={set("title")}
        />
      </FormGroup>
      <FormGroup label="Description">
        <Textarea
          placeholder="Describe the action steps"
          value={form.desc}
          onChange={set("desc")}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Key Result">
          <Select value={form.krId} onChange={set("krId")}>
            <option value="">— Select KR —</option>
            {keyResults.map((k) => (
              <option key={k.id} value={k.id}>
                {k.title}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Priority">
          <Select value={form.priority} onChange={set("priority")}>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </FormGroup>
        <FormGroup label="Start Date">
          <Input type="date" value={form.startDate} onChange={set("startDate")} />
        </FormGroup>
        <FormGroup label="Due Date">
          <Input type="date" value={form.dueDate} onChange={set("dueDate")} />
        </FormGroup>
      </div>

      {err && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "8px 12px",
            borderRadius: 7,
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          {err}
        </div>
      )}

      <div style={{ ...s.flex("center", "flex-end", 8), marginTop: 8 }}>
        <Btn onClick={onClose} disabled={saving}>
          Cancel
        </Btn>
        <Btn variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Adding…" : "Add Initiative"}
        </Btn>
      </div>
    </Modal>
  );
}
