import { buildSiteSlug, writeGeneratedSite } from '@/lib/generated-sites';
import { openai, requireOpenAIKey } from '@/lib/openai';
import { type SiteContent } from '@/lib/site-template';
import { templates, type TemplateName } from '@/lib/templates';
import type { NightPlan } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

function buildContentPrompt(data: NightPlan) {
  return `Generate personalized content for a guilt-trip website convincing ${data.target.name} to go to ${data.venueName} tonight.

Target info:
- Name: ${data.target.name}
- Title: ${data.target.title || 'Unknown'}
- Company: ${data.target.company || 'Unknown'}
- School: ${data.target.school || 'Unknown'}
- Facts: ${(data.target.facts || []).join(' | ') || 'None'}

Tonight:
- Venue: ${data.venueName}, ${data.venueAddress}, ${data.city}
- Closing: ${data.time}
- Squad: ${data.squad.map(s => s.name).join(', ') || 'Friends'}
- Excuse they gave: "${data.excuse}"
- Context/inside jokes: ${data.context || 'None'}
- Outrage level: ${data.outrageLevel}/10

Return ONLY valid JSON (no markdown fences) with these fields:
{
  "template": "pick one of: newspaper, classified, campaign, terminal, default. Choose the best visual theme for their personality and the event type.",
  "splashTagline": "dramatic one-liner for the splash screen, reference their name",
  "heroHeadline": "big dramatic headline with their name, like 'JAKE, THE CONCERT IS TONIGHT.'",
  "heroSubtitle": "2-3 sentence subtitle explaining the situation with humor",
  "roastParagraph1": "paragraph roasting them using their job/school/company. Make it specific and funny. Reference real details.",
  "roastParagraph2": "second paragraph escalating the roast. Reference their excuse and why it's pathetic given who they are.",
  "excuseResponses": ["array of 6 funny responses to destroy their excuse. Each should be 1-2 sentences. Reference their career, school, or company when possible."],
  "timelineStayHome": ["array of 6 timeline entries for if they stay home. Each a short sentence. Start mundane, end with FOMO and regret. Be specific and funny."],
  "timelineShowUp": ["array of 6 timeline entries for if they show up. Each a short sentence. Build from arrival to legendary night. Be specific."],
  "consequences": ["array of 4 consequences of not attending. Each 1-2 sentences. Make them funny but cutting. Reference the squad, the venue, and their professional life."],
  "petitionSignatures": [{"name":"Name","time":"X min ago"}, ... 6 fake signatures including the squad members, someone funny like their couch or uber driver],
  "finalCta": "dramatic final headline like 'THE UBER TAKES 8 MINUTES, JAKE.'"
}

Be funny, sharp, specific. Use their real career details. No generic humor. Outrage level ${data.outrageLevel}/10 means ${data.outrageLevel >= 8 ? 'absolutely unhinged, push every boundary' : data.outrageLevel >= 5 ? 'solidly aggressive with real edge' : 'playful but pointed'}. Never use dashes (em dash, en dash). Never use emojis.`;
}

function pickTemplateName(value: unknown): TemplateName {
  if (typeof value !== 'string') {
    return 'default';
  }

  if (value in templates) {
    return value as TemplateName;
  }

  return 'default';
}

export async function POST(request: Request) {
  requireOpenAIKey();
  const body = (await request.json()) as {
    target: NightPlan['target'];
    venue: { name: string; address: string; city: string; closingTime: string };
    squad: NightPlan['squad'];
    excuse: string;
    context: string;
    outrageLevel: number;
  };

  const plan: NightPlan = {
    venueName: body.venue.name,
    venueAddress: body.venue.address,
    city: body.venue.city,
    time: body.venue.closingTime,
    target: body.target,
    squad: body.squad,
    excuse: body.excuse,
    context: body.context,
    outrageLevel: body.outrageLevel,
  };

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      instructions: 'You generate personalized comedic content for guilt-trip websites. Return only valid JSON. No markdown fences. No explanation.',
      input: buildContentPrompt(plan),
      temperature: 0.95,
      max_output_tokens: 4000,
    });

    let text = response.output_text.trim();
    text = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
    
    let content: Partial<SiteContent> & { template?: unknown };
    try {
      content = JSON.parse(text);
    } catch {
      return Response.json({ error: 'AI returned invalid content. Try again.' }, { status: 502 });
    }

    const siteContent: SiteContent = {
      targetName: plan.target.name,
      targetTitle: plan.target.title || '',
      targetCompany: plan.target.company || '',
      targetSchool: plan.target.school || '',
      targetFacts: plan.target.facts || [],
      venueName: plan.venueName,
      venueAddress: plan.venueAddress,
      venueCity: plan.city,
      closingTime: plan.time,
      squad: plan.squad,
      excuse: plan.excuse,
      context: plan.context,
      outrageLevel: plan.outrageLevel,
      splashTagline: content.splashTagline || `This website was built specifically for ${plan.target.name}`,
      heroHeadline: content.heroHeadline || `${plan.target.name}, you are needed tonight.`,
      heroSubtitle: content.heroSubtitle || 'Your friends built you a whole website. That should tell you something.',
      roastParagraph1: content.roastParagraph1 || '',
      roastParagraph2: content.roastParagraph2 || '',
      excuseResponses: content.excuseResponses || ['Your excuse has been rejected.', 'Try again.', 'Still no.', 'The Oracle says no.', 'Denied.', 'Get in the Uber.'],
      timelineStayHome: content.timelineStayHome || ['Falls asleep on couch', 'Wakes up to photos', 'Regret sets in', 'Opens Instagram', 'Sees everyone having fun', 'Whispers "I should have gone"'],
      timelineShowUp: content.timelineShowUp || ['Walks in', 'Crew goes wild', 'Best conversation of the month', 'Loses track of time', 'Everyone agrees it was legendary', 'No regrets'],
      consequences: content.consequences || ['The photos will be incredible. You won\'t be in them.', 'Inside jokes will be born tonight that you\'ll never understand.', 'This website will remain online forever.', 'Your friends will remember.'],
      petitionSignatures: content.petitionSignatures || plan.squad.map(s => ({ name: s.name, time: '5 min ago' })),
      finalCta: content.finalCta || `${plan.venueName}. Tonight. Be there.`,
    };

    const templateName = pickTemplateName(content.template);
    const html = templates[templateName](siteContent);
    const slug = buildSiteSlug(plan.target.name, plan.venueName);
    const blobUrl = await writeGeneratedSite(slug, html);

    return Response.json({ slug, url: `/s/${slug}`, template: templateName });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Generate error:', message);
    return Response.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}
