import { useEffect, useState } from "react";
import { Modal, FormGroup, Input, Textarea, Select, Btn } from "../common";
import { T, s } from "../../utils/theme";
import { useOkr } from "../../context/OkrContext";

export default function ProgressModal({ open, onClose, kr }) {
  const { updateKeyResultProgress } = useOkr();
  const [current, setCurrent] = useState("");
  const [confidence, setConfidence] = useState("medium");
  const [trend, setTrend] = useState("improving");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (kr) {
      setCurrent(String(kr.current ?? ""));
      setConfidence(kr.confidence ?? "medium");
      setTrend(kr.trend ?? "improving");
      setNotes("");
      setErr(null);
    }
  }, [kr]);

  const handleSave = async () => {
    if (!kr) return;
    setSaving(true);
    setErr(null);
    try {
      await updateKeyResultProgress(kr.id, {
        current: Number(current),
        confidence,
        trend,
      });
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to update progress");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Progress">
      {kr && (
        <div
          style={{
            background: T.navyLight,
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 3 }}>{kr.title}</div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            Baseline {kr.baseline}
            {kr.unit === "%" ? "%" : " " + kr.unit} → Target {kr.target}
            {kr.unit === "%" ? "%" : " " + kr.unit} · Current {kr.current}
            {kr.unit === "%" ? "%" : " " + kr.unit}
          </div>
        </div>
      )}
      <FormGroup label={`Current Value (${kr?.unit || ""})`}>
        <Input
          type="number"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Confidence">
          <Select value={confidence} onChange={(e) => setConfidence(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </FormGroup>
        <FormGroup label="Trend">
          <Select value={trend} onChange={(e) => setTrend(e.target.value)}>
            <option value="improving">Improving</option>
            <option value="stable">Stable</option>
            <option value="declining">Declining</option>
            <option value="unknown">Unknown</option>
          </Select>
        </FormGroup>
      </div>
      <FormGroup label="Notes (optional)">
        <Textarea
          placeholder="What changed since last update?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </FormGroup>
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          color: "#166534",
          marginBottom: 16,
        }}
      >
        ✓ Saving this will auto-recalculate objective progress using weighted average of all KRs.
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

      <div style={{ ...s.flex("center", "flex-end", 8) }}>
        <Btn onClick={onClose} disabled={saving}>
          Cancel
        </Btn>
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Progress"}
        </Btn>
      </div>
    </Modal>
  );
}
