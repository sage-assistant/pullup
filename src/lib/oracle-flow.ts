import type { OraclePhase, SquadMember } from '@/lib/types';

export const ORACLE_STEPS = [
  { key: 'venueName', phase: 'situation' as OraclePhase },
  { key: 'city', phase: 'situation' as OraclePhase },
  { key: 'time', phase: 'situation' as OraclePhase },
  { key: 'targetName', phase: 'target' as OraclePhase },
  { key: 'targetCity', phase: 'target' as OraclePhase },
  { key: 'targetConfirm', phase: 'confirm' as OraclePhase },
  { key: 'squad', phase: 'ammo' as OraclePhase },
  { key: 'excuse', phase: 'ammo' as OraclePhase },
  { key: 'context', phase: 'ammo' as OraclePhase },
  { key: 'outrageLevel', phase: 'ammo' as OraclePhase },
] as const;

export type OracleStepKey = (typeof ORACLE_STEPS)[number]['key'];

export function getPhaseForStep(stepIndex: number): OraclePhase {
  return ORACLE_STEPS[Math.min(stepIndex, ORACLE_STEPS.length - 1)]?.phase ?? 'complete';
}

export function parseSquad(raw: string): SquadMember[] {
  return raw
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [name, role] = entry.split(/[:|-]/).map((part) => part.trim());
      return {
        name,
        role: role || (index === 0 ? 'Ringleader' : 'Confirmed chaos agent'),
      };
    });
}

export function parseOutrageLevel(raw: string): number {
  const match = raw.match(/\d+/);
  const value = match ? Number(match[0]) : 7;
  return Math.max(1, Math.min(10, value));
}

export function stripHtmlFences(text: string): string {
  return text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
}
