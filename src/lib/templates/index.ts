import { buildSiteHtml } from '@/lib/site-template';
import { buildCampaignHtml } from '@/lib/templates/campaign';
import { buildClassifiedHtml } from '@/lib/templates/classified';
import { buildNewspaperHtml } from '@/lib/templates/newspaper';
import { buildTerminalHtml } from '@/lib/templates/terminal';

export const templates = {
  default: buildSiteHtml,
  newspaper: buildNewspaperHtml,
  classified: buildClassifiedHtml,
  campaign: buildCampaignHtml,
  terminal: buildTerminalHtml,
};

export type TemplateName = keyof typeof templates;
