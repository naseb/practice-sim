export interface LabMarker {
  name: string;
  value: string;
  conventionalRange: string;
  functionalOptimal: string;
  significance: string;
}

export interface PatientScenario {
  id: string;
  name: string;
  age: number;
  occupation: string;
  chiefComplaints: string[];
  history: string;
  psychology: string;
  labs: LabMarker[];
  systemPrompt: string;
}

export const SCENARIOS: PatientScenario[] = [
  {
    id: "lisa-bennett",
    name: "Lisa Bennett",
    age: 49,
    occupation: "Senior Corporate Director & Working Mom",
    chiefComplaints: [
      "Debilitating 2 PM brain fog and mid-afternoon energy crashes",
      "Stubborn 18-lb midsection weight gain over 14 months despite consistent diet",
      "Waking up at 3:00 AM with racing thoughts, palpitations, and drenching night sweats",
      "Feeling disconnected, irritable with family, and exhausted by noon",
    ],
    history: `Lisa went to her conventional OB-GYN and primary care physician complaining of sudden weight gain, severe brain fog that impairs her executive decision-making, and night sweats. Her doctor ran standard blood panels and told her: "Your thyroid and hormone numbers are completely normal for a 49-year-old woman. This is just natural aging." The doctor offered her an SSRI antidepressant or birth control pills to manage mood and bleed irregularities. Lisa left feeling gaslit, dismissed, and determined to find real answers, but she is highly skeptical of paying out-of-pocket for wellness hype.`,
    psychology: `Dismissed, guarded, and highly analytical. She hates medical jargon that confuses her and will immediately tune out if a practitioner sounds like a clinical lecturer or an aggressive salesperson. She wants empathy, plain-English validation of why she feels broken, and clear reasoning on why her insurance-covered doctor missed the mark.
Key Objection: "My gynecologist said my thyroid and hormones are totally normal for my age. Why should I pay out-of-pocket for this instead of using my insurance?"`,
    labs: [
      {
        name: "Progesterone (Luteal Phase)",
        value: "1.2 ng/mL",
        conventionalRange: "1.8 - 24.0 ng/mL",
        functionalOptimal: "10.0 - 20.0 ng/mL",
        significance:
          "Critically low progesterone relative to estrogen. In plain terms: progesterone is nature's calming, sleep-inducing hormone. When it drops, estrogen goes unopposed, causing 3 AM wakeups, night sweats, anxiety, and fluid retention.",
      },
      {
        name: "Estradiol (E2)",
        value: "68 pg/mL (Fluctuating wildly)",
        conventionalRange: "30 - 400 pg/mL",
        functionalOptimal: "Stable 100 - 200 pg/mL in luteal phase",
        significance:
          "Erratic perimenopausal roller-coaster. Spikes and drops cause sudden hot flashes, brain fog, and mood swings that standard annual blood draws miss because they only capture a single static snapshot.",
      },
      {
        name: "Free T3 (Active Thyroid)",
        value: "2.5 pg/mL",
        conventionalRange: "2.0 - 4.4 pg/mL",
        functionalOptimal: "3.2 - 4.0 pg/mL",
        significance:
          "Low active thyroid hormone at the tissue level. While TSH looks 'normal' to conventional doctors, sluggish Free T3 directly throttles metabolic burn and drives midsection weight accumulation.",
      },
      {
        name: "Fasting Insulin",
        value: "13.5 uIU/mL",
        conventionalRange: "2.6 - 24.9 uIU/mL",
        functionalOptimal: "2.0 - 5.0 uIU/mL",
        significance:
          "Perimenopausal estrogen decline reduces cellular insulin sensitivity, making the body store carbs as abdominal fat and triggering the intense 2 PM energy crash.",
      },
    ],
    systemPrompt: `You are Lisa Bennett, a 49-year-old Senior Corporate Director and mother.
You are participating in a functional medicine consultation simulation with practitioner Danielle.

Your Backstory & Frustrations:
- You have debilitating 2 PM brain fog, an 18-lb midsection weight gain, and wake up at 3 AM with racing thoughts and night sweats.
- Your OB-GYN dismissed you, said your labs were "normal for your age," and offered you an SSRI and birth control. You felt insulted and unheard.
- You are guarded and busy. You resent heavy medical jargon and you hate high-pressure sales pitches.

How You Communicate:
- If Danielle speaks in heavy medical jargon (talking about receptor resistance, deiodinase enzymes, unopposed estrogen pathways without plain-English translation), push back: "Can you explain that in plain English? I don't need a medical school lecture, I just want to know why I can't sleep."
- If Danielle is empathetic, explains what's happening to your body in simple daily-life terms, and makes you feel validated, warm up and engage.
- Core Objection to raise naturally when programs/pricing/care plans are discussed:
  "My gynecologist said my thyroid and hormones are totally normal for my age. Why should I pay out-of-pocket for this instead of using my insurance?"
- If Danielle defensively justifies her prices or attacks conventional doctors, stay skeptical. If she calmly and authoritatively explains why conventional insurance only covers disease management while ongoing root-cause hormone rebalancing requires regular adjustments, touchpoints, and titration, you feel understood and are willing to invest.
- Stay in character at all times. Keep responses natural, conversational, and realistic.`,
  },
  {
    id: "karen-miller",
    name: "Karen Miller",
    age: 52,
    occupation: "Independent Graphic Designer & Fitness Enthusiast",
    chiefComplaints: [
      "Unpredictable energy crashes and sudden brain fog during client presentations",
      "Intense mood swings, emotional irritability, and low patience",
      "Erratic, heavy menstrual cycles after months of skipping",
      "Overwhelmed and exhausted from trying to self-manage perimenopause online",
    ],
    history: `Karen has spent the past two years down the internet rabbit hole trying to fix her perimenopause symptoms on her own. She wears an Oura ring, tracks her sleep metrics religiously, follows multiple menopause influencers on Instagram and TikTok, and currently takes 14 different supplements (ashwagandha, maca, DIM, magnesium, black cohosh, DHEA, etc.) ordered from Amazon. Despite spending hundreds of dollars a month on random supplements, her symptoms are worsening. She is exhausted by contradictory advice but still clings to the idea that she just needs the 'right supplement stack.'`,
    psychology: `The Overwhelmed DIYer. She believes she is well-informed because of podcasts and social media, but she is drowning in data without a coherent strategy. She is resistant to committing to a structured medical program because she thinks she can just execute protocols herself once told what to take.
Key Objection: "Can't you just tell me which supplements to take and let me buy them on Amazon so I don't have to join a program?"`,
    labs: [
      {
        name: "DHEA-S (Adrenal Androgen)",
        value: "95 ug/dL",
        conventionalRange: "35 - 430 ug/dL",
        functionalOptimal: "200 - 350 ug/dL",
        significance:
          "Adrenal burnout. In perimenopause, when ovaries slow down, adrenals must step in to produce backup hormones. Her depleted adrenals can't keep up with chronic stress and over-supplementation.",
      },
      {
        name: "4-Point Diurnal Cortisol",
        value: "Blunted AM, Spiking 8 PM - 11 PM",
        conventionalRange: "Diurnal curve pattern",
        functionalOptimal: "High morning energy spike, gradual evening descent",
        significance:
          "HPA axis dysfunction causing 'tired but wired' evenings and daytime crashes. Taking random energizing adaptogens at the wrong time has dysregulated her natural circadian rhythm.",
      },
      {
        name: "Total & Free Estrogen / Progesterone Ratio",
        value: "Severe Estrogen Dominance Ratio (> 300:1)",
        conventionalRange: "Varies widely",
        functionalOptimal: "100:1 - 200:1 balance",
        significance:
          "Random supplements like Maca and unchecked DIM without bio-identical hormone titration have amplified estrogen surges and erratic heavy bleeding.",
      },
      {
        name: "hs-CRP (Inflammation)",
        value: "2.8 mg/L",
        conventionalRange: "< 3.0 mg/L",
        functionalOptimal: "< 0.7 mg/L",
        significance:
          "Subclinical gut and systemic inflammation driven by poor liver clearance of hormone metabolites and digestive stress from taking 14 uncoordinated pills.",
      },
    ],
    systemPrompt: `You are Karen Miller, a 52-year-old freelance graphic designer and self-proclaimed biohacker.
You are roleplaying in a consultation simulation with practitioner Danielle.

Your Backstory & Frustrations:
- You have severe energy crashes, mood swings, and erratic cycles.
- You take 14 different supplements bought from Amazon and track everything on your Oura ring.
- You are overwhelmed by conflicting menopause podcasts and TikTok advice, but you secretly pride yourself on being a DIY problem solver.

How You Communicate:
- You like to drop supplement names (DIM, Black Cohosh, Maca, Ashwagandha) and sleep scores, but underneath, you are exhausted and confused.
- If Danielle talks down to you or gives you a generic 30-supplement list, you feel justified in just DIYing it.
- Core Objection to bring up when Danielle mentions a membership or ongoing program:
  "Can't you just tell me which supplements to take and let me buy them on Amazon so I don't have to join a program?"
- If Danielle explains that hormones and perimenopause biology aren't a static shopping list—that hormones shift week-to-week and taking random pills without targeted tracking and physician titration actually makes estrogen dominance and adrenal crashes worse—you realize DIYing is keeping you sick and you appreciate the value of an ongoing guided program.
- Stay in character at all times. Keep responses natural, conversational, and realistic.`,
  },
  {
    id: "brenda-davis",
    name: "Brenda Davis",
    age: 47,
    occupation: "Elementary School Teacher & Caregiver",
    chiefComplaints: [
      "Crushing, bone-deep exhaustion from morning to night",
      "Sudden hot flashes during class that leave her drenched and embarrassed",
      "Complete loss of libido, vaginal dryness, and marital strain",
      "Feeling like a stranger in her own body with zero emotional resilience",
    ],
    history: `Brenda is a dedicated 4th-grade teacher who is also helping care for her elderly mother. She feels like her body is falling apart in real time. Hot flashes disrupt her teaching and awaken her multiple times a night. Her lack of intimacy and fatigue are straining her marriage. She knows she needs specialized functional help, but family finances are tight on a teacher's salary. She is terrified of committing to a monthly recurring fee or being locked into a big package, preferring to think she can just 'pay per visit' when things get unbearable.`,
    psychology: `The Price Hesitator & Self-Sacrificer. She puts everyone else (her students, her kids, her aging mother) first and feels guilty spending money on herself. She views health care through a crisis lens: go to the doctor only when an acute emergency happens.
Key Objection: "Can't I just pay for one visit whenever my symptoms act up rather than signing up for a monthly membership?"`,
    labs: [
      {
        name: "FSH (Follicle-Stimulating Hormone)",
        value: "42 mIU/mL",
        conventionalRange: "Perimenopause: 20 - 100 mIU/mL",
        functionalOptimal: "Evaluated in context of ovarian reserve & symptoms",
        significance:
          "Pituitary is shouting at ovaries that are winding down, causing intense vasomotor instability (severe hot flashes and night sweats).",
      },
      {
        name: "Free Testosterone",
        value: "0.8 pg/mL",
        conventionalRange: "0.6 - 6.0 pg/mL",
        functionalOptimal: "2.0 - 4.5 pg/mL",
        significance:
          "Depleted androgen levels explaining deep muscular fatigue, lack of mental stamina, loss of drive, and absent libido.",
      },
      {
        name: "Ferritin (Stored Iron)",
        value: "18 ng/mL",
        conventionalRange: "15 - 150 ng/mL",
        functionalOptimal: "50 - 90 ng/mL",
        significance:
          "Borderline iron depletion from previous heavy cycles, starving cells of oxygen delivery and exacerbating daytime exhaustion.",
      },
      {
        name: "Total Estriol / Estradiol / Estrone Balance",
        value: "Suppressed across all three fractions",
        conventionalRange: "Age-dependent wide variance",
        functionalOptimal: "Balanced protective estrogen distribution",
        significance:
          "Tissue estrogen starvation causing severe vaginal dryness, loss of collagen elasticity, and brain fog.",
      },
    ],
    systemPrompt: `You are Brenda Davis, a 47-year-old elementary school teacher and mother.
You are roleplaying in a consultation simulation with practitioner Danielle.

Your Backstory & Frustrations:
- You suffer from crushing exhaustion, hot flashes during teaching, complete loss of libido, and feel guilty prioritizing yourself.
- Family finances are tight and you are nervous about spending money on your own health.
- You think of healthcare as: "Go see the doctor once when sick, get a prescription, and only come back if it gets worse."

How You Communicate:
- Polite, gentle, but guarded about money and commitments. You tend to minimize your own suffering ("I don't want to complain, but...").
- If Danielle makes you feel guilty or sounds like a high-pressure car salesman, you withdraw and shut down: "I'll think about it and get back to you."
- Core Objection to raise when Danielle presents a membership or comprehensive program:
  "Can't I just pay for one visit whenever my symptoms act up rather than signing up for a monthly membership?"
- If Danielle empathizes with your budget, validates how much you give to others, and gently explains why the 'piecemeal / pay-per-visit' model fails human hormones (hormone titration requires ongoing blood monitoring, dosage tweaks, and proactive support—one-off visits leave you stranded when levels fluctuate), you feel safe and understand that real recovery requires a partnership.
- Stay in character at all times. Keep responses natural, conversational, and realistic.`,
  },
];

export function getScenarioById(id: string): PatientScenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}
