import { useState } from "react";
import { Modal, FormGroup, Input, Textarea, Select, Btn } from "../common";
import { s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

const INIT = {
  title: "",
  desc: "",
  cycleId: "",
  scope: "personal",
  type: "committed",
  dueDate: "2026-06-30",
  successCriteria: "",
};

export default function NewObjectiveModal({ open, onClose }) {
  const { cycles, createObjective } = useOkr();
  const [form, setForm] = useState(INIT);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    setErr(null);
    try {
      await createObjective({
        ...form,
        cycleId: form.cycleId ? Number(form.cycleId) : cycles[0]?.id,
      });
      setForm(INIT);
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to create objective");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Objective" width={560}>
      <FormGroup label="Objective Title">
        <Input
          placeholder="What do you want to achieve?"
          value={form.title}
          onChange={set("title")}
        />
      </FormGroup>
      <FormGroup label="Description">
        <Textarea
          placeholder="Why does this matter?"
          value={form.desc}
          onChange={set("desc")}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Cycle">
          <Select value={form.cycleId} onChange={set("cycleId")}>
            <option value="">— Select cycle —</option>
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Scope">
          <Select value={form.scope} onChange={set("scope")}>
            <option value="personal">Personal</option>
            <option value="team">Team</option>
            <option value="department">Department</option>
            <option value="company">Company</option>
          </Select>
        </FormGroup>
        <FormGroup label="Type">
          <Select value={form.type} onChange={set("type")}>
            <option value="committed">Committed</option>
            <option value="aspirational">Aspirational</option>
            <option value="learning">Learning</option>
          </Select>
        </FormGroup>
        <FormGroup label="Due Date">
          <Input type="date" value={form.dueDate} onChange={set("dueDate")} />
        </FormGroup>
      </div>
      <FormGroup label="Success Criteria">
        <Textarea
          placeholder="How will you know you succeeded?"
          value={form.successCriteria}
          onChange={set("successCriteria")}
        />
      </FormGroup>

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
          {saving ? "Creating…" : "Create Objective"}
        </Btn>
      </div>
    </Modal>
  );
}
