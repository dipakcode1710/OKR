import { useState, useEffect } from "react";
import { Modal, FormGroup, Input, Select, Btn } from "../common";
import { s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

const INIT = {
  name: "",
  code: "",
  type: "quarterly",
  active: true,
  start: "",
  end: "",
};

export default function CycleModal({ open, onClose, cycle }) {
  const { createCycle, updateCycle } = useOkr();
  const [form, setForm] = useState(INIT);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (cycle) {
      setForm({
        name: cycle.name || "",
        code: cycle.code || "",
        type: cycle.type || "quarterly",
        active: cycle.active ?? true,
        start: (cycle.start ?? "").slice(0, 10),
        end: (cycle.end ?? "").slice(0, 10),
      });
    } else {
      setForm(INIT);
    }
    setErr(null);
  }, [open]);

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: k === "active" ? e.target.value === "active" : e.target.value,
    }));

  const handleSubmit = async () => {
    setSaving(true);
    setErr(null);
    try {
      if (cycle) {
        await updateCycle(cycle.id, form);
      } else {
        await createCycle(form);
      }
      onClose();
    } catch (e) {
      setErr(e?.message || (cycle ? "Failed to update cycle" : "Failed to create cycle"));
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(cycle);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Cycle" : "New Cycle"}>
      <FormGroup label="Cycle Name">
        <Input
          placeholder="e.g. Q2 FY26-27 Engineering"
          value={form.name}
          onChange={set("name")}
        />
      </FormGroup>
      <FormGroup label="Cycle Code">
        <Input
          placeholder="e.g. Q2-2026-ENG"
          value={form.code}
          onChange={set("code")}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Type">
          <Select value={form.type} onChange={set("type")}>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="half_yearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </Select>
        </FormGroup>
        <FormGroup label="Status">
          <Select
            value={form.active ? "active" : "draft"}
            onChange={set("active")}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </Select>
        </FormGroup>
        <FormGroup label="Start Date">
          <Input type="date" value={form.start} onChange={set("start")} />
        </FormGroup>
        <FormGroup label="End Date">
          <Input type="date" value={form.end} onChange={set("end")} />
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
          {saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save Changes" : "Create Cycle")}
        </Btn>
      </div>
    </Modal>
  );
}
