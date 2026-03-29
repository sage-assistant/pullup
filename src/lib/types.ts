export type OraclePhase =
  | 'situation'
  | 'target'
  | 'confirm'
  | 'ammo'
  | 'generate'
  | 'complete';

export type ResearchTarget = {
  name: string;
  city: string;
  summary?: string;
  title?: string;
  company?: string;
  school?: string;
  facts?: string[];
  confidenceNote?: string;
};

export type SquadMember = {
  name: string;
  role: string;
};

export type NightPlan = {
  venueName: string;
  venueAddress: string;
  city: string;
  time: string;
  target: ResearchTarget;
  squad: SquadMember[];
  excuse: string;
  context: string;
  outrageLevel: number;
};
