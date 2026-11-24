# VARIPULSE™ (VP-V2) Medical Sales Account-Barrier Architecture
## Enterprise Microsoft Ecosystem Integration Guide

This document specifies the enterprise-grade architecture for deploying the **VARIPULSE™ (VP-V2) Account-Barrier Agent** across the Microsoft Cloud ecosystem, integrating **Microsoft Copilot Studio**, **Microsoft Dataverse**, **Power Automate Cloud Flows**, and **Microsoft Teams**.

---

## 1. High-Level Architectural Topology

```
+-----------------------------------------------------------------------------------+
|                            EMEA FIELD SALES REP / SPECIALIST                      |
|                               (Microsoft Teams Mobile / Desktop)                  |
+-----------------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                          MICROSOFT COPILOT STUDIO                                 |
|  - Topic: "Account Barrier Inquiry" (Trigger: Code 'VP-V2', hospital name)       |
|  - Generative AI Orchestration: Clinical talking points & PFA trial citations    |
|  - Presentation Deck Resolver: Matches barrier type to approved Medical PPT/PDF  |
+-----------------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                          MICROSOFT DATAVERSE (CRM LEDGER)                         |
|  - Table: `cr_varipulse_account_barrier` (Hospital, EP Lead, Barrier, Deck)       |
|  - Table: `cr_commercial_audit_log` (Dispatches, Timestamps, Webhook states)     |
+-----------------------------------------------------------------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
+------------------------------------+   +------------------------------------+
| POWER AUTOMATE: 3-DAY CHECK-IN     |   | POWER AUTOMATE: 14-DAY ESCALATION  |
| - Recurrence: Daily Evaluation     |   | - Recurrence: Daily Evaluation     |
| - Condition: DaysElapsed >= 3      |   | - Condition: DaysElapsed >= 14     |
| - Action: Teams Adaptive Card Rep  |   | - Action: SendGrid Director Alert  |
|   Reminder with quick action CTA   |   |   & High-Priority Teams Broadcast  |
+------------------------------------+   +------------------------------------+
```

---

## 2. Microsoft Copilot Studio Configuration

### 2.1 Trigger Phrases & Topic Schema
* **Topic Name:** `VARIPULSE_Account_Barrier_Resolution`
* **Trigger Phrases:**
  * "Lookup barrier for account VP-V2"
  * "Need clinical deck for St. Thomas EP lab"
  * "Charité Berlin cardiology chief is skeptical of PFA durability"
  * "Hospital frozen capital expenditure for ablation generator"
  * "How do I fast-track VARIPULSE tender in Milan?"

### 2.2 Entity Extraction
* `@AccountCode`: Custom regex entity `^VP-[A-Z0-9]{2,10}$`
* `@BarrierCategory`: Pre-built choice list (`CapEx Freeze`, `Clinical Efficacy Skepticism`, `Procurement Tender`, `EP Lab Scheduling`, `Training Certification`)

### 2.3 Conversational Output Actions
* Calls Power Automate Flow `Get-AccountBarrierDossier` passing `AccountCode`.
* Returns formatted adaptive card containing:
  1. Hospital & Lead Electrophysiologist profile
  2. Primary barrier diagnosis
  3. Verified empirical talking points (admIRE trial, 97.2% acute PVI rate, zero esophageal fistula)
  4. One-click deep link to authenticated SharePoint/Veeva medical presentation deck.

---

## 3. Microsoft Dataverse Data Schema

### 3.1 Primary Table: `cr_varipulse_account_barrier`
| Column Logical Name | Display Name | Type | Description |
|----------------------|--------------|------|-------------|
| `cr_accountcode` | Account Code | Single Line Text (Key) | e.g., `VP-V2` |
| `cr_hospitalname` | Hospital / Trust Name | Single Line Text | e.g., `St. Thomas & Guy's NHS Trust` |
| `cr_region` | EMEA Sales Region | Choice | UK North, DACH, Southern Europe |
| `cr_leadelectrophysiologist` | Lead EP | Single Line Text | e.g., `Dr. Arthur Davies` |
| `cr_barriercategory` | Barrier Category | Choice | CapEx, Durability, Tender, Scheduling |
| `cr_barrierdescription` | Barrier Summary | Multiple Lines of Text | Ground truth field notes from specialist |
| `cr_recommendeddeckurl` | Presentation Deck URL | URL | Approved Veeva/SharePoint URL |
| `cr_daysinpipeline` | Days Elapsed | Whole Number | Incremented by scheduled flow |
| `cr_status` | Barrier Status | State / Choice | `Open`, `Follow-up Due`, `Escalated`, `Resolved` |

### 3.2 Audit Log Table: `cr_commercial_audit_log`
* `cr_auditid`: Unique GUID
* `cr_eventtype`: `Rep Follow-up Due` | `Manager Escalation Alert` | `Deck Sent`
* `cr_channel`: `Teams Channel` | `SendGrid Email` | `Dataverse Sync`
* `cr_payloadpreview`: JSON snapshot of webhook request body
* `cr_executionstatus`: `DELIVERED` | `FAILED`

---

## 4. Power Automate Cloud Flows

### Flow 1: Daily Pipeline Cadence & Follow-Up Evaluator (`Daily-Barrier-Evaluator`)
1. **Trigger:** Recurrence (Daily at 06:00 UTC).
2. **List Records:** Query `cr_varipulse_account_barrier` where `cr_status ne 'Resolved'`.
3. **Condition 1 (Rep Follow-up Due):**
   * If `cr_daysinpipeline >= 3` and `cr_status eq 'Open'`:
     * Update record `cr_status = 'Follow-up Due'`.
     * Post Adaptive Card to sales rep's 1:1 Teams chat with buttons: `[Log Doctor Call]`, `[Extend 7 Days]`, `[Resolve]`.
4. **Condition 2 (Executive Manager Escalation):**
   * If `cr_daysinpipeline >= 14` and `cr_status ne 'Resolved'`:
     * Update record `cr_status = 'Escalated'`.
     * Send High-Priority Notification to EMEA Regional Commercial Director via SendGrid / Outlook 365 Connector.
     * Post Escalation Card to `#emea-commercial-escalations` Teams channel.

---

## 5. Microsoft Teams Integration (Adaptive Card Spec)

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "🚨 VARIPULSE™ Barrier Follow-Up Required",
      "weight": "Bolder",
      "size": "Medium",
      "color": "Warning"
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Account Code:", "value": "VP-V2" },
        { "title": "Hospital:", "value": "St. Thomas NHS Trust" },
        { "title": "Lead EP:", "value": "Dr. Arthur Davies" },
        { "title": "Barrier:", "value": "CapEx Freeze (Generator budget)" },
        { "title": "Days Stalled:", "value": "4 Days" }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Recommended Deck: VARIPULSE™ TRUPULSE™ Dual-Use & ROI Economic Model",
      "wrap": true
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "Open Presentation Deck",
      "url": "https://medical.varipulse.com/decks/VP-V2-CapEx-Overcoming-Strategy.pdf"
    },
    {
      "type": "Action.Submit",
      "title": "Mark Follow-Up Completed",
      "data": { "action": "resolve_barrier", "accountCode": "VP-V2" }
    }
  ]
}
```

---

## 6. Zero-Config Simulator Mode (`NEXT_PUBLIC_SIMULATOR_MODE=true`)

When deployed to Vercel or running locally with `NEXT_PUBLIC_SIMULATOR_MODE=true`:
* Zero external Microsoft 365 or Dataverse tenant access is required for initial inspection and demo.
* The frontend utilizes an in-memory client state store mirroring the Dataverse entity model.
* Fast-forward buttons (`+3 Days` and `+2 Weeks`) execute client-side state transformations that trigger simulated Power Automate notifications into the interactive Commercial Ops Audit Log stream.
