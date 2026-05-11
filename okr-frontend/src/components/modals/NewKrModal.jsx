import { useState } from "react";
import { Modal, FormGroup, Input, Select, Btn } from "../common";
import { s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

const INIT = {
  title: "",
  metric: "",
  measurementType: "percentage",
  unit: "%",
  baseline: "",
  target: "",
  weight: "",
  objId: "",
};

export default function NewKrModal({ open, onClose, defaultObjectiveId }) {
  const { objectives, createKeyResult } = useOkr();
  const [form, setForm] = useState({ ...INIT, objId: defaultObjectiveId ?? "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    setErr(null);
    try {
      await createKeyResult({
        ...form,
        objId: form.objId ? Number(form.objId) : objectives[0]?.id,
      });
      setForm({ ...INIT, objId: defaultObjectiveId ?? "" });
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to create key result");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Key Result">
      <FormGroup label="Objective">
        <Select value={form.objId} onChange={set("objId")}>
          <option value="">— Select objective —</option>
          {objectives.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Key Result Title">
        <Input
          placeholder="What will you measure?"
          value={form.title}
          onChange={set("title")}
        />
      </FormGroup>
      <FormGroup label="Metric Name">
        <Input
          placeholder="e.g. Process Compliance Percentage"
          value={form.metric}
          onChange={set("metric")}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Measurement Type">
          <Select value={form.measurementType} onChange={set("measurementType")}>
            <option value="percentage">Percentage</option>
            <option value="count">Count</option>
            <option value="currency">Currency</option>
            <option value="custom">Custom</option>
          </Select>
        </FormGroup>
        <FormGroup label="Unit">
          <Input
            placeholder="e.g. %, count"
            value={form.unit}
            onChange={set("unit")}
          />
        </FormGroup>
        <FormGroup label="Baseline Value">
          <Input
            type="number"
            placeholder="0"
            value={form.baseline}
            onChange={set("baseline")}
          />
        </FormGroup>
        <FormGroup label="Target Value">
          <Input
            type="number"
            placeholder="100"
            value={form.target}
            onChange={set("target")}
          />
        </FormGroup>
      </div>
      <FormGroup label="Weight % (all KRs should sum to 100)">
        <Input
          type="number"
          placeholder="e.g. 40"
          value={form.weight}
          onChange={set("weight")}
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
          {saving ? "Saving…" : "Add Key Result"}
        </Btn>
      </div>
    </Modal>
  );
}
