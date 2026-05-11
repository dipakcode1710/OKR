// Original demo data — used as a fallback when the API is unreachable
// so the UI always renders something. Once the backend is live, these
// are replaced by real responses from the service layer.

export const CYCLES = [
  { id: 1, name: "Q1 FY26-27 Engineering Excellence", code: "Q1-2026-ENG", type: "quarterly", start: "2026-04-01", end: "2026-06-30", locked: false, active: true },
  { id: 2, name: "Q1 FY2026-27 Personal Goals", code: "Q1-2026-PERSONAL", type: "quarterly", start: "2026-04-01", end: "2026-06-30", locked: false, active: true },
];

export const OBJECTIVES = [
  { id: 1, cycleId: 1, owner: "Atul Jadhav", ownerInitials: "AJ", title: "Improve engineering execution consistency and release governance", desc: "Strengthen engineering quality, release readiness, QA coordination and operational reliability through standardized execution processes.", scope: "company", type: "committed", status: "active", progress: 5, confidence: 8, due: "Jun 30, 2026" },
  { id: 2, cycleId: 1, owner: "Celil", ownerInitials: "CE", title: "Improve production stability through defect prevention and RCA maturity", desc: "Reduce recurring release and production defects through structured root cause analysis, corrective actions and engineering learning reviews.", scope: "company", type: "committed", status: "active", progress: 0, confidence: 6, due: "Jun 30, 2026" },
  { id: 3, cycleId: 2, owner: "Divesh Bari", ownerInitials: "DB", title: "Get technofunctional expertise in CarIT Web and WebforJ integration", desc: "Build technical and functional capability in CarIT Web area and explore integration of WebforJ with CarIT legacy forms.", scope: "personal", type: "learning", status: "active", progress: 0, confidence: 7, due: "Jun 30, 2026" },
];

export const KEY_RESULTS = [
  { id: 1, objId: 1, title: "Achieve standardized release and QA process adoption across all teams", metric: "Process Compliance %", baseline: 20, target: 90, current: 25, unit: "%", weight: 40, progress: 25, confidence: "medium", trend: "improving" },
  { id: 2, objId: 1, title: "Improve release scope visibility before deployment", metric: "Release Awareness Compliance", baseline: 40, target: 95, current: 50, unit: "%", weight: 30, progress: 50, confidence: "medium", trend: "improving" },
  { id: 3, objId: 1, title: "Reduce release execution ambiguity during weekly deployments", metric: "Release Escalation Count", baseline: 8, target: 2, current: 7, unit: "count", weight: 30, progress: 15, confidence: "medium", trend: "stable" },
  { id: 4, objId: 2, title: "Complete RCA for all RC and production defects", metric: "RCA Completion %", baseline: 10, target: 100, current: 15, unit: "%", weight: 40, progress: 15, confidence: "medium", trend: "improving" },
  { id: 5, objId: 2, title: "Reduce repeat production and RC defects", metric: "Repeat Defect Reduction", baseline: 0, target: 40, current: 5, unit: "%", weight: 40, progress: 5, confidence: "low", trend: "stable" },
  { id: 6, objId: 2, title: "Improve corrective action closure effectiveness", metric: "Corrective Action Closure Rate", baseline: 20, target: 90, current: 25, unit: "%", weight: 20, progress: 25, confidence: "medium", trend: "improving" },
  { id: 7, objId: 3, title: "Implement and fix stories in CarIT Web", metric: "Stories/Bugs Completed", baseline: 0, target: 5, current: 0, unit: "count", weight: 60, progress: 0, confidence: "medium", trend: "unknown" },
  { id: 8, objId: 3, title: "Implement new forms using WebforJ", metric: "New WebforJ Forms", baseline: 0, target: 2, current: 0, unit: "count", weight: 40, progress: 0, confidence: "low", trend: "unknown" },
];

export const INITIATIVES = [
  { id: 1, krId: 1, title: "Create centralized engineering process documentation", owner: "Atul", status: "active", priority: "high", completion: 10, due: "Jun 7" },
  { id: 2, krId: 2, title: "Improve release scope communication and visibility", owner: "Atul", status: "active", priority: "high", completion: 15, due: "Jun 30" },
  { id: 3, krId: 4, title: "Perform RCA for April 2026 RC defects", owner: "Nikhil", status: "active", priority: "critical", completion: 0, due: "May 28" },
  { id: 4, krId: 7, title: "Align goals with organization", owner: "Divesh", status: "planned", priority: "high", completion: 0, due: "Apr 15" },
  { id: 5, krId: 7, title: "Request CarIT Web assignments", owner: "Divesh", status: "active", priority: "high", completion: 10, due: "Apr 30" },
  { id: 6, krId: 8, title: "Request WebforJ integration support", owner: "Divesh", status: "planned", priority: "critical", completion: 0, due: "May 15", blocker: "Awaiting architecture guidance" },
];

export const CHECKINS = [
  { id: 1, objId: 1, krId: 1, summary: "Initial engineering process standardization started", details: "Draft structure prepared for centralized documentation. Initial discussion completed with Kanban leads.", progress: 25, health: "green", date: "Apr 20", week: 19, type: "progress_update", wins: "Alignment achieved across engineering leads", blockers: "QA and rollback sections still pending" },
  { id: 2, objId: 1, krId: 2, summary: "Release scope awareness communication initiated", details: "Release references shared with teams for upcoming deployments including Jira release branch and Zendesk notes.", progress: 50, health: "green", date: "Apr 20", week: 19, type: "progress_update", wins: "Dev and QA teams acknowledged references", blockers: "No standardized acknowledgement mechanism yet" },
  { id: 3, objId: 1, krId: 3, summary: "Release ambiguity still observed during deployment", details: "Some activities still depend on verbal coordination instead of standardized flow.", progress: 15, health: "amber", date: "Apr 20", week: 19, type: "risk", wins: "Gaps identified early", blockers: "No documented ownership checklist" },
  { id: 4, objId: 2, krId: 4, summary: "RCA review activities started for April RC defects", details: "Initial defect analysis completed. Common defect patterns and testing gaps being identified.", progress: 15, health: "amber", date: "Apr 20", week: 19, type: "progress_update", wins: "Early defect categorization completed", blockers: "Some RCA inputs still pending from stakeholders" },
  { id: 5, objId: 2, krId: 5, summary: "Recurring defect trends observed in RC releases", details: "Multiple defects indicate gaps in validation coverage.", progress: 5, health: "red", date: "Apr 20", week: 19, type: "risk", wins: "Recurring themes identified", blockers: "Limited automated validation" },
  { id: 6, objId: 2, krId: 6, summary: "Corrective action tracking initiated", details: "Actions from RCA discussions being consolidated into shared tracking.", progress: 25, health: "green", date: "Apr 20", week: 19, type: "progress_update", wins: "Tracking approach agreed by engineering leads", blockers: "Action ownership assignment incomplete" },
  { id: 7, objId: 3, krId: 7, summary: "Initial alignment discussion completed", details: "Discussed organizational alignment for CarIT Web goals.", progress: 10, health: "green", date: "Apr 15", week: 15, type: "progress_update", wins: "Goals acknowledged by management", blockers: "Awaiting story allocation" },
  { id: 8, objId: 3, krId: 8, summary: "WebforJ integration still unclear", details: "Need management and architecture guidance for integration approach.", progress: 5, health: "amber", date: "Apr 20", week: 16, type: "risk", wins: "Received initial references", blockers: "Technical feasibility under discussion" },
];
