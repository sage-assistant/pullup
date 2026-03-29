# PULLUP — Build Spec

**Tagline:** "Your friends built you a whole website. That's how badly they want you there."

## What It Is
A web app where users can create personalized, AI-generated guilt-trip websites to convince their friends to come out tonight. The Oracle AI interviews you about the situation, researches your friend, and generates a full interactive website tailored specifically to them.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- OpenAI API (GPT-4o for Oracle chat + website generation)
- OpenAI GPT-4o with web_search tool for person research (no separate search API needed)
- Vercel for deployment
- No database — each generated site is a static HTML page served from /public/sites/[slug]

## Architecture

### Pages
1. **`/`** — Landing page (dark, premium, outrageous)
2. **`/create`** — The Oracle chat interface
3. **`/sites/[slug]`** — Generated guilt-trip websites (served as static HTML)

### API Routes
1. **`/api/oracle`** — Handles Oracle chat (streaming)
2. **`/api/research`** — Searches for person info using Brave Search
3. **`/api/generate`** — Generates the full HTML website and saves it

## Flow

### Landing Page (`/`)
- Dark, premium aesthetic (like #paid meets a nightclub)
- Big hero: "Your friend is bailing. We can fix that."
- Show examples of generated sites (screenshots/previews)
- One CTA button: "Build a Guilt Trip" → goes to /create
- Social proof: "47 friends dragged off their couches tonight" (fake counter)

### Oracle Chat (`/create`)
The Oracle is a snarky, funny AI interviewer. It asks questions in a conversational flow:

**Phase 1 — The Situation:**
- "What's happening tonight? Where are you trying to go?"
- "What city?"
- "What time?"

**Phase 2 — The Target:**
- "Who's the friend that's bailing? Full name."
- "What city are they in?"
- [Research happens here — API call to Brave Search]
- "I found [Name] — [Title] at [Company], [School]. Is this your friend?"
- User confirms or corrects

**Phase 3 — The Ammo:**
- "Who else is coming tonight? Names."
- "What excuse is your friend giving?"
- "Any inside jokes, nicknames, or context I should know about?"
- "On a scale of 1-10, how outrageous should this get?"

**Phase 4 — Generation:**
- "I have everything I need. Building your weapon now..."
- [Show animated progress: Researching... Writing copy... Building site... Deploying...]
- "Done. Here's your link: pullup.vercel.app/sites/[slug]"

### Chat UI
- Dark theme, clean, modern
- Messages animate in
- Oracle has a personality: witty, slightly menacing, very funny
- Show "typing" indicator during AI responses
- Research results show as a special card in the chat

### Generated Website
Each generated site is a SINGLE self-contained HTML file with inline CSS and JS. It should include:
- Entry/splash screen
- Personalized sections based on the friend's career, school, public profile
- Excuse destroyer (interactive)
- Squad roster (who's confirmed)
- Countdown timer to venue closing
- FOMO analysis
- Two timelines (stays home vs shows up)
- Petition to sign
- Final CTA with venue directions
- Easter eggs

The HTML generation prompt should reference the Dan Kligman and Adam Rivietz examples we built tonight as the quality bar.

### API: `/api/oracle` (POST, streaming)
```
Body: { messages: [...], phase: string }
Returns: streaming text response from GPT-4o
```

System prompt makes the Oracle a funny, snarky interviewer that follows the phase flow.

### API: `/api/research` (POST)
```
Body: { name: string, city: string }
Returns: { results: [...], summary: string }
```

Uses OpenAI GPT-4o with `web_search_preview` tool to find the person. Send a prompt like "Search for [name] in [city] and return their job title, company, school, and any notable public facts." The model will use its built-in web search. Extract: name, title, company, school, notable facts.

### API: `/api/generate` (POST)
```
Body: { 
  target: { name, title, company, school, facts },
  venue: { name, address, city, closingTime },
  squad: [{ name, role }],
  excuse: string,
  context: string,
  outrageLevel: number
}
Returns: { slug: string, url: string }
```

Calls GPT-4o with a massive prompt to generate the full HTML. Saves to /public/sites/[slug].html.

## Design Language
- Background: #0a0a0f
- Surfaces: #12121a, #1a1a25
- Borders: #222233
- Primary gradient: pink (#ff2d78) → purple (#8b5cf6) → blue (#3b82f6)
- Accent: cyan (#06b6d4), green (#10b981)
- Fonts: Inter (body), DM Serif Display (headlines), Space Mono (code/labels)
- Rounded corners, subtle glass effects, smooth animations
- The overall vibe: premium tech product meets absurdist comedy

## Environment Variables
```
OPENAI_API_KEY=<existing, already in .env.local>
```

Only OpenAI key needed. Research uses GPT-4o's built-in web search tool.

## IMPORTANT NOTES
- Generated sites get stored in a `generated-sites` directory and served via a catch-all route
- Each generated site must be a SINGLE index.html file, fully self-contained
- The Oracle chat should feel like talking to a real person, not a form
- Mobile responsive everything
- The landing page should be INSANELY good — this is the first impression
- No emojis in the design. Use proper icons or typography instead.
- Never use dashes (—, –) in marketing copy. Restructure sentences instead.
