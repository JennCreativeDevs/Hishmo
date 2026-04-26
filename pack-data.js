/* ============================================================
   Hishmo demo — Somali language pack data
   ------------------------------------------------------------
   Single source of truth for the in-browser demo. Every Somali
   string in this file appears verbatim in:

     language-packs/somali/glossary.md            (intercepts, triggers, signals)
     language-packs/somali/voice-scripts.md       (consent, panic, close, handoff)
     language-packs/somali/caseworker-behaviors.md (would-you-want frame)
     language-packs/somali/resources.md           (verified Seattle directory)

   The four canonical glossary intercepts in PACK.glossaryIntercepts MUST stay
   byte-identical to language-packs/somali/tests/glossary_intercepts.json
   so the Kotlin test fixture (glossary_test.kt) and this demo agree.

   Do not invent Somali. If a string isn't in the pack files, stop and ask.
   ============================================================ */

(function () {
  "use strict";

  // -- 1. Glossary intercepts (glossary.md §3) ----------------------------
  // These four English concepts must be intercepted BEFORE the NLLB MT call
  // and replaced with the canonical Somali functional rewrite.
  // Hard regression: glossary_test.kt asserts exact match for every entry.

  const glossaryIntercepts = {
    "consent":
      "Adigu ma rabtay in tani dhacdo? Ma kala ogtahay waxaa kasoo dhalan kara?",
    "confidential":
      "Sirta waa la ilaaliyaa — ma jiro qof Soomaali ah oo dhageysanaya, codkaaga lama duubo.",
    "psychological abuse":
      "Ma jiraa qof ku cabsi gelinaya, kaa kaxeeya saaxiibada, kuu sheega waxa aad samayso ama aanad samayn?",
    "restraining order":
      "Warqad sharci ah oo ka mamnuucaysa inuu kuugu soo dhowaado guriga, shaqada, iskuulka carruurta — ka dibna magaceedu waa 'restraining order'.",
  };

  // -- 2. Direct content triggers (glossary.md §1) -------------------------
  // 8 entries. Detection runs against the post-MMS Somali text, pre-MT.
  // Tier red ⛑ = pause intake; amber ⚠ = confirm safety; blue ◇ = noticed only.

  const directTriggers = [
    {
      id: "gacan_ka_hadal",
      // Matches both citation form ("gacan ka hadal") and conjugated
      // forms ("gacan ayuu kala hadlayey"). Verb stem hadl-; noun hadal.
      pattern: /gacan\b[^.!?]{1,30}\bhad(al|l\w+)/i,
      tag: "physical_violence_described",
      tier: "red",
      coach:
        "Physical-violence language. Pause intake, confirm immediate safety, offer ED + 911 with EMTALA + Somali-specific status caveats.",
    },
    {
      id: "cabsi_gelin",
      // Matches citation ("cabsi gelin") + conjugations ("cabsi geliyaa")
      pattern: /cabsi\s+geli\w+/i,
      tag: "intimidation_described",
      tier: "amber",
      coach:
        "Intimidation language. Confirm immediate safety before continuing intake.",
    },
    {
      id: "dhuumli",
      pattern: /\b(dhuumli|dhuumi[\-\s]?dhuumi)\b/i,
      tag: "concealment_described",
      tier: "amber",
      coach:
        "She is describing hiding. Slow down, ask permission before pressing.",
    },
    {
      id: "u_dulqaado",
      pattern: /u\s+dulqaado/i,
      tag: "silencing_pressure_reported",
      tier: "blue",
      coach:
        "Patience-pressure framing. Do NOT validate as endurance; reflect dadaal (effort) instead.",
    },
    {
      id: "xishood_ceeb",
      pattern: /\b(xishood|xisood|ceeb)\b/i,
      tag: "shame_frame_named",
      tier: "blue",
      coach:
        "Shame frame. Slow down. Lead with sir. Suggest: \"sirta waa la ilaaliyaa, ma rabtaa fasax?\"",
    },
    {
      id: "waa_la_i_dilaa",
      pattern: /waa\s+la\s+i\s+dilaa/i,
      tag: "physical_violence_described",
      tier: "red",
      coach:
        "Direct disclosure of being beaten. Pause, confirm safety, surface ED + DV hotline.",
    },
    {
      id: "waa_la_i_caayaa",
      pattern: /waa\s+la\s+i\s+caayaa/i,
      tag: "verbal_abuse_described",
      tier: "amber",
      coach:
        "Verbal-abuse description. Confirm what she means; surface emotional-safety resources.",
    },
    {
      id: "kala_dareemiyaa",
      pattern: /(waa\s+la\s+i\s+kala\s+dareemiyaa|la\s+i\s+kala\s+wax\s+dareem\s+maayo)/i,
      tag: "coercive_control_described",
      tier: "amber",
      coach:
        "Coercive-control description. Confirm specifics; route to advocacy framing.",
    },
  ];

  // -- 3. Inferential signals (glossary.md §2) -----------------------------
  // 12 entries. Surfaced as POSSIBLE only. Two or more in a session promote
  // to PROBABLE. Religious-framing-alone (NO_CLUSTER_ALONE) does NOT promote.
  // Never auto-label structured note fields from these — coaching only.

  const inferentialSignals = [
    {
      id: "fear_on_arrival",
      pattern: /(carruur.*aamus|carruur.*cabsa|way\s+ka\s+cabsadaan|markuu\s+yimaado)/i,
      hypothesis: "possible coercive household climate",
      tier: "blue",
      note: "Household fear pattern when one person arrives.",
      coach: "Children-fear pattern — reflect, don't press.",
    },
    {
      id: "futurity_refusal",
      pattern: /(ma\s+jeclaan\s+lahaa.*gabadhayda|gabadhayda.*sidan\s+ku\s+noolaato|saaxiibtayda\s+u\s+sheegi\s+maayo)/i,
      hypothesis: "she names her own moral evaluation through displacement",
      tier: "blue",
      note: "Futurity refusal — \"I would not want my daughter to live like this.\"",
      coach: "Use the would-you-want frame to reflect.",
    },
    {
      id: "lost_peace",
      pattern: /(ku\s+raaxaysan\s+waayey|naf\s+qabow\s+ma\s+helo)/i,
      hypothesis: "psychological depletion",
      tier: "blue",
      note: "Lost peace / lost comfort.",
      coach: "Ask about sleep, fear, energy — not 'abuse'.",
    },
    {
      id: "home_not_safe",
      pattern: /(guriga\s+ma\s+ammaan\s+aha|guriga\s+ma\s+jecla\s+in\s+aan\s+ka\s+tago)/i,
      hypothesis: "direct safety concern, often without categorical naming",
      tier: "amber",
      note: "Home-not-safe framing.",
      coach: "Ask permission to talk about what ammaan (safety) would look like.",
    },
    {
      id: "somatized",
      pattern: /(caajisnimo|madaxa\s+aad\s+ayuu\s+i\s+xanuunsada|ma\s+cuni\s+karo)/i,
      hypothesis: "somatic expression of chronic stress; common in Somali presentation",
      tier: "blue",
      note: "Somatized depletion.",
      coach: "Route to mental-health resource framing, not DV framing.",
    },
    {
      id: "religious",
      pattern: /(allah\s+ayaa\s+qoray|sabar\s+buu\s+i\s+siiyay)/i,
      hypothesis: "possible u dulqaado internalization OR coping; do not assume abuse",
      tier: "blue",
      note: "Religious / fatalistic framing.",
      coach: "Do not challenge faith framing. Reflect naxariis the survivor is showing herself.",
    },
    {
      id: "displacement",
      pattern: /(saaxiibtayda\s+mid\s+baa\s+ku\s+jirta|qof\s+aan\s+aqaano\s+sidan\s+ku\s+jiro|saaxiibtay.*xaalad)/i,
      hypothesis: "classic projection — she may be describing herself",
      tier: "blue",
      note: "Displacement onto a 'friend' or 'neighbor'.",
      coach: "Do not name the projection. Reflect what she described as important.",
    },
    {
      id: "cultural_script",
      pattern: /(ragga\s+soomaaliyeed\s+waxay|sida\s+xaaska\s+soomaaliyeed\s+loo\s+dhaqo)/i,
      hypothesis: "she is describing a cultural script she may be inside of",
      tier: "blue",
      note: "Cultural / clan-pattern framing.",
      coach: "Ask if any of ragga or xaaska describes her own home.",
    },
    {
      id: "voice_silenced",
      pattern: /(ka\s+cabsado\s+markaan\s+hadlayo|inta\s+uu\s+joogo,?\s+ma\s+hadli\s+karo)/i,
      hypothesis: "possible coercive control over voice",
      tier: "amber",
      note: "Body-language / silence pattern reported.",
      coach: "Name what sirta would mean for her in this room.",
    },
    {
      id: "what_would_you_do",
      pattern: /adigu\s+maxaad\s+samayn\s+lahayd/i,
      hypothesis: "she is asking the worker to model her moral evaluation",
      tier: "blue",
      note: "What-would-you-do reversal.",
      coach: "Reflect adigu adiga ayaa go'aamiya (you decide) and offer options.",
    },
    {
      id: "children_behavior_change",
      pattern: /(wiilkayga\s+iskuulka\s+muu\s+rabo|carruurta\s+hurdada\s+ma\s+jecla)/i,
      hypothesis: "family-system stress; leading indirect indicator",
      tier: "blue",
      note: "Children's behavior change as anchor.",
      coach: "Connect to family-support framing.",
    },
    {
      id: "long_pause_diversion",
      pattern: /(\.\.\.|…)\s*$/,
      hypothesis: "she is approaching a hard truth and pulling back",
      tier: "blue",
      note: "Long pause + softened voice + diversion (paralinguistic).",
      coach: "She went quiet — wait. Don't fill the silence.",
    },
  ];

  // -- 4. Anti-clustering rules (glossary.md §2.2) -------------------------
  // Religious framing alone is NOT abuse evidence.
  // Generic xishood / ceeb mentions in cultural discussion are not abuse signals.
  // One-off mention of a friend is conversation, not projection.

  const antiClusterAlone = new Set(["religious"]);

  // -- 5. Survivor command triggers (glossary.md §4) -----------------------
  // Heard, not detected. Override the worker's flow.

  const survivorCommands = {
    jooji: {
      label: "jooji",
      effect: "Pause session immediately. Mic muted, HUD blanked.",
      survivorVisible:
        "Wax walba waa la joojiyay. Ma jiro wax la dhageysanayo.",
      english:
        "Everything paused. Nothing is being heard.",
    },
    qof: {
      label: "qof",
      effect:
        "Surface human-interpreter offer. Out-of-region cities: Minneapolis, Columbus, Toronto, London. Survivor told the city before the call connects.",
      survivorVisible:
        "Waxaan kuu soo gelinayaa haweenay Soomaali ah oo aan magaalada {CITY} ka yimid.",
      english:
        "I am bringing in a Somali woman from {CITY}.",
    },
    tirtir: {
      label: "tirtir",
      effect: "Wipe everything (worker-confirmed, then executed).",
      survivorVisible:
        "Ma rabtaa runtii in la tirtiro? Hadii haa, dheh \"haa\".",
      english: "Do you really want to erase? If yes, say \"haa\".",
    },
    haa: { label: "haa", effect: "Affirmative." },
    maya: { label: "maya", effect: "Negative — end session." },
    ogol: { label: "ogol", effect: "Affirmative to two-party-consent disclosure." },
  };

  // -- 6. Out-of-region interpreter cities (caseworker-behaviors §7) -------
  // Geography is the trust signal. Never Seattle.

  const interpreterCities = ["Minneapolis", "Columbus", "Toronto", "London"];

  // -- 7. Voice scripts (voice-scripts.md, verbatim) -----------------------

  const voiceScripts = {
    consentInPerson: {
      somali:
        "Salaan. Sirta waa la ilaaliyaa.\n\nWax aan diyaarsanahay inaan ku caawiyo, laakiin ma ihi qof Soomaali ah, ma ihi ciidan, ma ihi qof masjidka ka tirsan, ma ihi qof ka shaqeeya socdaalka.\n\nCodkaaga lama duubo. Hadalkaaga waxaa loo bedelayaa qoraal Ingiriis ah qof shaqaale ah ay arkaan, laakiin codkaagu ma jirayo waxba.\n\nHadaad rabto inaan istaajiyo, dheh \"jooji\". Hadaad rabto qof Soomaali ah oo aan magaalo kale ka yimid taleefoonka soo galo, dheh \"qof\". Hadaad rabto inaan tirtiro wax kasta, dheh \"tirtir\".\n\nMahadsanid.",
      english:
        "Hello. The secret is kept.\n\nI am here to help, but I am not a Somali person, not police, not someone from the mosque, not someone who works in immigration.\n\nYour voice is not recorded. Your speech is converted to English text the staff person sees, but your voice itself is gone.\n\nIf you want me to stop, say \"jooji\". If you want a Somali person from another city brought in by phone, say \"qof\". If you want me to erase everything, say \"tirtir\".\n\nThank you.",
    },
    reaffirmation: {
      somali: "Codkaaga lama duubo. Sirta waa la ilaaliyaa.",
      english: "Your voice is not recorded. The secret is kept.",
    },
    interpreterHandoff: {
      somali:
        "Waxaan kuu soo gelinayaa haweenay Soomaali ah oo aan magaalada {CITY} ka yimid. Magaceeda waa {NAME}. Sirta weli waa la ilaaliyaa. Hadii aanad rabin, dheh \"maya\" si aan u joojiyo.",
      english:
        "I am bringing in a Somali woman from {CITY}. Her name is {NAME}. The secret is still kept. If you do not want this, say \"maya\" so I can stop.",
    },
    wouldYouWant: {
      somali:
        "Hadii saaxiibtaada hooyo ah ay sidan ku noolaan lahayd, maxaad ku odhan lahayd?",
      english:
        "If your friend who is a mother were living like this, what would you say to her?",
    },
    sessionEnd: {
      somali:
        "Waanu dhamaynay. Waxa la xafiday qoraalka shaqaalaha. Codkaagu ma jirayo. Ma jiro wax la diray. Mahadsanid.",
      english:
        "We have finished. The staff person's notes were saved. Your voice is gone. Nothing was sent anywhere. Thank you.",
    },
    panicClear: {
      somali: "Wax walba waa la tirtiray. Ma jiro wax la xafiday.",
      english: "Everything has been erased. Nothing is saved.",
    },
    indexCard: {
      somali:
        "HISHMO\n\nSirta waa la ilaaliyaa.\n\n  Ma ihi qof Soomaali ah.\n  Ma ihi booliska.\n  Ma ihi socdaalka.\n  Ma ihi qof masjidka ka tirsan.\n  Codkaaga lama duubo.\n\nErayada gargaarka:\n  jooji  → joog\n  qof    → qof Soomaali ah oo magaalo kale ka yimid\n  tirtir → tirtir wax walba\n\nHadalkayaga waxa lagu sii caawinayaa kombiyuutar.\nAdigu adiga ayaa go'aamiya waxa xiga.",
    },
  };

  // -- 8. Pre-session brief (PRD §5.1) -------------------------------------

  const sessionBrief = {
    survivor: "Asha M.",
    visit: "3rd visit",
    location: "Tukwila",
    goal: "housing safety plan",
    sensitivity: "Avoid clan, mosque, neighborhood.",
    note:
      "Husband works in same building cluster — do not name location.",
  };

  // -- 8b. Worker → survivor canned utterances ----------------------------
  // Caseworker speaks English; Hishmo translates + plays Somali through the
  // phone speaker AND renders the Somali on the survivor side of the
  // tabletop (split-screen activates ONLY for this direction).
  //
  // Every Somali line is lifted verbatim from caseworker-behaviors.md §4
  // or glossary.md §3 (intercepts). Do not invent new Somali here.

  const workerUtterances = [
    {
      id: "w1",
      label: "Open question",
      en: "What can I help you with today?",
      so: "Maxaan caawimaad ku siin karaa maanta?",
    },
    {
      id: "w2",
      label: "Safety check (without asking where)",
      en: "Are you in a safe place right now?",
      so: "Meel aad ammaan ku tahay miyaad ku jirtaa hada?",
    },
    {
      id: "w3",
      label: "Survivor-led prioritization",
      en: "What do you need first?",
      so: "Maxaad u baahan tahay ugu horeysa?",
    },
    {
      id: "w4",
      label: "Permission to use Somali framing",
      en: "Is it okay if I describe this in Somali?",
      so: "Ma ku habboon yahay inaan tan ka warbixiyo Soomaali?",
    },
    {
      id: "w5",
      label: "Glossary intercept · consent (functional rewrite)",
      en: "consent",
      so: "Adigu ma rabtay in tani dhacdo? Ma kala ogtahay waxaa kasoo dhalan kara?",
    },
    {
      id: "w6",
      label: "Glossary intercept · confidential (functional rewrite)",
      en: "confidential",
      so: "Sirta waa la ilaaliyaa — ma jiro qof Soomaali ah oo dhageysanaya, codkaaga lama duubo.",
    },
  ];

  // -- 9. Canned utterances for the demo -----------------------------------
  // Eight Somali utterances drawn directly from glossary.md §1 + §2 cues
  // so the trigger detector fires deterministically.

  const cannedUtterances = [
    {
      id: "u1",
      label: "1 · Greeting (no triggers)",
      so: "Salaan. Waan kuugu mahadcelinayaa inaad i soo dhaweysay.",
      en: "Hello. Thank you for welcoming me.",
      direct: [],
      inference: [],
    },
    {
      id: "u2",
      label: "2 · Children fear when he arrives",
      so: "Carruurta way aamusaan markuu yimaado. Way ka cabsadaan.",
      en: "The children go quiet when he arrives. They are afraid.",
      direct: [],
      inference: ["fear_on_arrival"],
    },
    {
      id: "u3",
      label: "3 · Futurity refusal — daughter",
      so: "Ma jeclaan lahaa in gabadhayda ay sidan ku noolaato.",
      en: "I would not want my daughter to live like this.",
      direct: [],
      inference: ["futurity_refusal"],
    },
    {
      id: "u4",
      label: "4 · Lost peace + somatized depletion",
      so: "Waan ku raaxaysan waayey. Madaxa aad ayuu i xanuunsada. Ma cuni karo.",
      en: "I have lost my peace. My head hurts very much. I cannot eat.",
      direct: [],
      inference: ["lost_peace", "somatized"],
    },
    {
      id: "u5",
      label: "5 · Religious framing alone (must NOT cluster)",
      so: "Allah ayaa qoray. Sabar buu i siiyay.",
      en: "God has written it. He gave me patience.",
      direct: [],
      inference: ["religious"],
    },
    {
      id: "u6",
      label: "6 · DIRECT — gacan ka hadal",
      so: "Markii uu naxay, gacan ayuu kala hadlayey aniga.",
      en: "When he gets angry, he speaks with his hand to me.",
      direct: ["physical_violence_described"],
      inference: [],
    },
    {
      id: "u7",
      label: "7 · DIRECT — cabsi gelin + dhuumli",
      so: "Wuxuu i cabsi geliyaa marwalba. Waan dhuumi-dhuumi.",
      en: "He puts fear in me always. I am hiding.",
      direct: ["intimidation_described", "concealment_described"],
      inference: [],
    },
    {
      id: "u8",
      label: "8 · Shame frame · ceeb",
      so: "Ma sheegi karo. Waa ceeb badan. Xishood ayaa i hayso.",
      en: "I cannot say it. It is great shame. Modesty holds me.",
      direct: ["shame_frame_named"],
      inference: [],
    },
  ];

  // -- 10. Resources (resources.md, top 3 per category) --------------------
  // Verified Seattle directory. Records flagged unverified excluded from
  // survivor-facing surface; surfaced in worker-only "needs verification"
  // tray in production.

  const resources = {
    housing: [
      {
        name: "Mary's Place",
        phone: "206-621-8474",
        url: "https://www.marysplaceseattle.org",
        languages: ["en", "es"],
        area: "King County",
        description:
          "Family emergency shelter and day services for women and families with children.",
      },
      {
        name: "Solid Ground — Broadview DV shelter",
        phone: "206-694-6766",
        url: "https://www.solid-ground.org/get-help/housing",
        languages: ["en", "es", "so"],
        area: "King County",
        description:
          "DV-overlap transitional housing + rental-assistance case management.",
      },
      {
        name: "Catholic Community Services of Western WA",
        phone: "206-328-5696",
        url: "https://ccsww.org",
        languages: ["en", "es"],
        area: "King County + Western WA",
        description:
          "Shelter, housing case management, rental assistance, and family support.",
      },
    ],
    food: [
      {
        name: "Rainier Valley Food Bank",
        phone: "206-723-4105",
        url: "https://www.rvfb.org",
        languages: ["so", "am", "ti", "om", "vi", "es"],
        area: "Southeast Seattle",
        description:
          "Halal items + East African staples; culturally responsive food bank.",
      },
      {
        name: "Northwest Harvest",
        phone: "1-800-722-6924",
        url: "https://www.northwestharvest.org",
        languages: ["multilingual via partners"],
        area: "WA State (network)",
        description:
          "Statewide hunger-relief network supplying 375+ food banks.",
      },
      {
        name: "ICHS food security programs",
        phone: "206-788-3700",
        url: "https://www.ichs.com",
        languages: ["+50 incl. so"],
        area: "King County",
        description:
          "Food-as-medicine programs, SNAP enrollment, culturally-tailored nutrition.",
      },
    ],
    legal: [
      {
        name: "Northwest Justice Project — CLEAR Hotline",
        phone: "1-888-201-1014",
        url: "https://nwjustice.org",
        languages: ["en", "es"],
        area: "WA State",
        description:
          "Civil legal aid hotline; DV protection orders, housing, family law.",
      },
      {
        name: "Northwest Immigrant Rights Project (NWIRP)",
        phone: "206-587-4009",
        url: "https://www.nwirp.org",
        languages: ["en", "es", "interpreter for so/ar/am"],
        area: "WA State",
        description:
          "VAWA self-petitions, U-visas, T-visas, asylum, removal defense.",
      },
      {
        name: "Eastside Legal Assistance Program (ELAP)",
        phone: "425-747-7274",
        url: "https://elap.org",
        languages: ["en", "es", "zh"],
        area: "East + North King County",
        description:
          "Free civil legal aid with dedicated DV unit; protection orders, family law.",
      },
    ],
    medical: [
      {
        name: "Harborview Medical Center",
        phone: "206-744-3000",
        url: "https://www.uwmedicine.org/locations/harborview-medical-center",
        languages: ["+100 incl. so", "am", "ti", "om", "ar"],
        area: "King County (regional Level I trauma)",
        description:
          "DV/SA response team, refugee health clinic, 24/7 interpreter services.",
      },
      {
        name: "HealthPoint",
        phone: "1-866-893-5717",
        url: "https://healthpointchc.org",
        languages: ["en", "es", "so", "am", "ar", "vi", "ru", "uk"],
        area: "King County",
        description:
          "FQHC: primary care, dental, behavioral health, maternity on a sliding scale.",
      },
      {
        name: "Neighborcare Health",
        phone: "206-296-4990",
        url: "https://neighborcare.org",
        languages: ["en", "so", "am", "ti", "es", "vi"],
        area: "Seattle + Vashon",
        description:
          "Largest FQHC in Seattle; medical, dental, behavioral, school-based.",
      },
    ],
    somali_community: [
      {
        name: "Refugee Women's Alliance (ReWA)",
        phone: "206-721-0243",
        url: "https://www.rewa.org",
        languages: ["en", "so", "am", "ti", "om", "ar", "sw"],
        area: "Seattle, Tukwila, Kent, Beacon Hill",
        description:
          "DV advocacy, behavioral health, legal aid, housing case management for refugee/immigrant women.",
      },
      {
        name: "API Chaya",
        phone: "1-877-922-4292",
        url: "https://www.apichaya.org",
        languages: ["en", "so", "am", "ar", "sw"],
        area: "WA State, Seattle-based",
        description:
          "Survivor-led advocacy for South Asian, Asian, Pacific Islander, and African immigrant survivors.",
      },
      {
        name: "Somali Health Board",
        phone: "206-403-1953",
        url: "https://www.somalihealthboard.org",
        languages: ["so", "ar", "en"],
        area: "King County",
        description:
          "Somali-led public-health org; CHW outreach, maternal health, mental health navigation.",
      },
    ],
  };

  // -- 11. Structured intake field options ---------------------------------
  // Worker-only tags. Inferential signals NEVER auto-set these.

  const intakeFieldOptions = {
    presenting_issue: [
      "housing_unsafe",
      "food_insecurity",
      "medical_acute",
      "legal_protection_order",
      "child_safety",
      "described_household_fear",
      "described_futurity_refusal",
      "described_somatic_depletion",
    ],
    safety_flags: [
      "abuser_at_home_now",
      "weapons_in_home",
      "children_present",
      "isolated_from_family",
      "controlled_finances",
      "transport_dependent",
    ],
    requested_resources: [
      "housing",
      "food",
      "legal",
      "medical",
      "somali_community",
      "interpreter_out_of_region",
    ],
  };

  // -- 12. Pack metadata ---------------------------------------------------

  const meta = {
    id: "somali",
    languageCode: "so",
    languageNameSelf: "Soomaali",
    dialect: "Maxaa-tiri",
    version: "0.1",
    status: "demo — bicultural review (SFSTF / ReWA) required before production",
    asrModel: "MMS-1b-all",
    mtModel: "NLLB-200-distilled-600M",
    ttsModel: "MMS-TTS-som",
    licenses: {
      asr: "CC-BY-NC-4.0",
      mt: "CC-BY-NC-4.0",
      tts: "CC-BY-NC-4.0",
    },
  };

  // -- Export to global namespace -----------------------------------------

  window.HishmoSomaliPack = Object.freeze({
    meta,
    glossaryIntercepts,
    directTriggers,
    inferentialSignals,
    antiClusterAlone,
    survivorCommands,
    interpreterCities,
    voiceScripts,
    sessionBrief,
    cannedUtterances,
    workerUtterances,
    resources,
    intakeFieldOptions,
  });
})();
