import { useState } from "react";
import { Modal, FormGroup, Input, Textarea, Select, Btn } from "../common";
import { s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

const INIT = {
  objId: "",
  krId: "",
  type: "progress_update",
  health: "green",
  summary: "",
  details: "",
  wins: "",
  blockers: "",
  progress: "",
  nextSteps: "",
};

export default function CheckInModal({ open, onClose, defaultObjectiveId, defaultKrId }) {
  const { objectives, keyResults, createCheckIn } = useOkr();
  const [form, setForm] = useState({
    ...INIT,
    objId: defaultObjectiveId ?? "",
    krId: defaultKrId ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const filteredKrs = form.objId
    ? keyResults.filter((k) => k.objId === Number(form.objId))
    : keyResults;

  const handleSubmit = async () => {
    setSaving(true);
    setErr(null);
    try {
      await createCheckIn({
        ...form,
        objId: Number(form.objId),
        krId: form.krId ? Number(form.krId) : null,
        progress: form.progress ? Number(form.progress) : 0,
      });
      setForm({ ...INIT, objId: defaultObjectiveId ?? "", krId: defaultKrId ?? "" });
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to submit check-in");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Weekly Check-in" width={560}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
        <FormGroup label="Key Result (optional)">
          <Select value={form.krId} onChange={set("krId")}>
            <option value="">Overall objective</option>
            {filteredKrs.map((k) => (
              <option key={k.id} value={k.id}>
                {k.title}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Type">
          <Select value={form.type} onChange={set("type")}>
            <option value="progress_update">Progress update</option>
            <option value="milestone">Milestone</option>
            <option value="risk">Risk</option>
            <option value="blocker">Blocker</option>
            <option value="general">General</option>
          </Select>
        </FormGroup>
        <FormGroup label="Health Status">
          <Select value={form.health} onChange={set("health")}>
            <option value="green">🟢 On track</option>
            <option value="amber">🟡 At risk</option>
            <option value="red">🔴 Off track</option>
          </Select>
        </FormGroup>
      </div>
      <FormGroup label="Summary">
        <Input
          placeholder="One-line summary of this check-in"
          value={form.summary}
          onChange={set("summary")}
        />
      </FormGroup>
      <FormGroup label="Details">
        <Textarea
          placeholder="What happened this week?"
          value={form.details}
          onChange={set("details")}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Wins">
          <Textarea
            placeholder="What went well?"
            style={{ minHeight: 60 }}
            value={form.wins}
            onChange={set("wins")}
          />
        </FormGroup>
        <FormGroup label="Blockers">
          <Textarea
            placeholder="What's in the way?"
            style={{ minHeight: 60 }}
            value={form.blockers}
            onChange={set("blockers")}
          />
        </FormGroup>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Progress % at check-in">
          <Input
            type="number"
            placeholder="0–100"
            value={form.progress}
            onChange={set("progress")}
          />
        </FormGroup>
        <FormGroup label="Next Steps">
          <Input
            placeholder="What's the plan?"
            value={form.nextSteps}
            onChange={set("nextSteps")}
          />
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
          {saving ? "Submitting…" : "Submit Check-in"}
        </Btn>
      </div>
    </Modal>
  );
}
