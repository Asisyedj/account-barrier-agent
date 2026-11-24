export interface AccountBarrier {
  code: string;
  name: string;
  hospital: string;
  region: string;
  primaryElectrophysiologist: string;
  barrierCategory: 'CapEx Freeze' | 'EP Lab Scheduling' | 'Clinical Efficacy Skepticism' | 'Procurement Tender' | 'Training Certification';
  barrierDescription: string;
  recommendedDeckTitle: string;
  recommendedDeckUrl: string;
  clinicalTalkingPoints: string[];
  daysElapsed: number;
  status: 'Open' | 'Follow-up Due' | 'Escalated' | 'Resolved';
  lastAction: string;
  lastUpdated: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  accountCode: string;
  eventType: 'Rep Follow-up Due' | 'Manager Escalation Alert' | 'Deck Sent' | 'Barrier Overridden';
  channel: 'Teams Channel' | 'SendGrid Email' | 'Dataverse Sync';
  recipient: string;
  message: string;
  status: 'DELIVERED' | 'SIMULATED';
}

export const INITIAL_ACCOUNTS: AccountBarrier[] = [
  {
    code: 'VP-V2',
    name: 'London Heart Hospital - EP Lab 3',
    hospital: 'St. Thomas & Guy\'s NHS Trust',
    region: 'EMEA - UK North & London',
    primaryElectrophysiologist: 'Dr. Arthur Davies (Lead EP)',
    barrierCategory: 'CapEx Freeze',
    barrierDescription: 'Capital budget frozen until Q4. Trust procurement refusing to buy dedicated PFA generator without multi-catheter cross-compatibility validation.',
    recommendedDeckTitle: 'VARIPULSE™ TRUPULSE™ Generator Dual-Use & ROI Economic Model (v2.4 EMEA)',
    recommendedDeckUrl: 'https://medical.varipulse.com/decks/VP-V2-CapEx-Overcoming-Strategy.pdf',
    clinicalTalkingPoints: [
      'Zero additional generator investment required when utilizing existing CARTO® 3 integration module.',
      'Average lab turnover reduced by 34 minutes per procedure vs traditional Cryo-balloon.',
      'Acute Pulmonary Vein Isolation (PVI) first-pass success rate of 97.2% across 1,200 EMEA patient cohorts.',
      'Eliminates phrenic nerve palsy and zero reported esophageal thermal fistula incidents.'
    ],
    daysElapsed: 4,
    status: 'Open',
    lastAction: 'Clinical trial packet provided',
    lastUpdated: '2026-11-20'
  },
  {
    code: 'VP-CHARITE',
    name: 'Charité Universitätsmedizin Berlin',
    hospital: 'Charité Campus Mitte',
    region: 'EMEA - DACH',
    primaryElectrophysiologist: 'Prof. Dr. Hendrik Weber',
    barrierCategory: 'Clinical Efficacy Skepticism',
    barrierDescription: 'Chief of Cardiology prefers cryoballoon due to 5-year mature registries. Demands randomized comparative durability data.',
    recommendedDeckTitle: 'VARIPULSE™ vs Cryo/RF Durability & 1-Year Freedom from Atrial Arrhythmia (admIRE Cohort)',
    recommendedDeckUrl: 'https://medical.varipulse.com/decks/VP-CHARITE-admIRE-Trial-Comparative.pdf',
    clinicalTalkingPoints: [
      'admIRE multicenter trial demonstrated 85% 1-year freedom from documented AF episodes in paroxysmal cases.',
      'Tissue-selective electroporation prevents PV stenosis observed in chronic cryo follow-ups.',
      'Average RF application time: 1.2 minutes per vein vs 4 minutes freezing cycles.'
    ],
    daysElapsed: 9,
    status: 'Open',
    lastAction: 'Invited to Hamburg PFA Symposium',
    lastUpdated: '2026-11-15'
  },
  {
    code: 'VP-MILAN',
    name: 'IRCCS Policlinico San Donato',
    hospital: 'San Donato Milanese',
    region: 'EMEA - Southern Europe',
    primaryElectrophysiologist: 'Dr. Marco Rossi',
    barrierCategory: 'Procurement Tender',
    barrierDescription: 'Regional health authority tender RFP required before purchase orders can be cut. Tender timeline is 6 months.',
    recommendedDeckTitle: 'VARIPULSE™ Single-Source Procurement Justification & Health Technology Assessment (HTA)',
    recommendedDeckUrl: 'https://medical.varipulse.com/decks/VP-MILAN-HTA-Procurement-Dossier.pdf',
    clinicalTalkingPoints: [
      'Documented reduced length-of-stay enables same-day discharge for 78% of PFA ablation cases.',
      'Cost-neutral per-procedure reimbursement under current Italian DRG code 036.',
      'Accelerated procurement exemption available through Innovative Medical Technology fast-track.'
    ],
    daysElapsed: 16,
    status: 'Follow-up Due',
    lastAction: 'Tender dossier drafted with hospital procurement officer',
    lastUpdated: '2026-11-08'
  }
];
