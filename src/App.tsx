import { Page, Section, Text, Image, Callout, BulletList, Grid, Select, Segmented, Properties, LinkCards, Table, Legend, TableOfContents, useState, useGrokTheme } from "./canvas-shim";

type Role = "t" | "h" | "d";
interface Ph { n: string; c: string; t: string; h: string; d: string; tb: string[]; hb: string[]; db: string[] }
interface Boss { name: string; mp?: { a: string; f: number[]; n: number; cr: string }; rv?: { a: string; i?: number; n?: number; H: number[]; cr: string; href: string; how?: string }; tr?: string; sm: { t: string; h: string; d: string }; ar: "c" | "r" | "d"; conf: string; ph: Ph[]; nim: string[]; sorc?: string; flag?: string[]; src: string[] }
interface Op { id: string; name: string; modes: string; md: string[]; bosses: Boss[] }

const SRC: Record<string, { title: string; site: string; href: string }> = {
  vkXR: { title: "Propagator Core XR-53 guide (Story and Veteran)", site: "vulkk.com", href: "https://vulkk.com/2024/12/15/swtor-propagator-core-xr-53-ilum-lair-boss-guide-story-and-veteran-mode/" },
  swXR: { title: "Propagator Core XR-53 guide", site: "swtorista.com", href: "https://swtorista.com/articles/swtor-propagator-core-xr-53-guide/" },
  swXRmm: { title: "Master Mode Relentless Replication: XR-53", site: "swtorista.com", href: "https://swtorista.com/articles/master-mode-relentless-replication-propagator-core-xr-53-guide/" },
  anXR: { title: "Hard Mode Propagator Core XR-53", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/hard-mode-propagator-core-xr-53" },
  fdDP: { title: "The Dread Palace (area map files)", site: "swtor.fandom.com", href: "https://swtor.fandom.com/wiki/The_Dread_Palace" },
  fdDF: { title: "Dread Fortress (area map files)", site: "swtor.fandom.com", href: "https://swtor.fandom.com/wiki/Dread_Fortress" },
  mlEVmap: { title: "Eternity Vault (area maps)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault" },
  mlNopMap: { title: "Nature of Progress (area maps)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress" },
  mlGodsMap: { title: "Gods from the Machine (area maps)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine" },
  mlSM: { title: "Story Mode boss guides (all ops)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations" },
  idsFind: { title: "Operations boss finder (where each boss is)", site: "imperialdarksector.com", href: "https://imperialdarksector.com/media/games/the-old-republic/endgame/operations/boss-finder/" },
  gsLairs: { title: "Galactic Seasons objectives (lair names)", site: "swtor.com", href: "https://www.swtor.com/info/galactic-seasons" },
  vkNop: { title: "Nature of Progress Veteran Mode guide", site: "vulkk.com", href: "https://vulkk.com/2020/12/04/swtor-nature-of-progress-veteran-mode-operation-guide" },
  mlRed: { title: "Pack Leader (Red)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/pack-leader-red" },
  mlLights: { title: "Lights Out (Holding Pens)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/lights-out-holding-pens" },
  mlCC: { title: "According to Plan (Control Center)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/according-to-plan-control-center" },
  mlTrando: { title: "Mutant Trandoshan Squad", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/mutant-trandoshan-squad" },
  xamTrando: { title: "Dxun HM: Mutant Trandoshan Squad", site: "thexamxam.com", href: "https://thexamxam.com/2019/12/the-nature-of-progress-operation-guide-mutant-trandoshian-squad/" },
  mlHunt: { title: "Huntmaster", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/huntmaster" },
  mlApex: { title: "Apex Vanguard", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/nature-of-progress/apex-vanguard" },
  xamApex: { title: "Dxun HM: Apex Vanguard", site: "thexamxam.com", href: "https://thexamxam.com/2020/01/the-nature-of-progress-operation-guide-apex-vanguard/" },
  idsNop: { title: "Nature of Progress walkthrough (7.9)", site: "imperialdarksector.com", href: "https://imperialdarksector.com/media/games/the-old-republic/endgame/operations/nature-of-progress/" },
  mlTyth: { title: "Tyth", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine/tyth" },
  dTyth: { title: "Tyth operation guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2017/04/18/swtor-tyth-operation-guide/" },
  vkTyth: { title: "Tyth, God of Rage boss guide", site: "vulkk.com", href: "https://vulkk.com/2017/04/05/tyth-god-of-rage-swtor-gods-from-the-machine-ops-boss-guide/" },
  mlAE: { title: "Aivela & Esne", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine/aivela-esne" },
  dAE: { title: "Aivela and Esne boss guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2017/07/13/swtor-aivela-and-esne-operation-boss-guide/" },
  mlNahut: { title: "Nahut", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine/nahut" },
  mlScyva: { title: "Scyva", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine/scyva" },
  mlIzax: { title: "Izax", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/gods-from-the-machine/izax" },
  idsGods: { title: "Gods from the Machine walkthrough (7.9)", site: "imperialdarksector.com", href: "https://imperialdarksector.com/media/games/the-old-republic/endgame/operations/gods-from-the-machine/" },
  vkR4: { title: "R-4 Anomaly operation guide", site: "vulkk.com", href: "https://vulkk.com/2022/08/09/swtor-r-4-anomaly-operation-quick-guide/" },
  idsR4: { title: "R-4 Anomaly walkthrough (7.9, checked Oct 2026)", site: "imperialdarksector.com", href: "https://imperialdarksector.com/media/games/the-old-republic/endgame/operations/r-4-anomaly/" },
  cantR4: { title: "R-4-Anomalie Guide (SM/HC table)", site: "swtorcantina.de", href: "https://swtorcantina.de/guides.html?bereich=operationen&guide=operationen-r-4-anomalie" },
  mlDF: { title: "Dread Fortress summary", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/dread-fortress" },
  dDF: { title: "Dread Fortress operation guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2013/09/30/swtor-dread-fortress-operation-guide/" },
  dDFn: { title: "Nightmare Dread Fortress guides", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/category/swtor/nightmare-dread-fortress/" },
  mlDP: { title: "Dread Palace summary", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/dread-palace" },
  dDP: { title: "Dread Palace operation guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2013/10/04/swtor-dread-palace-operation-guide/" },
  mlTfB: { title: "Terror From Beyond (SM/VM/MM)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/terror-from-beyond" },
  dTfBn: { title: "Nightmare TfB guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2013/05/31/swtor-nightmare-terror-from-beyond-operation-guide/" },
  mlSV: { title: "Scum & Villainy (SM/VM/MM)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/scum-villainy" },
  dSVn: { title: "Nightmare S&V guide", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2013/07/11/swtor-nightmare-scum-and-villainy-operation-guide/" },
  p70: { title: "Game Update 7.0 patch notes (ops changes)", site: "swtor.fandom.com", href: "https://swtor.fandom.com/wiki/Game_Update_7.0.0" },
  p71: { title: "7.1 patch notes: all op encounter health reduced", site: "vulkk.com", href: "https://vulkk.com/2022/08/01/swtor-update-7-1-everything-you-should-know/" },
  p702: { title: "7.0.2 patch notes (Dash'roode sandstorm)", site: "thexamxam.com", href: "https://thexamxam.com/2022/04/swtor-game-update-7-0-2-overview/" },
  s80: { title: "8.0 Masters of the Force revealed", site: "swtor.com", href: "https://www.swtor.com/info/news/article/20260813" },
  s80ls: { title: "Last Sister (Children of Nul) on PTS", site: "swtor.com", href: "https://www.swtor.com/info/news/article/20261114" },
  mlXRR: { title: "Annihilation Droid XRR-3", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault/annihilation-droid-xrr-3" },
  mlGharj: { title: "Gharj", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault/gharj" },
  mlPylons: { title: "Ancient Pylons", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault/ancient-pylons" },
  mlICouncil: { title: "Infernal Council", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault/infernal-council" },
  mlSoa: { title: "Soa", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/eternity-vault/soa" },
  grXRR: { title: "XRR-3 (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/eternity-vault/annihilation-droid-xrr-3/" },
  grGharj: { title: "Gharj (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/eternity-vault/gharj/" },
  vkNoNim: { title: "No more EV and KP Nightmare Mode in 4.0", site: "vulkk.com", href: "https://vulkk.com/2015/09/08/no-more-ev-and-kp-nightmare-mode-in-swtor-4-0/" },
  mlKP: { title: "Karagga's Palace (SM + VM notes)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/karaggas-palace" },
  mlEC: { title: "Explosive Conflict (SM / VM / MM)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/explosive-conflict" },
  idsEC: { title: "Explosive Conflict walkthrough", site: "imperialdarksector.com", href: "https://imperialdarksector.com/media/games/the-old-republic/endgame/operations/explosive-conflict/" },
  mlRav: { title: "The Ravagers summary", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/ravagers" },
  grSparky: { title: "Sparky (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/ravagers/sparky/" },
  dRavSparky: { title: "HM Sparky guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/02/09/swtor-hardmode-sparky-ravagers-operation-guide-zorz/" },
  dRavBulo: { title: "HM Quartermaster Bulo guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/02/09/swtor-hardmode-quartermaster-bulo-ravagers-operation-guide-zorz/" },
  dRavTorque: { title: "HM Torque guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/02/09/swtor-hardmode-torque-ravagers-operation-guide-zorz/" },
  dRavMB: { title: "HM Master & Blaster guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/02/09/swtor-hardmode-master-blaster-ravagers-operation-guide-zorz/" },
  dRavCora: { title: "HM Coratanni guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/02/09/swtor-hardmode-coratanni-ravagers-operation-guide-zorz/" },
  mlToS: { title: "Temple of Sacrifice summary", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/temple-of-sacrifice" },
  dTosMal: { title: "HM Malaphar guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/03/06/swtor-hardmode-malaphar-savage-tos-operation-guide-zorz/" },
  dTosSword: { title: "HM Sword Squadron guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/03/06/swtor-hardmode-sword-squadron-tos-operation-guide-zorz/" },
  dTosUnder: { title: "HM Underlurker guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/03/06/swtor-hardmode-underlurker-tos-operation-guide-zorz/" },
  dTosCmd: { title: "HM Revanite Commanders guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/03/07/swtor-hardmode-revanite-commanders-tos-operation-guide-zorz/" },
  dTosRevan: { title: "HM Revan guide (Zorz)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2015/03/07/swtor-hardmode-revan-tos-operation-guide-zorz/" },
  fRavTos: { title: "Players asking for Ravagers/ToS Master Mode (2022: none exists)", site: "forums.swtor.com", href: "https://forums.swtor.com/topic/924263-rav-amp-tos-question/" },
  grToborro: { title: "Toborro's Courtyard (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/other-bosses/toborros-courtyard/" },
  cantToborro: { title: "Toborros Hof guide (SM/HC)", site: "swtorcantina.de", href: "https://swtorcantina.de/guides.html?bereich=operationen&guide=operationen-toborros-hof" },
  grMono: { title: "Colossal Monolith (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/other-bosses/colossal-monolith-heart-of-ruin/" },
  grWorld: { title: "Worldbreaker Monolith (VM buff)", site: "grophets.com", href: "https://grophets.com/guides/world-bosses/worldbreaker-monolith/" },
  grQueen: { title: "Hive of the Mountain Queen (all modes)", site: "grophets.com", href: "https://grophets.com/guides/operations/other-bosses/hive-of-the-mountain-queen/" },
  dQueen: { title: "Mutated Geonosian Queen guide (5.10.1)", site: "Dulfy archive", href: "http://dulfy.net.s3-website-us-east-1.amazonaws.com/2019/02/11/swtor-mutated-geonosian-queen-guide/" },
  mlOther: { title: "Other bosses (lairs)", site: "merlynswtor.com", href: "https://www.merlynswtor.com/operations/other-bosses" },
  anRed: { title: "NiM Red", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dxun/nim-red" },
  anPins: { title: "NiM Control Room and Pins", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dxun/nim-control-room-and-pins" },
  anTrando: { title: "NiM Trandos", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dxun/nim-trandos" },
  anHunt: { title: "NiM Huntmaster", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dxun/nim-huntmaster" },
  anApex: { title: "NiM Apex Vanguard", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dxun/nim-apex" },
  fNopMM: { title: "Master Mode Nature of Progress PTS feedback (dev notes)", site: "forums.swtor.com", href: "https://forums.swtor.com/topic/893828-master-mode-the-nature-of-progress-operation-feedback/" },
  anBestia: { title: "NiM Bestia", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dread-palace/nim-bestia" },
  anTyrans: { title: "NiM Tyrans", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dread-palace/nim-tyrans" },
  anCalph: { title: "NiM Calphayus", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dread-palace/nim-calph" },
  anRaptus: { title: "NiM Raptus", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dread-palace/nim-raptus" },
  anCouncil: { title: "NiM Council", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-dread-palace/nim-council" },
  gcCouncil: { title: "Master Mode Dread Council", site: "swtorcommando.blogspot.com", href: "https://swtorcommando.blogspot.com/2019/08/master-mode-dread-council.html" },
  anStyrak: { title: "NiM Styrak", site: "admiralnicksswtorguides.com", href: "https://www.admiralnicksswtorguides.com/raid-guides/nim-operation-guides/nim-styrak" },
  devGods: { title: "Dev Q&A: Master Mode Gods (Tyth knockback)", site: "swtor.com", href: "https://www.swtor.com/info/news/article/20181121" },
  fGods510: { title: "5.10 Gods balance changes (dev post)", site: "forums.swtor.com", href: "https://forums.swtor.com/topic/872051-list-of-gods-from-the-machine-balance-changes-for-510/" },
  fGodsMM: { title: "Master Mode Gods PTS feedback", site: "forums.swtor.com", href: "https://forums.swtor.com/topic/872045-feedback-master-mode-gods-from-the-machine/" },
};

const NO_MM = "No Master Mode specifics for this boss were found in the sources checked. Treat MM as unverified and get the details from your raid lead.";
const NO_MM_RT = "This op has no Master Mode: Story and Veteran only.";
const NO_MM_EVKP = "No Master Mode: EV and KP Nightmare was removed in 4.0 (Vulkk). Story and Veteran only.";
const AN_NOTE = "Admiral Nick's NiM guides were written for 6.x and are one team's strategy. Mechanics should still apply, but numbers were retuned in 7.0/7.1.";
const GODS_INF = "Inferred, not confirmed: BioWare's 5.10 notes retuned Veteran down when Master Mode launched, so MM should keep the original, harder numbers. No full MM guide for this boss was found (Merlyn, Grophets, Admiral Nick, Vulkk, Dulfy and the forums checked).";
const DULFY_OLD = "NiM notes come from Dulfy's 2013–14 Nightmare guides. Numbers were retuned when NiM became Master Mode and in 7.0/7.1, so treat them as mechanic hints, not exact values.";

const OPS: Op[] = [
  { id: "nop", name: "The Nature Of Progress (Dxun)", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Pack Leader Red", mp: { a: "asset:map-nop.jpg", f: [0], n: 6, cr: "Merlyn's SWTOR Guides, Nature of Progress area maps" }, sm: { t: "Same spots as Veteran: hold Red away from the group; swap when the debuff stacks get high.", h: "Lower damage; keep to the Veteran healer spot and watch the tank.", d: "Same layout as Veteran; Story damage is far lower, so the main job is not standing in front of the pack." }, ar: "r", conf: "Veteran checked against Vulkk + Merlyn; MM from Admiral Nick (single source)", src: ["vkNop", "mlRed", "idsNop", "anRed"],
      flag: ["Interrupts: Merlyn says Pool and Jet can be interrupted (Story); Vulkk says they cannot be interrupted in Veteran. Assume no interrupts on VM."],
      sorc: "Healer: drop Revivification inside the flower circle where everyone stacks. DPS: if you get caught out, Force Speed back into the blue circle before it expires.",
      nim: ["Admiral Nick (NiM): very different from VM. You go through up to 8 flowers, not 2. A flower gives a 45s buff that blocks Red Venom stacks; Pools and Acidic Jet remove it.", "Admiral Nick: Festering Wounds lands 2 stacks at a time on anyone in the cleave and explodes at 30 stacks or on expiry. On 16-player MM that one-shots the tank without a defensive.", "Admiral Nick: bulls spawn along the route. A DwT/off-tank drags each into Red's Acidic Jet, then DPS kill it.", "Merlyn: the Pool debuff is 95% in the top mode vs 50% in VM.", AN_NOTE],
      ph: [
        { n: "Hold Red and pop flower 1", c: "B 75 36 Red|Z 72 25 6 Flower 1 (blue circle)|Z 86 52 5 Acid Pool|O 55 60 Tree line: do not cross (adds)",
          t: "P 76 33 Tank|> 76 33 84 48 bait Pool 20m+ from flower|P 70 39 Off-tank", tb: ["Face Red into the wall, away from the group. Red stands still while casting Pool or Jet.", "Bait Hydrochloric Pool at least 20m from the flower, then step out of it.", "Side-step Acidic Jet (6s frontal cone).", "VM: swap at about 15–18 Festering Wound stacks (heal debuff, can't be cleansed)."],
          h: "P 69 22 Healer 1|P 74 23 Healer 2", hb: ["This is the op's heaviest AoE-heal check: everyone gains a Red Venom stack every 5s.", "Keep the raid within about 10m of you.", "Call the flower at 10–12 stacks (VM). In VM each flower tick halves stacks, so everyone stays in for the full duration."],
          d: "P 69 27 Ranged (you)|P 79 39 Melee (behind Red)", db: ["Never stand in front of Red: Acidic Jet cone.", "Pop the flower on call, ideally right after a Pool.", "Stay inside the blue circle until it ends."] },
        { n: "Walk Red toward flower 2", c: "B 55 30 Red (walked)|Z 72 25 5 Flower 1 (spent)|Z 32 22 6 Flower 2|O 55 60 Tree line",
          t: "P 57 32 Tank|> 70 34 58 31 walk Red, keep facing the wall", tb: ["Walk Red slowly. Stop about halfway, in the narrowing.", "Aim Jet and Pool into the wall or back up the path.", "Keep Pools well away from flower 2."],
          h: "P 34 25 Healers|> 68 24 37 24 move ahead of Red", hb: ["Move ahead of Red with the group.", "Second flower at 10–12 stacks again."],
          d: "P 30 27 Ranged (you)|> 66 28 33 26 run ahead of Red", db: ["Stay ahead of Red, never between tank and boss.", "A third flower means crossing the tree line and pulling adds. Burn to avoid it."] } ] },
    { name: "Breach CI-004 (Lights Out + According to Plan)", mp: { a: "asset:map-nop.jpg", f: [1, 2], n: 6, cr: "Merlyn's SWTOR Guides, Nature of Progress area maps" }, sm: { t: "Gauntlet: lead the group through; Story enemies hit much softer.", h: "Stay with the group through the dark (Lights Out) section.", d: "Same route as Veteran: kill pins and adds; there is more slack on timers in Story." }, ar: "r", conf: "Gauntlet, not a classic boss. Checked against Merlyn + Vulkk", src: ["mlLights", "mlCC", "vkNop", "anPins"],
      sorc: "Force Speed keeps you with the pack. Don't knock adds out of the Flare zone.",
      nim: ["Admiral Nick: According to Plan (the pin run) plays as in VM, plus a Sanitization Droid that comes back to fight the group soon after the Reapers enter.", "Lights Out in MM: not covered by any source found. Unconfirmed.", AN_NOTE],
      ph: [
        { n: "Holding pens run (Lights Out)", c: "O 9.7 59.4 Start: specimen center|A 35.6 43.1 Rampaging Charger|A 61.5 28.6 Charger 2|A 86.4 14.2 Warden Droid|Z 35.6 43.1 8.1 Flare zone",
          t: "P 33.7 45.8 Tank|> 11.6 55.8 31.8 45.8 run, AoE-taunt, don't stop|P 59.6 31.4 Off-tank", tb: ["Tanks carry all the Flares.", "Pull each Charger against a fence so knockbacks don't move you, then drop a Flare there.", "AoE-taunt small packs on the run and drag them to the next big fight."],
          h: "P 31.8 49.5 Healers|> 11.6 59.4 29.9 49.5 move with the group", hb: ["Stragglers die to the slows. Stay in the pack.", "Corrosive Rain (from killed Incendiary Shrieks) can't be cleansed: heal through it."],
          d: "P 38.5 49.5 DPS (you)|> 11.6 60.3 36.6 49.5 move with the group", db: ["DPS take the Stims (about 3 each).", "Avoid the yellow circles from Incendiary Shrieks.", "Charger first; DoT-spread everything else inside the Flare."] },
        { n: "Control Center (According to Plan)", c: "O 50 12.7 Security panel|A 35.9 30.2 Warden Droid A|A 64.1 30.2 Warden Droid B|A 50 61.1 Endless add waves|Z 50 45.7 4.9 Flare",
          t: "P 34.3 33.1 Tank 1|P 65.7 33.1 Tank 2", tb: ["VM: keep the two Warden Droids apart for the whole fight.", "On the pond run, the group hides behind rocks from the turrets. Don't move on until the Lake Crab is dead.", "Keep a Flare under the adds at all times."],
          h: "P 50 41.8 Healers", hb: ["You get 25s inside before the waves start: rez, restock Stims and Flares.", "Lake Crabs pull players out from behind cover. Heal the pulled player."],
          d: "P 46.7 39.9 DPS (you)|P 53.3 39.9 DPS", db: ["The Warden Droids activate about 35s after the waves start and become priority. The waves stop only when both are dead.", "Kill the Lake Crab before leaving each rock."] } ] },
    { name: "Mutant Trandoshan Squad", mp: { a: "asset:map-nop.jpg", f: [3], n: 6, cr: "Merlyn's SWTOR Guides, Nature of Progress area maps" }, sm: { t: "Same positions as Veteran; Story damage is lower.", h: "Same spot as Veteran.", d: "Same positions as Veteran; still get out of the leap circles." }, ar: "r", conf: "Veteran checked against Vulkk + Merlyn/XamXam; MM from Admiral Nick (single source)", src: ["vkNop", "mlTrando", "xamTrando", "anTrando"],
      sorc: "Vulkk recommends a DPS Sorc/Sage as the Greus kiter: build threat on Greus, then DoT the other bosses while you dodge his cones.",
      nim: ["Admiral Nick: Titax stands in the middle at the start; pulling him brings in the other three at once.", "Calling the train electrifies the rails (~30k/tick to DPS/healers, ~18k to tanks). The back railing is safe.", "Titax's Torpor lasts only 5s (35s in VM), so the train must arrive right after his push. Two DwTs take turns being knocked into canisters by Titax.", "After Titax dies the rest gain In Memory of Titax, then Path to Transcendence every 80s: a soft enrage (+35%, +100%, then +1,000% damage dealt).", "Greus adds Divebomb: an orange circle on a player; he leaps there and blows it up.", AN_NOTE],
      ph: [
        { n: "Pull to 1:00: burn Hissyphus", c: "R 83 4 14 60 Train tracks: push at 15%|O 22 9 Train call button|B 35 20 Greus (fire)|B 58 30 Hissyphus (toxic)|Z 54 42 3 Green puddles",
          t: "P 60 32 Hissy tank|> 60 32 79 38 walk Hissy along the wall to the tracks", tb: ["A Shadow/Assassin tank is ideal on Hissy: it can stealth-drop him when the others land.", "Walk Hissy slowly along the blue fence so the green puddles drop on the way to the tracks.", "The second tank stays free for Titax and Kronissus at 1:00."],
          h: "P 50 40 Healers", hb: ["Cleanse Hissyphus's toxic DoT fast.", "Keep everyone out of the green puddles."],
          d: "P 37 23 Greus kiter (Sorc ideal)|> 37 23 28 12 kite Greus to the upper left|P 53 37 Ranged on Hissy", db: ["Everyone except the Greus kiter burns Hissy as low as possible.", "Kiter: aim Greus's cones into the corner and click the train when called.", "VM: call the train about 45s before the push. Push Hissy at 15%."] },
        { n: "1:00+: Titax and Kronissus land", c: "R 83 4 14 60 Train tracks|O 22 9 Train button|B 33 18 Greus|B 55 42 Titax (strength)|B 72 16 Kronissus (ice)|O 37 33 Canister|O 45 27 Canister|O 64 40 Canister",
          t: "P 56 46 Titax tank|> 54 42 46 30 aim Titax Strike: punted into a canister|P 70 21 Kron tank", tb: ["Titax tank: aim each Titax Strike so the punt lands you in a canister. Start upper left and work toward the tracks.", "Kron tank: hold him by the ramp (upper right). Root-breaking utilities help.", "After Hissy dies, the Titax tank keeps Titax and later picks up Greus."],
          h: "P 47 32 Healers", hb: ["Big spikes on the Titax tank.", "Each kill buffs the survivors, so the last two must die together."],
          d: "P 50 38 DPS on Titax|P 32 25 Greus kiter", db: ["Vulkk's order: Hissy, then Titax, then Kronissus + Greus together.", "Take Titax to about 30%, then move him onto the tracks timed with a Strike.", "Watch boss % and call the train early."] },
        { n: "Final train: Kronissus + Greus", c: "R 83 4 14 60 Train tracks|O 22 9 Train button|B 77 28 Kronissus|B 77 45 Greus",
          t: "P 74 26 Kron tank|P 74 47 Greus tank", tb: ["Hold them on opposite sides of the tracks so their attacks don't hit the other tank.", "Both are pushed at the same time."],
          h: "P 55 37 Healers", hb: ["Raid damage peaks here. Use AoE cooldowns."],
          d: "P 62 37 DPS (you)", db: ["These two have much less health. Call the train early.", "Push both to 15% together."] } ] },
    { name: "The Huntmaster", mp: { a: "asset:map-nop.jpg", f: [4], n: 6, cr: "Merlyn's SWTOR Guides, Nature of Progress area maps" }, sm: { t: "Same positions; Firestorm (the burn timer) is about 30s in Story vs about 1 min harder modes (Merlyn).", h: "Same as Veteran.", d: "Still hide behind cover when the spotlight sweeps; Story has much more slack." }, ar: "r", conf: "Veteran checked against Merlyn + Vulkk; MM from Admiral Nick + BioWare PTS notes", src: ["mlHunt", "vkNop", "idsNop", "anHunt", "fNopMM"],
      flag: ["Holdout reflect in MM: BioWare's PTS note says Holdout Cover has a 100% damage return; Admiral Nick says 50% is reflected. Don't DPS into Holdout without your raid lead's call.", "The VM goal is to get him under 35% before his Master of the Hunt stacks run out (30 in VM vs 50 in SM). Merlyn gives two strategies: 1 tank + a DPS-geared tank burning before the 2nd Fortress Shield, or pushing beasts into the pond."],
      sorc: "Merlyn lists Lightning Sorc / TK Sage among the 35m specs that can keep hitting Huntmaster from outside Holdout Cover. Your knockback can push grouped beasts into the pond.",
      nim: ["Admiral Nick: changes drastically from VM. His team uses an away team to knock the adds into the lake.", "Huntmaster starts with 25 Master of the Hunt stacks. At 0 he chain-casts Cull (one-shot) until the raid is dead.", "Holdout phase by the lake: he heals very fast unless the bird debuffs him, and reflects damage.", "Phase 2 adds two more eggs (four Egg Snipes).", AN_NOTE],
      ph: [
        { n: "Spotlight phase", c: "Z 44 28 12 Spotlight (shrinks and drifts)|B 44 28 Huntmaster|R 40 47 17 15 Pond: instant death|A 20 13 Beast spawn|A 65 13 Beast spawn|A 57 63 Beast spawn",
          t: "P 46 25 Tank|P 32 38 Off-tank|> 32 38 23 18 1st Primal Fear: AoE-taunt beasts", tb: ["Hold him in the light, facing away from the group.", "VM: Penetration Shot sets your armor to 0 for 24s. Swap, or have the healers heal through it.", "Off-tank: during the first Primal Fear (beasts deal 60% less in VM), pull and group the beasts for AoE or a pond push."],
          h: "P 41 32 Healers", hb: ["Stay in the light. Beasts leap on anyone outside it.", "A Sorc/Sage or Merc/Commando healer can knock the grouped beasts into the pond (Merlyn).", "VM Powershot Volley knocks the closest player. Stay grouped."],
          d: "P 40 33 Ranged (you)|P 45 31 Melee|> 40 33 27 46 Firestorm Grenade: drop 25m+ out, come straight back", db: ["Firestorm Grenade on you: leave the light, drop it at least 25m away, return immediately with a defensive up.", "Scatterblast on you: move to the side of the boss opposite the group.", "A fire patch left inside the light wipes the raid."] },
        { n: "Fortress Shield → Charger → Holdout Cover", c: "A 33 22 Deliberate Charger|B 52 45 Huntmaster (Holdout Cover)|Z 52 45 16 30m red circle = death|R 40 47 17 15 Pond",
          t: "P 30 24 Tank|> 30 24 36 30 hold beasts outside the red", tb: ["Fortress Shield reflects all damage: don't hit him.", "Group the beasts on you. Never step into the red circle.", "If all adds are dead he shoots the nearest player, so be the nearest."],
          h: "P 26 20 Healers", hb: ["This is your downtime: rez, top everyone up, recover resources.", "Stay well outside the 30m circle."],
          d: "P 38 18 Ranged (35m edge)|P 31 16 Melee", db: ["When the Charger hits him, all DPS swap and kill it during its 8s stun or it one-shots people.", "Kill beasts to deny him stacks.", "35m specs can keep DPSing from the circle's edge."] },
        { n: "Shelleigh (after 35%)", c: "B 50 34 Shelleigh|Z 57.7 22.4 2.6 Nom: death in 1.8s|Z 39.8 45.7 2.6 Nom",
          t: "P 51.9 31.1 Tank|> 51.9 31.1 43.6 22.4 keep her moving", tb: ["Keep her moving; it cuts down Nom circles.", "VM: Pulverize stuns the tank for 4s and can't be broken. Swap."],
          h: "P 44.9 47.6 Healers", hb: ["Toxic Cloud DoTs stack. Group up for AoE heals."],
          d: "P 47.4 43.7 DPS (you)", db: ["Get out of the purple Nom circle immediately (1.8s).", "Pure burn otherwise."] } ] },
    { name: "Apex Vanguard", mp: { a: "asset:map-nop.jpg", f: [5], n: 6, cr: "Merlyn's SWTOR Guides, Nature of Progress area maps" }, sm: { t: "One tank can hold and kite the boss in Story.", h: "Same as Veteran, lower damage.", d: "Run batteries as in Veteran; Story is very forgiving." }, ar: "r", conf: "Veteran checked against Merlyn + XamXam/IDS; MM from Admiral Nick + BioWare PTS note", src: ["mlApex", "xamApex", "idsNop", "anApex", "fNopMM"],
      flag: ["Tank swap count: XamXam swaps around 20 stacks. Merlyn says 1- or 2-tank setups both work, with 2 tanks safer for the final 5% (Last Ditch Effort)."],
      sorc: "Merlyn notes a ranged DPS usually runs the battery. Force Speed makes Sorc/Sage a strong runner, and you can DPS between station trips.",
      nim: ["Admiral Nick: 3 tanks recommended (2 for Apex/battery, 1 for adds) and a set stim pickup order.", "Blood Lust: +300% damage for 12s. The tank must use a stim, timed to the end of the channel. Below ~30% Ultra Violence replaces it.", "Rocket Salvo adds a stacking bleed on DPS: spread.", "Blind, then Voltinator: no tank swaps during Blind; 2 stims counter it.", "Zone Defense: tank 2 taunts and turns Apex 180 degrees.", "BioWare PTS note: Anti-Theft Droids can detain a player only once every 8s.", AN_NOTE],
      ph: [
        { n: "Burn to 93%, then break the transformer", c: "B 50 20.5 Apex Vanguard|O 50 36 Power Transformer (battery)|O 50 6 Disruptor (N)|O 79.5 36 Fan (E)|O 50 65 Wash (S)",
          t: "P 50 16.6 Tank|> 50 16.6 31.2 24.4 pull him to a wall", tb: ["Don't walk forward on entry: you spawn close to him.", "Pull him to a wall and hold until 93%."],
          h: "P 50 51.5 Healers", hb: ["Low damage. Help DPS and cleanse Contagion if it goes out."],
          d: "P 46 45.7 DPS (you)|> 46 45.7 49.3 38.9 at 93%: kill the transformer panel", db: ["Burn to 93%. Photogenesis then lets him self-heal while the lights are on.", "Break the Power Transformer cover (10–15s). The runner grabs the battery."] },
        { n: "Main phase: battery stations", c: "B 27.2 30.2 Apex Vanguard|O 50 36 Transformer: recharge here|O 50 6 Disruptor: Mass Target Lock|O 79.5 36 Fan: Red Venom|O 50 65 Wash: acid pools|Z 23.1 18.6 4 Acid pool|Z 23.1 45.7 4 Acid pool",
          t: "P 28.5 33.1 Tank|> 28.5 33.1 28.5 53.4 kite along the wall, dropping acid", tb: ["Acid Blast drops under you every 15–20s. Move and lay pools around the edge, never on a station.", "Skilled tanks re-stack pools to delay the Wash.", "Plan the last 5% (Last Ditch Effort): second tank or defensive stims."],
          h: "P 36.6 34 Healers", hb: ["Cleanse Contagion; nobody stands in another player's green circle.", "Red Venom ramps until the runner powers the Fan. Most groups struggle around 12–15 stacks."],
          d: "P 35.2 28.2 DPS (you)|P 50 41.8 Battery runner|> 50 41.8 50 9.8 Target Lock: Disruptor, then recharge|> 51.3 39.9 76.8 36 Venom: Fan", db: ["Runner priority: Mass Target Lock → Disruptor (30s limit; drains the battery, recharge at once). Red Venom → Fan. Wash when the tank calls.", "Zone Defense: stand on the side of the cannon of the OTHER color.", "Self-cleanse Contagion if you can."] } ] },
  ] },
  { id: "gods", name: "Gods From The Machine", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Tyth, God of Rage", rv: { a: "asset:room-gods.jpg", i: 0, n: 1, H: [1.796214, -0.088, -40.521007, -0.039028, 0.550771, 5.847818, -0.000188, -0.001769, 1.0], cr: "Frame at 2:56 of \"Tyth 8M Master Mode | SWTOR\", MrBrendini, YouTube, Aug 19, 2025", href: "https://www.youtube.com/watch?v=R5NTifSSg-g&t=176s", how: "the edge of the round platform; which way the platform faces is a guess" }, mp: { a: "asset:map-gods.jpg", f: [0], n: 5, cr: "Merlyn's SWTOR Guides, Gods from the Machine area maps" }, sm: { t: "Don't cleave adds: every add his cleave kills gives him 3 Rage; 10 stacks is a raid-wide AoE.", h: "Heal through the add waves; Inversion is a Veteran+ mechanic.", d: "Kill adds away from Tyth's cleave; each add you kill gives him 1 Rage, so don't kill them all at once." }, ar: "c", conf: "Veteran checked against Merlyn + Dulfy/Vulkk; MM from BioWare dev Q&A + PTS feedback (pre-launch)", flag: ["Tyth MM details come from the 2018 dev Q&A and PTS feedback, before launch tuning. Check the enrage time and add counts in game."], src: ["mlTyth", "dTyth", "vkTyth", "devGods", "fGodsMM", "fGods510"],
      sorc: "Merlyn flags Sage/Sorc roots as useful for keeping Guardian droids from running under Tyth around Inversion.",
      nim: ["BioWare dev Q&A (Nov 2018): in MM, Energy Wave (his line AoE) knocks back, and the knockback grows with his Rage. Positioning decides whether you get punted off the platform.", "PTS feedback (Oct 2018): MM waves can hold 8 adds and two Graces, which VM no longer allows. The fight shifts to killing adds. PTS enrage was about 6:30–7:15; the live value is unconfirmed."],
      ph: [
        { n: "Above 60%: 3 adds per wave", c: "B 80 35 Tyth (edge, facing out)|A 30.1 12.1 Add spawn NW|A 69.9 10.1 Add spawn NE|A 30.1 57.9 Add spawn SW",
          t: "P 76 35 Main tank|P 52 22 Off-tank|> 52 22 40 18.1 pull Guardians to a Lance", tb: ["Tank Tyth at the platform edge facing outward, between add spawns (Merlyn: east edge).", "Any add his cleave kills gives +3 Rage; 10 Rage = Rage Overload.", "VM: his cleave widens as Rage rises."],
          h: "P 56 42 Healers", hb: ["Cleanse Armor Melt off the tank.", "Cleanse anyone at 3–4 Charge Buildup stacks from a Justice droid."],
          d: "P 46 36 DPS (you)|P 34 16.1 Grace droid handler", db: ["Kill adds grouped and away from Tyth.", "Grace handler: under 4 Rage, kill it and interrupt everything. At 4–7, let 2–3 green casts go, then kill it. Over 7, let it finish."] },
        { n: "VM Inversion (0:20, then every 40s)", c: "B 69.9 35 Tyth|Z 69.9 35 25.9 Inversion circle",
          t: "P 73.9 35 Current tank (inside)|P 30.1 35 Off-tank OUTSIDE|> 30.1 35 60 35 pulled in = gains threat, taunt", tb: ["The off-tank stands outside the circle and gets pulled in (Long Wave, +100% threat), then taunts.", "Everyone inside is ignored for 8s, so the outside tank must take it.", "Swap every Inversion: Meltdown stacks (-10% healing each) need time to drop."],
          h: "P 54 20.1 Healers: inside, 7.5m+ from Tyth", hb: ["Stand inside the circle, at least 7.5m from Tyth, or you get thrown off.", "Short Wave doubles your healing for 8s: top the tanks."],
          d: "P 54 50 DPS (you): inside, 7.5m+", db: ["Stand inside the circle, more than 7.5m from Tyth.", "Short Wave doubles your damage for 8s: burn."] },
        { n: "Below 30%: burn", c: "B 80 35 Tyth|A 30.1 36 Adds|A 26.1 24 Adds",
          t: "P 76 35 Main tank|P 32.1 42 Off-tank|> 32.1 42 25 50 kite the adds away", tb: ["Intensify Rage adds Rage over time. The off-tank gathers and kites the adds.", "Agree beforehand whether swaps continue."],
          h: "P 58 40 Healers", hb: ["If Rage hits 10, stack the raid and AoE heal through Overload."],
          d: "P 60 34 DPS (you)", db: ["All DPS on Tyth; ignore the adds."] } ] },
    { name: "Aivela & Esne", mp: { a: "asset:map-gods.jpg", f: [1], n: 5, cr: "Merlyn's SWTOR Guides, Gods from the Machine area maps" }, sm: { t: "Pick up a Polarity Module in the opener and match colors (white +, red −) on every mechanic aimed at you.", h: "Same: grab a Polarity Module and match colors.", d: "Kill all Codices in the opener and pick up a Polarity Module; match colors to take little or no damage." }, ar: "d", conf: "Story/Veteran checked against Merlyn + Dulfy/IDS", src: ["mlAE", "dAE", "idsGods", "fGods510"],
      sorc: "Force Speed gets your Energy Burst circle out of the group fast. Put the Polarity Module buttons on keys you can hit while moving.",
      nim: ["5.10 dev notes: VM-only changes include Spike 30s to 15s and Countermeasure cooldown 30s to 40s. MM most likely keeps the old values.", GODS_INF],
      ph: [
        { n: "Opener + Phase 1 (100–72%)", c: "O 50 35 Nexus|A 50 7.1 Glare|A 69 35 Glare|A 50 62.9 Glare|A 31 35 Glare|B 45 35 Aivela (white)|B 55 35 Esne (red)|A 39 21 Countermeasure|A 61.1 49 Countermeasure",
          t: "P 44 30 Tank (Aivela)|P 56.1 30 Tank (Esne)", tb: ["Opener: kill the Codices, everyone clicks a Polarity Module, then Nexus to 50%.", "VM: Remote Access on you means swap off that boss, or Spike jams your polarity.", "VM: pick up Countermeasures; they reset threat every 40s and run to healers."],
          h: "P 50 50 Healers|> 50 50 55 55 Energy Burst on you: step out", hb: ["Match the color of anything targeting you.", "VM: Countermeasure hits stack a healing-done debuff on you. Call it when they're on you."],
          d: "P 47 46 DPS (you)|> 47 46 42 51 step out for Energy Burst", db: ["Color priority: Purification beams > Charge Fire > Energy Burst > Radiance.", "Damage both evenly; each shields at 72% until the other catches up."] },
        { n: "Phase 2 (72–40%): Radiance", c: "B 45 35 Aivela|B 55 35 Esne|Z 45 35 6.5 Aivela Radiance|Z 55 35 6.5 Esne Radiance|A 50 7.1 Glare",
          t: "P 44 31 Tank|P 56.1 31 Tank", tb: ["Same as Phase 1. Stand outside the far boss's Radiance or match its color."],
          h: "P 50 55.9 Healers", hb: ["Watch for players who don't match colors and take big hits."],
          d: "P 50 53.9 DPS (you)", db: ["Stay outside the far boss's Radiance; match colors.", "Even damage again; they shield at 40%."] },
        { n: "Phase 3 (<40%): mobile + wiper beams", c: "B 48.5 35 Aivela|B 51.5 35 Esne|A 33 35 Wiper beams sweep",
          t: "P 50 30 Tanks: stack both in the middle", tb: ["Group both bosses in the middle so AoE hits both.", "Save defensives for the burn."],
          h: "P 50 46 Healers", hb: ["Overdrive (from 7%) heals the boss 6–7% and turns Energy Burst into unavoidable AoE. Burst heal."],
          d: "P 47 42 DPS (you)|P 53 42 DPS", db: ["Match the wiper-beam color (the Glares show which color is next).", "Burn evenly to about 15%, then focus one boss so they don't both Overdrive."] } ] },
    { name: "Nahut, Son of Shadow", mp: { a: "asset:map-gods.jpg", f: [2], n: 5, cr: "Merlyn's SWTOR Guides, Gods from the Machine area maps" }, sm: { t: "P2: kite Nahut around the room while a few DPS kill turrets.", h: "Stay with the main group while it kites.", d: "P2: a few DPS kill turrets; at 39% damage each is stunned and pulled into the singularity; 5 turrets ends the phase." }, ar: "c", conf: "Story/Veteran checked against Merlyn + IDS", src: ["mlNahut", "idsGods", "fGods510"],
      sorc: "Ranged Sorc is a natural Rail Turret pick: interrupt with Jolt and Force Speed between turrets.",
      nim: ["5.10 dev notes: VM-only nerfs that MM most likely lacks: Mass Distortion Field -20%, Rending Cloud growth -1/3, Rail Turret HP -20%.", GODS_INF],
      ph: [
        { n: "Phase 1: inner platform", c: "Z 50 35 14.9 Inner platform|B 60.9 35 Nahut|Z 60.9 35 6.9 Reflect shield (10m)|Z 57.9 20.1 4 Distortion field",
          t: "P 63.9 36 Tank|> 63.9 36 52 21 kite along the inner edge, dropping blue fields", tb: ["Kite Nahut around the inner circle's edge to drop the blue Mass Distortion Fields out of the way.", "If someone is stunned by a mine, Nahut goes for them. In VM he can't be taunted then."],
          h: "P 53 38 Healers: stacked mid", hb: ["Stand inside his shield: attacks from outside are reflected (100% in VM).", "VM: Rending Cloud stacks while you're inside. Step out at 15–20 to drop them."],
          d: "P 50 32 DPS (you): inside shield", db: ["Stay inside the shield to avoid reflects.", "VM: a second Distortion Mine within 60s kills you."] },
        { n: "Phase 2: perimeter couplings", c: "Z 50 35 30.7 Perimeter wheel|O 20.3 18.1 Power Coupling|O 79.7 52 Power Coupling|B 50 35 Nahut (sniping)",
          t: "P 26.2 52 Candle holder (often a tank)", tb: ["The Candle holder stands away from the group and takes Nahut's snipes.", "VM Railgun Trauma: the next snipe deals +300%. Rotate the Candle so nobody is hit twice."],
          h: "P 73.8 20.1 Healers", hb: ["Spot-heal the Candle holder; stay away from them."],
          d: "P 22.3 22 DPS on coupling|> 22.3 22 75.8 50 then the other coupling", db: ["Destroy both Power Couplings.", "Stay away from the Candle holder."] },
        { n: "Phase 3: Rail Turrets", c: "O 13.3 35 Rail Turret|O 86.7 35 Rail Turret|B 50 52 Nahut",
          t: "P 52 48 Tank: kite Nahut with the core group", tb: ["Keep Nahut with the core group while the turret team works."],
          h: "P 50 40 Core healer|P 18.3 30 Healer with turret team", hb: ["Merlyn suggests a healer goes with the turret team."],
          d: "P 17.3 31 Turret team (2–3 DPS)|> 17.3 31 81.7 31 next turret|P 46 44 Core DPS", db: ["Split about half the DPS onto turrets.", "Interrupt turret casts and break line of sight while it's under 10 stacks."] },
        { n: "Phase 4: electrified floor burn", c: "Z 50 35 30.7 Perimeter|Z 28.2 20.1 7.9 Electrified floor|B 69.8 50 Nahut",
          t: "P 71.8 47 Tank|> 71.8 47 50 62.9 slow kite around the wheel", tb: ["Kite slowly along a pre-agreed path so safe floor lasts."],
          h: "P 61.9 55.9 Healers", hb: ["Move with the tank, never onto lit floor."],
          d: "P 59.9 57.9 DPS (you)", db: ["Burn before the floor runs out."] } ] },
    { name: "Scyva", mp: { a: "asset:map-gods.jpg", f: [3], n: 5, cr: "Merlyn's SWTOR Guides, Gods from the Machine area maps" }, sm: { t: "P1: the Omega Protocol Droid is NOT immune to physics; no knockbacks.", h: "Same as Veteran, lower damage.", d: "P1: kill the droid and destroy both generators in the back corners; rail turrets in the front corners target players." }, ar: "c", conf: "Story/Veteran checked against Merlyn + IDS", src: ["mlScyva", "idsGods", "fGods510"],
      sorc: "Extinction Protocol: Force Speed plus Phase Walk gives you two extra escapes. Stop casting and move.",
      nim: ["Merlyn: VM has the same mechanics as SM, but the ones SM lets you ignore (orbs, purple floor) become dangerous.", "5.10 dev notes: these changes applied to all difficulties, MM included: 3s Initializing Extinction Protocol warning, deflected beams kill generators in one hit, Upheaval can be interrupted.", GODS_INF],
      ph: [
        { n: "Phase 1: Omega Protocol Droid", c: "A 50 35 Omega Protocol Droid|O 11.7 35 W shield generator|O 88.3 35 E shield generator",
          t: "P 50 30 Tank", tb: ["Keep the OPD in the middle of the room. No knockbacks."],
          h: "P 46.3 40 Healers", hb: ["Stay stacked in the middle."],
          d: "P 53.7 40 DPS (you)", db: ["Interrupt the OPD's casts.", "With everyone stacked mid, the beams form an X and destroy both generators."] },
        { n: "Phase 2: CFA Railguns", c: "O 82.9 10.1 East/blue railgun: first|O 17.1 10.1 West railgun",
          t: "P 77.4 16.1 Tank", tb: ["Go east first."], h: "P 71.9 20.1 Healers", hb: ["Heal through the railgun damage."],
          d: "P 73.7 16.1 DPS (you)|> 73.7 16.1 24.4 12.1 then west", db: ["Kill the east/blue railgun first (buff order)."] },
        { n: "Phase 3: Scyva", c: "B 50 35 Scyva|Z 35.4 18.1 5.5 Purple floor (Neutronic Decay)|A 64.6 20.1 Blue orb|A 40.9 55.9 Purple orb: explodes if hit",
          t: "P 61 35 Tanks EAST|> 61 35 64.6 23 aim Radiance at one blue orb", tb: ["Tanks stand east, everyone else west.", "Aim Radiance at a single blue orb. Never at a purple one."],
          h: "P 31.7 36 Healers WEST", hb: ["Move between the inner and outer ring to avoid purple floor."],
          d: "P 35.4 42 Ranged WEST (you)|P 44.5 30 Melee", db: ["Stay off purple floor and away from purple orbs."] },
        { n: "Extinction Protocol (≥30% and 2:10)", c: "B 50 35 Scyva|Z 31.7 22 4.6 Red circle = death|Z 61 50 4.6 Red circle|Z 70.1 18.1 4.6 Red circle",
          t: "P 50 26 Tank: keep moving", tb: ["Stop attacking. Dodge."], h: "P 40.9 46 Healers: keep moving", hb: ["Don't stand still to heal; dodge first."],
          d: "P 57.3 40 DPS (you): keep moving", db: ["Watch for 'Initialize Extinction Protocols', then keep moving until it ends."] } ] },
    { name: "Izax", mp: { a: "asset:map-gods.jpg", f: [4], n: 5, cr: "Merlyn's SWTOR Guides, Gods from the Machine area maps" }, sm: { t: "Same phases as Veteran with lower damage.", h: "Combat-rez is limited (Merlyn notes a 6.1 bug); avoid deaths and stealth-rez if needed.", d: "Watch for Induction Cascade targeting you; new players mostly need to handle that." }, ar: "r", conf: "Story/Veteran checked against Merlyn + IDS", src: ["mlIzax", "idsGods", "fGods510"],
      sorc: "Only one player has to survive the final explosion. A Force Barrier there (with other defensives) is a common insurance pick.",
      nim: ["5.10 dev notes: VM was moved off Master numbers: Izax HP -20%, Tethers -25%, Phase 3 sped up, Phase 5 damage -10%, Phase 5 mines got a 0.5s delay in VM. MM most likely keeps the harder original values.", GODS_INF],
      ph: [
        { n: "100–96%: inside the deflector", c: "B 50 35 Izax|Z 50 35 13.4 Deflector shield",
          t: "P 50 21.5 Tank (one side)", tb: ["Tank on one side so the cleave goes that way.", "Stay off the railing: the 96% push punts players."],
          h: "P 47.3 48.6 Healers (opposite)", hb: ["Stand opposite the tank, close to the middle."],
          d: "P 52.7 48.6 DPS (opposite)", db: ["Induction Cascade on you: move out of the group."] },
        { n: "96–84%: drone puzzle", c: "B 50 12.7 Izax (shielded)|A 29.9 39.9 Anchor Drone: kill first|A 70.1 39.9 Electro Tether Droid|A 40.6 55.3 Energy Drone|A 59.4 55.3 Amplifier Drone",
          t: "P 51.3 18.6 Tank", tb: ["Hold Izax; help with drones."], h: "P 50 39.9 Healers", hb: ["Heavy AoE until the Anchor Drone dies."],
          d: "P 32.5 43.7 DPS (you)|> 40.6 55.3 58 55.3 blue beam to Amplifier|> 59.4 53.4 51.3 16.6 red beam to Izax", db: ["Kill the Anchor Drone, then the Electro Tether Droid.", "Aim the blue beam at the Amplifier, then the red beam at Izax to drop his shield."] },
        { n: "84–64%: Omnicannon", c: "B 50 12.7 Izax|O 74.1 12.7 Tower (reset)|A 36.6 49.5 Electro Tether Droid",
          t: "P 50 18.6 Tank", tb: ["Interrupt Izax as often as possible; 100 charge stacks wipe the raid."],
          h: "P 50 37.9 Healers: all mid", hb: ["Top everyone off before Omnicannon: 70–80% unavoidable damage."],
          d: "P 47.3 39.9 DPS (you)", db: ["Kill the Electro Tethers, then Izax.", "The tower resets Omnicannon stacks (6% boss damage)."] },
        { n: "64% → end: Augment circle, missiles, survival", c: "B 50 10.8 Izax|Z 46 36 6.7 Augment Droid purple circle|A 71.5 49.5 Hull Cutter",
          t: "P 64.7 30.2 Tank outside the circle", tb: ["Stand outside the group and drop blue puddles away from it.", "Missile Volley: find the one safe square of the 3x3 grid, four waves."],
          h: "P 44.6 36 Healers in purple", hb: ["2-minute survival: protect the Gemini Droid.", "Final explosion: corner platforms, defensives up. Only one survivor is needed."],
          d: "P 48.6 37.9 DPS in purple (you)", db: ["Stay inside the Augment circle; kill Hull Cutters.", "Avoid the railing and the green orbs. Kill Electro Tethers in the survival phase."] } ] },
  ] },
  { id: "r4", name: "The R-4 Anomaly", modes: "Story / Veteran", md: ["s", "v"], bosses: [
    { name: "IP-CPT", tr: "F 2 2 96 66 Intake Processing Checkpoint room|K 50 50 6 Central vent", sm: { t: "No Story-specific guide found: expect the Veteran layout with lower damage.", h: "No Story-specific guide found: same as Veteran.", d: "No Story-specific guide found: same as Veteran, lower damage." }, ar: "r", conf: "Checked against Vulkk + IDS + SWTOR Cantina", src: ["vkR4", "idsR4", "cantR4"],
      sorc: "As a terminal player, Force Speed lets you get back on DPS fast.",
      nim: ["There is no Master Mode for R-4 (Vulkk, IDS, Cantina).", "VM (Cantina): 5 hazard stacks are lethal; attack Enforcers from inside their circle; cleanse the stronger debuffs."],
      ph: [
        { n: "Main fight + shape droids", c: "B 50 28 IP-CPT|O 8 8 Green circle|O 92 8 Purple triangle|O 8 62 Blue square|O 92 62 Red hexagon|Z 50 50 6 Fire vent|A 34 42 Inferno/Overload droid",
          t: "P 50 33 Tank|P 32 46 Off-tank|> 32 46 22 34 drag droids away from terminals", tb: ["Tank Inferno/Overload droids away from the button players."],
          h: "P 62 44 Healers", hb: ["Fire is the real killer; lasers are brief.", "VM: cleanse the stronger debuffs (Cantina)."],
          d: "P 12 12 Terminal player|P 44 46 DPS (you)", db: ["One player per shape terminal. Click the shape matching a shielded droid until its shield drops.", "Step off fire vents and marked blasts."] },
        { n: "About 30%: final burn", c: "B 50 28 IP-CPT (Disproportionate Intrusion Response)",
          t: "P 50 33 Tank", tb: ["Use defensives: hard damage timer."], h: "P 50 48 Healers", hb: ["Burst heal and use raid cooldowns."],
          d: "P 44 44 DPS (you)", db: ["Hard DPS timer. Save offensive cooldowns for it."] } ] },
    { name: "Watchdog", tr: "F 2 2 96 66 Watchdog arena (split by polarity)", sm: { t: "No Story-specific guide found: same as Veteran, lower damage.", h: "No Story-specific guide found.", d: "No Story-specific guide found: still split by polarity." }, ar: "r", conf: "Checked against Vulkk + IDS + SWTOR Cantina", src: ["vkR4", "idsR4", "cantR4"],
      sorc: "During a matched floor scan, don't press Force Speed or Phase Walk; movement abilities count as moving.",
      nim: ["No Master Mode.", "VM (Cantina): Stalking and missiles are lethal; beam rotation; trigger-based final phase. One tank is enough."],
      ph: [
        { n: "Polarity fight", c: "B 50 30 Watchdog|Z 24 52 6 Blue group|Z 76 52 6 Orange group|A 50 8 Degauss balls",
          t: "P 50 25 Tank|> 50 25 34 12 drag through balls of the BOSS color", tb: ["During Degauss, drag the boss through balls of its own color, never the opposite.", "One tank is enough on VM (Cantina)."],
          h: "P 24 52 Healer (your color)", hb: ["Opposite colors touching deal heavy raid damage. Stay with your color.", "Floor scan of your color: don't move."],
          d: "P 76 52 DPS (your color)|> 76 52 62 40 intercept a beam of your color", db: ["Polarized Beam: a same-color player steps between the target and the boss.", "Drop missile circles away from the group.", "Stalking on you: kite away."] } ] },
    { name: "Lord Kanoth", tr: "F 2 2 96 66 Overgrown room: vine and rot tiles", sm: { t: "No Story-specific guide found: same as Veteran, lower damage.", h: "No Story-specific guide found.", d: "No Story-specific guide found: same as Veteran." }, ar: "r", conf: "Checked against Vulkk + IDS + SWTOR Cantina", src: ["vkR4", "idsR4", "cantR4"],
      sorc: "Force Speed helps you reach a clean corner for Shockwave.",
      nim: ["No Master Mode.", "VM (Cantina): infestation stacks force a tank swap; more Monstrosities; transitions start earlier; final race."],
      ph: [
        { n: "Vine-tile control", c: "B 50 28 Lord Kanoth|R 8 8 16 12 Fresh Nihrot (grenade)|R 72 44 16 12 Hard Rot (fire probe)|A 50 56 Middle Apparition|A 82 14 Hulking Monstrosity",
          t: "P 53 24 Tank|> 53 24 40 18 move Kanoth off vine tiles", tb: ["Keep Kanoth off vine-covered tiles.", "VM: swap on infestation stacks."],
          h: "P 34 40 Healers", hb: ["Grab grenades from the blue box first.", "Spread Seed of Echoes markers on separate tiles."],
          d: "P 30 42 DPS (you)|P 50 62 Blastwave: hide behind the Apparition", db: ["Grenades clear fresh red vines; fire probes clear pink Hard Rot (cross pattern).", "Grenade the Monstrosity's shield, then kill it before Kanoth's lethal channel ends.", "Shockwave: go to a clean corner. Blastwave: hide behind the middle Apparition."] } ] },
    { name: "Lady Dominique", tr: "F 2 2 96 52 Generator platform|F 2 54 96 14 Lower walkway", sm: { t: "No Story-specific guide found: same as Veteran, lower damage.", h: "No Story-specific guide found.", d: "No Story-specific guide found: still protect the generators." }, ar: "r", conf: "Checked against Vulkk + IDS + SWTOR Cantina", src: ["vkR4", "idsR4", "cantR4"],
      sorc: "On knockback, put your back toward a generator. The recovery jetpack saves one fall, then has a cooldown.",
      nim: ["No Master Mode.", "VM (Cantina): bigger drops, an extra Watchdog phase, and tougher add control."],
      ph: [
        { n: "Generators and walkways", c: "B 50 28 Lady Dominique|O 14 12 Generator (being hacked)|O 86 12 Generator|A 18 22 ARIA hacking droid|R 4 56 92 8 Lower walkway",
          t: "P 52 22 Tank (outer edge)|> 50 28 72 20 face her AWAY from the hacking droid", tb: ["Tank near the outer edge; face her away from the generator being hacked.", "A later phase needs a swap on Shadow Slash stacks. Assign a second tank or a taunting DPS."],
          h: "P 44 40 Healers", hb: ["After the white knockback, get back to her fast.", "Heal the late burn."],
          d: "P 54 40 DPS behind her (you)|> 54 40 70 58 Disturbance: drop on a different walkway", db: ["Stand behind her on a safe walkway.", "Drop the orange Disturbance on a different lower walkway, away from the group.", "Save cooldowns for the final burn."] } ] },
  ] },
  { id: "df", name: "The Dread Fortress", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Nefra, Who Bars the Way", mp: { a: "asset:map-df.jpg", f: [0], n: 5, cr: "SWTOR Fandom wiki, Dread Fortress map files" }, sm: { t: "Face Double Strike away; both tanks stack their green circles to cut the cleave damage.", h: "Nearly a tank-and-spank (Merlyn calls it the easiest boss in the game).", d: "When the Overloaded Assault Droid runs at someone, move away from it." }, ar: "r", conf: "Checked against Dulfy (HM + NiM) + Merlyn", src: ["dDF", "dDFn", "mlDF"],
      sorc: "Sorc healers can cleanse the green DoT. As DPS, grab the droid's threat from range if it heads for a tank.",
      nim: ["Dulfy NiM: swap on Nefra's Curse at 4 stacks (5 = +200% damage taken).", "Dulfy NiM: at 15 Nightmare Twin Attack stacks, 6–8 players stand in front to split it.", "Dulfy NiM: the droids jump to their target, so you get less time to react.", DULFY_OLD],
      ph: [
        { n: "Tank and spank", c: "B 50 24.4 Nefra|O 36.9 10.8 Pillar|A 70.9 55.3 Overloaded Assault Droid|Z 70.9 55.3 3.9 Explosion",
          t: "P 48 17.6 Tank 1|P 51.9 17.6 Tank 2 (stacked)", tb: ["Both tanks stand in front, stacked on their green circles, to split Double Strike.", "Tank near a pillar, with the raid behind Nefra."],
          h: "P 46.1 43.7 Healers", hb: ["Assign cleanse targets for the green Voice of the Masters DoT (about every 30s)."],
          d: "P 53.9 41.8 DPS (you)|> 70.9 55.3 60.4 43.7 droid runs at someone: leave the red circle", db: ["Stay behind Nefra.", "Get out of the droid's red circle; ranged can take its threat.", "Self-cleanse the DoT if you can."] } ] },
    { name: "Gate Commander Draxus", rv: { a: "asset:room-df-draxus.jpg", H: [1.385485, -0.595384, -22.27537, 0.0, 0.207811, 11.701833, 0.0, -0.012276, 1.0], cr: "Frame at 2:37 of \"Dread Fortress - Master Mode - Draxus - Guide (fully narrated)\", Red Hoth Chilly Peppers, YouTube, Jul 4, 2024 (7.5)", href: "https://www.youtube.com/watch?v=Muqfj9Ss0WU&t=157s" }, mp: { a: "asset:map-df.jpg", f: [1], n: 5, cr: "SWTOR Fandom wiki, Dread Fortress map files" }, sm: { t: "10–15s of Draxus alone, then add waves; he jumps down for some waves.", h: "Add waves are the danger; keep the tanks up.", d: "Follow the add kill priority; it's the same as Veteran with less damage." }, ar: "r", conf: "Checked against Dulfy (HM + NiM) + Merlyn + 2 kill videos (7.3, 7.5)", src: ["dDF", "dDFn", "mlDF"], flag: ["Per-wave spawn sides and roles come from an automated review of two kill videos: the narrated Master Mode guide (Red Hoth Chilly Peppers, 7.5) and a 16-player Veteran kill (xtopolis, 7.3). They're cross-checked with Dulfy and Merlyn; where they disagree, the video wins. Dulfy puts the Dismantlers on the west and east sides, but the videos show them at the back corners.", "Draxus Despatchers also come in from the front gate; the review didn't say which wave.", "Spots are placed by the room's layout (front stairs and gate, raised emblem in the middle, side doors, back door), so they're approximate."],
      sorc: "Sorc/Sage bubbles cast from outside a Bulwark shield still work on players inside it (Dulfy NiM).",
      nim: ["Dulfy NiM: Subteroth explosions give +200% damage taken, so tanks survive 2–3 at most.", "Dulfy NiM: interrupting a Corruptor gives Backlash (a second interrupt kills you). Plan an interrupt rotation.", "Dulfy NiM: players under a Bulwark shield can't be healed; Guardian slam one-shots non-tanks.", DULFY_OLD],
      ph: [
        { n: "Draxus phases: raid stacks on the stairs", c: "B 50.0 11.1 Draxus (middle landing, front stairs)|O 50.0 3.2 Front gate|R 44.8 34.8 11.9 11.9 Raised emblem",
          t: "P 50.0 16.7 Tank: hold Draxus; Suppressive Fire away from the stack", tb: ["Face Suppressive Fire away from the raid. He takes about 20% per landing, then flies off (Dulfy).", "Sequence: Draxus → W1–2 → Draxus + W3 → W4 → Draxus + W5 → W6–8 → Draxus + W9."],
          h: "P 55.6 20.7 Healers: in the stack on the stairs", hb: ["The whole raid stacks tightly on the stairs in front of Draxus.", "Top everyone up before the next wave."],
          d: "P 44.4 18.3 Melee DPS: stack on the stairs on Draxus|P 51.6 24.7 Ranged DPS: same stack, front of the stairs", db: ["Stack tight on the stairs and burn Draxus.", "When he flies off, turn to the next wave's doors."] },
        { n: "Waves 1–2: Subteroths", c: "A 50.0 65.2 W1 Subteroths (back-center door)|A 50.0 5.6 W2 Subteroths (front gate, down the stairs)|R 44.8 34.8 11.9 11.9 Raised emblem",
          t: "P 50.0 40.6 Tank: group the Subteroths dead center|> 50.0 61.2 50.0 45.3 pull W1 to the center", tb: ["Pick up the W1 Subteroths at the back door and group them in the middle so cleave hits them all.", "W2 comes down the stairs from the front gate: drag them into the same pile."],
          h: "P 50.0 28.6 Healers: central floor, line of sight to both sides", hb: ["Stand centrally so you can see both sides of the hall."],
          d: "P 44.4 46.1 Melee DPS: cleave the pile|P 57.1 28.6 Ranged DPS: central floor, AoE the pile", db: ["AoE the pile in the center.", "MM: each Subteroth death stacks a vulnerability debuff, so designated players soak the explosions with a defensive."] },
        { n: "Wave 3: Corruptor pair (Draxus up)", c: "B 50.0 11.1 Draxus|A 33.3 39.8 W3 Corruptor (mid-left)|A 66.7 39.8 W3 Corruptor (mid-right)|R 44.8 34.8 11.9 11.9 Raised emblem",
          t: "P 50.0 16.7 Tank: keep Draxus on the landing", tb: ["Draxus is up during this wave: hold him where he is."],
          h: "P 50.0 28.6 Healers: central floor, line of sight to both Corruptors", hb: ["Both halves of the raid are split: stand where you can reach each."],
          d: "P 37.3 33.4 Split group 1: left Corruptor, interrupt|P 62.7 33.4 Split group 2: right Corruptor, interrupt", db: ["The raid splits in two, one half on each Corruptor; interrupt every cast.", "MM: an interrupt gives Backlash (a second one kills you), so rotate interrupters (Dulfy NiM)."] },
        { n: "Wave 4: Dismantlers + Subteroths", c: "A 34.9 60.5 W4 Dismantler (back-left corner)|A 65.1 60.5 W4 Dismantler (back-right corner)|A 50.0 5.6 W4 Subteroths (front gate)|R 44.8 34.8 11.9 11.9 Raised emblem",
          t: "P 38.1 54.9 Tank 1: left Dismantler, faced away from the center|P 61.9 54.9 Tank 2: right Dismantler, faced away", tb: ["Pick each Dismantler up near its corner and face it away from the raid.", "Dodge the circle slams. Kill the blue Dismantler first (3x Strong Swipe, Dulfy)."],
          h: "P 50.0 30.2 Healers: central floor", hb: ["Watch the Dismantler tanks; step out of slam circles."],
          d: "P 50.0 52.5 Melee DPS: on the Dismantler being killed|P 56.3 23.9 Ranged DPS: central floor, then the Subteroths", db: ["Blue Dismantler first, then red; clean up the Subteroths coming down the stairs.", "Stay out of the slam circles."] },
        { n: "Wave 5: Bulwarks + corner Corruptors (Draxus up)", c: "B 50.0 11.1 Draxus|A 34.9 12.7 W5 Bulwark (front-left, raised)|Z 34.9 12.7 5.7 Bulwark shield (4m)|A 65.1 12.7 W5 Bulwark (front-right, raised)|Z 65.1 12.7 5.7|A 34.9 60.5 W5 Corruptor (back-left)|A 65.1 60.5 W5 Corruptor (back-right)",
          t: "P 50.0 16.7 Tank: hold Draxus", tb: ["Draxus is up again: keep him on the landing, cone away."],
          h: "P 50.0 31.8 Healers: central floor, outside the shields", hb: ["Anyone inside a Bulwark shield can't be healed (Dulfy NiM); heal them when they step out."],
          d: "P 39.7 17.5 Assigned DPS: into the Bulwark bubble|P 38.9 54.9 Split group 1: back-left Corruptor|P 61.1 54.9 Split group 2: back-right Corruptor", db: ["Assigned players run into each Bulwark's bubble (within 4m) to damage it.", "Split for the corner Corruptors and keep interrupting."] },
        { n: "Wave 6: center Bulwark, Corruptor, Despoiler", c: "A 50.0 40.6 W6 Bulwark (dead center)|Z 50.0 40.6 5.7 Bulwark shield (4m)|A 33.3 39.8 W6 Corruptor (mid-left)|A 66.7 39.8 W6 Despoiler, healer add (mid-right)",
          t: "P 50.0 23.9 Tank: hold leftovers off the healers", tb: ["The review lists no Dismantler or Guardian in W6: help on the Bulwark and peel loose adds."],
          h: "P 55.6 25.5 Healers: outside the center shield", hb: ["The Bulwark sits on the center: heal from just outside its 4m bubble."],
          d: "P 46.0 43.8 Assigned DPS: inside the center Bulwark bubble|P 37.3 35.0 Melee DPS: peel to the Corruptor, interrupt|P 62.7 35.0 Melee DPS: peel to the Despoiler|P 42.9 27.0 Ranged DPS: central floor", db: ["Melee peel to the Corruptor and the Despoiler where they spawn.", "Ranged stay central for line of sight to both."] },
        { n: "Wave 7: Guardians + Subteroths", c: "A 28.6 41.4 W7 Guardian (left side door)|A 71.4 41.4 W7 Guardian (right side door)|A 50.0 5.6 W7 Subteroths (front gate)|R 44.8 34.8 11.9 11.9 Raised emblem",
          t: "P 34.1 46.1 Tank 1: left Guardian, faced away|P 65.9 46.1 Tank 2: right Guardian, faced away", tb: ["Pick up the Guardians at the side doors and face their purple cones away from the raid.", "In NiM the Guardian slam one-shots non-tanks (Dulfy)."],
          h: "P 50.0 28.6 Healers: central floor", hb: ["Stay out of the purple Guardian cones."],
          d: "P 50.0 19.1 Melee DPS: Subteroths at the foot of the stairs|P 57.1 30.2 Ranged DPS: central floor", db: ["Dodge the Guardian cones.", "MM: only the designated soakers stand in Subteroth explosions."] },
        { n: "Wave 8: Corruptors, Bulwarks, Despoiler", c: "A 38.1 20.7 W8 Corruptor (front-left, base of stairs)|A 61.9 20.7 W8 Corruptor (front-right, base of stairs)|A 34.9 60.5 W8 Bulwark (back-left)|Z 34.9 60.5 5.7 Bulwark shield (4m)|A 65.1 60.5 W8 Bulwark (back-right)|Z 65.1 60.5 5.7|A 50.0 40.6 W8 Despoiler (center floor)",
          t: "P 50.0 47.7 Tank: hold the leftovers from W6–7 near the center", tb: ["W6–8 come back to back with no Draxus phase between (Dulfy)."],
          h: "P 50.0 31.8 Healers: central floor, outside both shields", hb: ["Heal people as they come out of the Bulwark bubbles."],
          d: "P 42.1 24.7 Split group 1: front-left Corruptor|P 57.9 24.7 Split group 2: front-right Corruptor|P 38.9 54.9 Assigned DPS: into a Bulwark bubble|P 54.8 43.8 Melee DPS: Despoiler in the center", db: ["Split for the Corruptors at the base of the stairs; interrupt.", "Assigned players go into the back-corner Bulwark bubbles; melee kill the Despoiler."] },
        { n: "Wave 9: final wave (Draxus up)", c: "B 50.0 11.1 Draxus|A 39.7 13.5 W9 Guardian (front-left, on the stairs)|A 60.3 13.5 W9 Guardian (front-right, on the stairs)|A 50.0 65.2 W9 Corruptor (back-center door)",
          t: "P 43.7 19.1 Tank 1: left Guardian beside Draxus|P 56.3 19.1 Tank 2: right Guardian beside Draxus", tb: ["Two Guardians land on the stairs next to Draxus: pick them up and face the cones off the stack.", "Who holds Draxus during W9 isn't clear from the review; agree it before the pull (unverified)."],
          h: "P 50.0 27.0 Healers: below the stairs, line of sight to the back door", hb: ["Keep the Guardian tanks up; stay out of the cones."],
          d: "P 50.0 58.9 Melee DPS: back-center Corruptor, interrupt|P 50.8 23.1 Ranged DPS: on Draxus from below the stairs", db: ["One group peels to the back-center Corruptor and interrupts.", "Everyone else burns Draxus."] } ] },
    { name: "Grob'thok, Who Feeds the Forge", mp: { a: "asset:map-df.jpg", f: [2], n: 5, cr: "SWTOR Fandom wiki, Dread Fortress map files" }, sm: { t: "Move Grob'thok into the ceiling magnet to stun him and interrupt Pipe Smash.", h: "The magnet stuns players too; stay out of the outer track.", d: "Don't stand in fire; kill add waves." }, ar: "c", conf: "Checked against Dulfy (HM + NiM) + Merlyn", src: ["dDF", "dDFn", "mlDF"],
      sorc: "Lava feet on you: keep moving and lay the trail where the off-tank drags the Ugnaughts.",
      nim: ["Dulfy NiM: standing under the Magnet kills you; two players get mining lasers.", "Dulfy NiM: Dreadful Ugnaughts are immune until run through lava; Roar knocks back and forces a swap; consecutive Pipe Smashes get lethal.", DULFY_OLD],
      ph: [
        { n: "Roar, Pipe Smash and lift", c: "B 50 35 Grob'thok|O 33 18 Magnetic lift (moves)|A 70 55 Dreadful Ugnaughts|Z 32 52 5 Lava trail",
          t: "P 53.7 31 Tank|> 53.7 31 35 20 after Pipe Smash: drag him under the lift|P 66 51 Off-tank: Ugnaughts", tb: ["Face Roar away from the raid.", "Let Pipe Smash finish, then drag him under the magnetic lift: it stops the smashes and stuns him.", "Off-tank holds the Ugnaught packs."],
          h: "P 37.6 46 Healers", hb: ["Pipe Smash spam also cuts his damage taken by about 80% (Dulfy). Push the lift."],
          d: "P 42.6 44 DPS (you)|> 33 53 68 53 lava feet: run the trail through the Ugnaughts", db: ["Lava feet on you: keep moving and lead the trail where the Ugnaughts are kited.", "Kill the Ugnaughts as each new group spawns."] } ] },
    { name: "Corruptor Zero", mp: { a: "asset:map-df.jpg", f: [3], n: 5, cr: "SWTOR Fandom wiki, Dread Fortress map files" }, sm: { t: "Hold it while add waves come (opens with a double wave).", h: "Same as Veteran.", d: "At low health it leaps around the cross-shaped room and fires Unified Beam down the middle: stay out of the line." }, ar: "r", conf: "Checked against Dulfy (HM + NiM) + Merlyn", src: ["dDF", "dDFn", "mlDF"],
      sorc: "Spread for Missile Barrage. Madness AoE is valued on the NiM version (Dulfy).",
      nim: ["Dulfy NiM: adds are CC-immune; three extra Unified Beams; two Concussion Mines at once. Never let two mine carriers meet.", DULFY_OLD],
      ph: [
        { n: "Melee / ranged mode (swaps every 60s)", c: "B 50 30.2 Corruptor Zero|Z 50 30.2 8.5 Anti-Gravity Field (ranged mode)|A 25.1 14.7 Repair droid: kill first|A 74.9 14.7 D-15 Corruption droid",
          t: "P 51.5 25.3 Tank|> 51.5 25.3 62.4 18.6 leave the Anti-Gravity Field", tb: ["Swap at 4–6 stacks.", "Heavy Slash (melee mode) and Chest Laser (ranged): defensives.", "Get out of the Anti-Gravity Field or you drop aggro."],
          h: "P 39.1 47.6 Healers", hb: ["Cleanse the Heavy Slash bleed and the Chest Laser DoT."],
          d: "P 57.8 47.6 DPS (you)|P 65.5 53.4 Concussion Mine: run into the boss", db: ["Kill the repair droids first.", "Concussion Mine on you: run into Corruptor Zero to clear it.", "Below 20%: dodge Unified Beam (instant death)."] } ] },
    { name: "Dread Master Brontes", mp: { a: "asset:map-df.jpg", f: [4], n: 5, cr: "SWTOR Fandom wiki, Dread Fortress map files" }, sm: { t: "Same phases as Veteran: face the Hands' cone slams away.", h: "Same as Veteran, lower damage.", d: "Burn both Hands to 40%; mechanics match Veteran and are just as important." }, ar: "c", conf: "Checked against Dulfy (HM + NiM) + Merlyn", src: ["dDF", "dDFn", "mlDF"],
      sorc: "Dulfy NiM: Force Speed can briefly break the transition slow so you get out of the beams.",
      nim: ["Dulfy NiM: two Fingers in P1; more Reach pairs in the transition; Kephess clone leaps.", "Dulfy NiM: the 50% beam rotation can go either way; the six Fingers knock back, so use a rotation; tanks use the Hands to squash Energy Spheres in P4.", DULFY_OLD],
      ph: [
        { n: "P1: Hands + Fingers", c: "B 50 12.1 Brontes (platform)|A 27 40 Left Hand|A 73 40 Right Hand|A 50 55.9 Finger",
          t: "P 25.2 44 Tank 1|P 74.7 44 Tank 2", tb: ["Each tank faces a Hand away from the raid (conal slam).", "A Hand despawns after about 20% damage and respawns across the room; it debuffs its tank, so the other tank picks it up."],
          h: "P 50 36 Healers", hb: ["Fingers that live too long switch to Focused Beam: big damage."],
          d: "P 50 46 DPS (you)", db: ["Kill Fingers as they spawn, then the Hand your lead calls."] },
        { n: "P2: Brontes to 50%", c: "B 50 22 Brontes|A 69.4 46 Kephess clone|A 23.5 40 Energy Sphere",
          t: "P 50 26 Tank|P 71.2 50 Off-tank: clone", tb: ["Arcing Assault 4s channel: swap.", "Off-tank holds the Kephess clone facing away (Laser Blast)."],
          h: "P 41.1 46 Healers", hb: ["Cleanse Corrupted Nanites."],
          d: "P 46.5 44 DPS (you)", db: ["Transition: get away from Reach of Brontes pairs and their beams.", "Run into Energy Spheres at the stack count your lead calls."] },
        { n: "50%: clock beam, then Fingers; P4 burn", c: "B 50 35 Brontes|Z 50 35 26.5 Rotating beam|A 50 8.1 Finger",
          t: "P 32.3 20.1 Tanks|> 32.3 20.1 67.7 20.1 run around the clock with the gap", tb: ["Run around with the gap as the beam rotates.", "P4: backs to a wall; taunt-swap through Beam Volley target swaps."],
          h: "P 30.5 26 Healers", hb: ["P4: Manifest Supremacy DoT ramps. Raid cooldowns."],
          d: "P 28.8 30 DPS (you)|> 28.8 30 64.1 30 follow the gap", db: ["Kill the Fingers, then the Hands.", "Avoid purple Spike of Pain circles."] } ] },
  ] },
  { id: "dp", name: "The Dread Palace", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Dread Master Bestia", mp: { a: "asset:map-dp.jpg", f: [0], n: 5, cr: "SWTOR Fandom wiki, The Dread Palace map files" }, sm: { t: "P1: Bestia is shielded; tank the adds from the corner portals. P2 Bestia alone. P3 both.", h: "Same three phases, lower damage.", d: "P1: kill 4 Monsters and their Larva (from the corner portals) to drop her shield." }, ar: "c", conf: "Checked against Dulfy (HM) + Merlyn; MM from Admiral Nick (single source)", src: ["dDP", "mlDP", "anBestia"],
      sorc: "Jolt the Tentacle's Spit if your interrupt is up; Spit one-shots its target.",
      nim: ["Admiral Nick: three Dread Monsters spawn instead of two (two from the right side in his runs).", "In phase 2, monsters and adds keep spawning; VM pauses them until 50%.", "Dread Tentacles that nobody has threat on finish their channel and one-shot players.", "Non-tanks bring stray larva into the group for the AoE tank.", AN_NOTE],
      ph: [
        { n: "P1 adds, P2 Bestia, 50% burn", c: "B 50 20.1 Bestia (lands in P2)|A 19.9 40 Dread Tentacle (Spit)|A 80 40 Dread Monster|A 70 55.9 Dread Monster",
          t: "P 50 25 Tank|P 78 44 Off-tank: Monsters apart", tb: ["Keep the big adds apart and away from Bestia; they buff each other when close.", "Bestia: swap at about 4 stacks."],
          h: "P 44 42 Healers", hb: ["Expectorate adds hit the whole raid; kill them after the Tentacles."],
          d: "P 23.9 44 DPS (you)|> 64 46 77 59 Combusting Seed: run out", db: ["Interrupt Spit (8s cast) or it one-shots its target.", "Combusting Seed (red circle) on you: leave the raid; it explodes."] } ] },
    { name: "Dread Master Tyrans", mp: { a: "asset:map-dp.jpg", f: [1], n: 5, cr: "SWTOR Fandom wiki, The Dread Palace map files" }, sm: { t: "Same as Veteran: Tyrans teleports instead of walking.", h: "Watch your range as platforms disappear.", d: "Place Simplification carefully so the group doesn't run out of platforms." }, ar: "r", conf: "Checked against Dulfy (HM) + 7.0 patch notes; MM from Admiral Nick (single source, pre-7.0)", src: ["dDP", "mlDP", "p70", "anTyrans"],
      flag: ["Room-map placement: the floating tile platforms are not drawn on the area map; tile spots are approximate.", "7.0 patch: you can no longer drop Simplification by vanishing.", "Admiral Nick's Tyrans guide predates 7.0. Re-check the tile and holocron details in game."],
      sorc: "Tiles break under the circles: Force Speed off a marked tile early. Don't rely on Phase Walk, because its marker can sit on a tile that has since fallen.",
      nim: ["Admiral Nick: new checkerboard tile layout; you move diagonally.", "After each Simplification, 3 players get a debuff. They must drop to the lower level and click the holocron to cleanse it, or die.", "Everyone gets Inferno. Melee drop all puddles in one quarter of the platform and wait for the debuff to expire.", AN_NOTE],
      ph: [
        { n: "Tile platform, left to right", c: "B 36.7 30.2 Tyrans|R 28.6 22.4 8 11.6 Tile he stood on|R 20.6 6.9 8 11.6 Side tile|R 20.6 51.5 8 11.6 Side tile",
          t: "P 39.3 30.2 Tank|> 39.3 30.2 50 30.2 move him one tile right|P 32.6 28.2 Tank with circle: drops it on the old tile", tb: ["Face Thundering Blast away from the raid.", "Simplification always hits the main tank first: swap, and drop the circle on the tile Tyrans just left."],
          h: "P 24.6 57.3 Healers (side tiles)", hb: ["Two Affliction DoTs can't be cleansed. Heal through.", "Drop your Inferno fire without blocking players with longer timers."],
          d: "P 24.6 12.7 Ranged (side tiles)", db: ["Ranged drop Simplification circles on side or back tiles.", "Shift right as a group as the floor breaks."] } ] },
    { name: "Dread Master Calphayus", mp: { a: "asset:map-dp.jpg", f: [2], n: 5, cr: "SWTOR Fandom wiki, The Dread Palace map files" }, sm: { t: "Easy tanking (Merlyn: the easiest DP boss in Story).", h: "No real healing check.", d: "Portals: BLUE/PAST on the left, ORANGE/FUTURE on the right; clear each challenge." }, ar: "c", conf: "Checked against Dulfy (HM) + Merlyn; MM from Admiral Nick (single source)", src: ["dDP", "mlDP", "anCalph"],
      sorc: "Dulfy's Story notes say Force Speed doesn't drop the Seed of Knowledge. That isn't confirmed for Veteran, so test it before relying on it.",
      nim: ["Admiral Nick: only 5s to reach your portal when he returns to the throne.", "The big red circle roots: bait it away from the group or people can't reach the portals.", "Seed-phase add: kill it at once or its DoT overwhelms the healer.", "Phase 4: an orb of death roams the orange team's side and drops purple circles; it shuts off when the blue team breaks the right crystal.", AN_NOTE],
      ph: [
        { n: "Present + portals (80% / 50%)", c: "B 50 30 Calphayus|O 25 8 Past portal (blue)|O 74 8 Future portal (orange)|Z 67.9 55.9 5.4 Distorted Perceptions",
          t: "P 51.8 25 Tank|P 59 22 Other tank: taunt after Inevitability", tb: ["Inevitability: frontal knockback plus a debuff that kills you on any damage from him. Swap at once and face him away."],
          h: "P 41.1 46 Healers", hb: ["Future team: kill Dread Defilers before Mass Affliction (15s cast).", "Past team: heal the Seed of Knowledge for 75s."],
          d: "P 44.6 44 DPS (you)", db: ["80%: split teams. Future finds the Dark Growth and calls it; Past keeps the Seed alive, then plants it there.", "50%: take the other portal. Future calls fountain + crystal (clock position); Past destroys that crystal within 30s, three times."] } ] },
    { name: "Dread Master Raptus", tr: "K 50 35 33 Circular platform (after the opening teleport)", sm: { t: "Short opening, then he teleports to the circular platform; same as Veteran.", h: "Watch burst during challenges.", d: "Same challenges as Veteran; avoid the Force Execution centre." }, ar: "c", conf: "Checked against Dulfy (HM) + Merlyn; MM from Admiral Nick (single source)", src: ["dDP", "mlDP", "anRaptus"], flag: ["The area map shows only the opening room; the main fight is on a circular platform after a teleport, so this boss uses a traced layout."],
      sorc: "If Raptus challenges you, Force Speed + Phase Walk make kiting Spinning Attack easy.",
      nim: ["Admiral Nick: changes little from VM, but Force Execution starts right on the pull and comes far more often. A spin-cycle mechanic is added in the long burn.", "Vanguard/PT tanks can ignore his knockbacks with Hold the Line/Hydraulic Overrides.", AN_NOTE],
      ph: [
        { n: "Platform + challenges (75%, 50%)", c: "B 50 35 Raptus|Z 50 35 8 Force Execution centre|O 50 6 Curse shrines|O 8 35 Portal|O 92 35 Portal",
          t: "P 50 30 Tank: middle|> 50 30 50 41 Deadly Slash: run through", tb: ["Tank in the middle, away from the edge.", "Rising Slash throws you up: swap."],
          h: "P 30 52 Healers", hb: ["Grab your curse (green shrine = healers) before the challenges."],
          d: "P 70 52 DPS (you)", db: ["Swirling Circle on you: move away; it teleports everyone inside to the back bridge.", "Get out of the Force Execution centre before it turns red.", "Challenged player kites Spinning Attack (he's immune while spinning). DPS challenge: interrupt Health of the Void at 25%."] } ] },
    { name: "Dread Council", mp: { a: "asset:map-dp.jpg", f: [4], n: 5, cr: "SWTOR Fandom wiki, The Dread Palace map files" }, sm: { t: "Four phases; several hard-mode mechanics are still present but much less punishing.", h: "Same phases as Veteran, lower damage.", d: "Same as Veteran; Story still needs coordination." }, ar: "r", conf: "Checked against Dulfy (HM) + Merlyn; MM from Admiral Nick (single source)", src: ["dDP", "mlDP", "anCouncil", "gcCouncil"],
      sorc: "Cleanse Death Marks on melee and tanks first; they can't self-cleanse.",
      nim: ["Admiral Nick: all four Dread Masters jump in on the pull.", "Throne timers shrink from 30s: Tyrans and Raptus 15s, Calphayus 10s, Bestia 5s. Push Tyrans and Raptus first, Calphayus third, Bestia last.", "Keep the Bestia tank at 1 Corruption stack (a DwT taunts).", "P2: Styrak's ghost does Chained Manifestation, and Brontes' Reaches and beam return. Going Commando also notes Styrak grows big as in his solo fight.", AN_NOTE],
      ph: [
        { n: "Four Masters, then thrones", c: "B 33.2 30.2 Bestia|B 66.8 30.2 Tyrans|B 43.3 49.5 Raptus|B 56.7 49.5 Calphayus (kited)|O 25.8 8.9 Brontes throne|O 74.1 8.9 Styrak throne",
          t: "P 34.5 26.3 Tank 1|P 58 53.4 Tank 2|> 58 53.4 70.1 61.1 kite Calphayus", tb: ["P2: one tank enters Styrak's portal to clear his Supremacy crystal."],
          h: "P 50 36 Healers", hb: ["Cleanse the four Death Marks before they expire, shortest first."],
          d: "P 47.3 37.9 DPS (you)|P 27.2 14.7 Brontes throne runner", db: ["Push all four to about 55%, then to 50% together: all within 40s or they heal.", "P2: one player goes through Brontes's portal and clicks her crystal to remove Supremacy."] } ] },
  ] },
  { id: "tfb", name: "Terror From Beyond", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "The Writhing Horror", tr: "K 50 35 33 Wetland arena", sm: { t: "Same positions as Veteran.", h: "Same as Veteran.", d: "Same as Veteran; adds hit softer." }, ar: "c", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlTfB", "dTfBn"],
      sorc: "Healer: cleanse Corrosive Slime only when the target is by a wall, since VM leaves a Void Zone where they stand.",
      nim: ["Merlyn MM: much higher tank damage; Corrosive Slime ticks 8–16% of HP; random burrow pattern.", "Main tank should not taunt Twisted Spawn (Acidic Corrosion stacks)."],
      ph: [
        { n: "Burrow cycle", c: "B 50 30 Writhing Horror|A 22 50 Jealous Male|A 78 50 Foul Offspring|O 14 20 Flower (Calming Pheromone)|Z 86 14 5 Void Zone",
          t: "P 50 25 Tank|P 60 22 Other tank", tb: ["VM: swap when Incubation expires; Recently Implanted kills you if you take another stack."],
          h: "P 12 42 Healers by a wall", hb: ["Cleanse Corrosive Slime; VM drops a 60s Void Zone at that spot. Cleanse at the wall."],
          d: "P 86 40 DPS (you) by a wall|P 14 26 Flower player", db: ["Kill order: Foul Offspring → Jealous Male → Horror.", "VM: one player per flower gets Calming Pheromone (offspring deal 95% less).", "Under 13%: Twisted Spawn trickle in. Burn."] } ] },
    { name: "Dread Guards (Heirad, Ciphas, Kel'sara)", tr: "F 2 2 96 66 Dread Guard hall", sm: { t: "Same positions as Veteran.", h: "Same as Veteran.", d: "Same kill order as Veteran." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlTfB", "dTfBn"],
      sorc: "Dulfy's NiM guide lists sorcerers among the classes that can negate Lightning Field damage with a defensive. Plan which one with your lead.",
      nim: ["Merlyn MM: Lightning Field hits much harder and more often; Surging Chain reflects; Doom is 6 stacks over 34s; red puddles in P3.", DULFY_OLD],
      ph: [
        { n: "Heirad → Ciphas → Kel'sara", c: "B 30 26 Heirad|B 70 26 Ciphas|B 50 50 Kel'sara|Z 20 54 4 Green puddle|Z 80 54 4 Green puddle",
          t: "P 30 22 Tank 1|P 70 22 Tank 2", tb: ["VM: Gored stacks on the Ciphas tank.", "Kel'sara: Force Leech on you = no heals for 18s, and heals hurt you."],
          h: "P 50 36 Healers", hb: ["DO NOT HEAL the Force Leeched tank.", "Doom: the target eats 3 green puddles (VM)."],
          d: "P 44 38 DPS (you)", db: ["Kill order: Heirad, then Ciphas, then Kel'sara (Dark Bond).", "Spread for Lightning Field; interrupt Ciphas's Strangle.", "Kel'sara at 75/50/25%: kill the one-saber Legionnaire before Mass Affliction."] } ] },
    { name: "Operator IX", tr: "K 50 35 33 Central round room (colour wings outside)", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Color roles still apply: everyone must do their color." }, ar: "c", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM + 7.0 notes", src: ["mlTfB", "dTfBn", "p70"],
      flag: ["7.0: Data Cores are immune to CC in Master Mode."],
      sorc: "Your Force Speed makes you a good mid/channel runner between colour circles.",
      nim: ["Merlyn MM: failing any colour phase or Black Obtuse wipes; Data Cores must die within 5s of each other (White Parallel); wrong-colour circle = death; Disinfection hits very hard."],
      ph: [
        { n: "P1 colour phases; P2 Operator", c: "O 50 35 Operator IX / colour circles|A 50 8 Data Core (N)|A 50 62 Data Core (S)|A 20 35 Regulator|A 80 35 Colour sphere",
          t: "P 22 38 Tank on Regulator", tb: ["Stay within 10m of the Regulator to avoid Pause Break.", "P2: taunt back after Disinfection."],
          h: "P 60 40 Healers", hb: ["Regulator Trauma: -25% healing taken for 6s."],
          d: "P 50 14 DPS north core|P 50 56 DPS south core", db: ["Timers in VM: blue 70s, orange 60s, purple 55s, yellow 50s.", "Kill your colour's sphere for its Obtuse buff (one each).", "MM: call % and kill both cores within 5s."] } ] },
    { name: "Kephess the Undying", tr: "F 2 2 96 66 Hypergate tower arena", sm: { t: "P1 has no mechanics in Story (Merlyn).", h: "P1 is a plain fight.", d: "P1: just burn; later phases as Veteran." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlTfB", "dTfBn"],
      sorc: "Energy Distortions lock onto a player; ranged DPS are the usual pick (Dulfy).",
      nim: ["Merlyn MM: Kephess must be inside the yellow circle around the tower during Laser Blast; 3 Energy Distortions; 3 nanite targets; tower breaks after the first channel ends; Dread Bomb lethal."],
      ph: [
        { n: "P1 towers → P2 nanites → burn", c: "B 50 30 Kephess|O 20 12 Hypergate Control Tower|Z 50 35 8 Hypergate Void|A 76 50 Energy Distortion",
          t: "P 47 26 Tank|> 47 26 26 16 kite him to the linked tower", tb: ["VM: Overcharge + Ignored means swap.", "Kite Kephess near the tower he's linked to."],
          h: "P 60 48 Healers", hb: ["P2 Corrupted Nanites are cleansed only by channelling the spawned towers."],
          d: "P 66 46 DPS (you)|> 66 46 24 16 Laser Blast target: line the beam through the tower", db: ["Laser Blast on you: stand so the beam hits the linked tower.", "Pick up your Energy Distortion.", "P2: Dread Bomb red circle out of the group."] } ] },
    { name: "The Terror From Beyond", tr: "K 50 35 33 Island (P1); P2 moves to floating platforms", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "P2 platforms: same as Veteran." }, ar: "c", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM + 7.0 notes", src: ["mlTfB", "dTfBn", "p70"],
      flag: ["7.0: if the Terror is denied its Scream too long it uses an empowered Frustrated Scream (VM/MM)."],
      sorc: "P2 platform hopping: Force Speed and Phase Walk help you get back to Home after Scream.",
      nim: ["Merlyn MM: enrage after 3 waves of Tunneling Tentacles; larva one-shot; Void Disturbance kills at 5 stacks; 9-min P2 enrage; jumping off the back of a platform kills."],
      ph: [
        { n: "P1 tentacles, P2 platforms", c: "B 50 10 Terror|A 30 36 Tunneling Tentacle|A 70 36 Tunneling Tentacle|A 50 50 Hypergate Beacon|A 84 56 Unstable Larva",
          t: "P 28 40 Tank 1|P 72 40 Tank 2", tb: ["Each tank holds a tentacle; don't drift far away (MM: it Slams sooner).", "P2: Grasping Tentacle Slam can one-shot non-tanks."],
          h: "P 50 56 Healers", hb: ["The Beacon latches onto a player (usually a healer) and pulls; kill it.", "P2 Scream: return to Home platform to purge Faded Reality."],
          d: "P 50 42 DPS (you)", db: ["Burn the tentacles; avoid exploding larva.", "Void Disturbance orb hurts you and the tentacle.", "P2: kill Irregularities/Anomalies fast."] } ] },
  ] },
  { id: "sv", name: "Scum and Villainy", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Dash'roode", tr: "F 2 2 96 66 Open desert (sandstorm)", sm: { t: "Stay in the shield bubble; buy Personal Environmental Shields if needed.", h: "Sandstorm damage is low until stacks get high.", d: "Stay in the shield bubble and move with it." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM + 7.0.2 notes", src: ["mlSV", "dSVn", "p702"],
      flag: ["7.0.2: the Sandstorm can no longer be avoided."],
      sorc: "Merlyn: Sage/Sorc should use the friendly pull (Rescue / Extrication) to drag lost players back into the shield.",
      nim: ["Merlyn MM: portable shield is much smaller and lasts 30s; damage higher; tight DPS check, so most groups burn the last 5–20% in the storm."],
      ph: [
        { n: "Shield generator hops", c: "B 50 28 Dash'roode|O 20 50 Shield generator|O 80 50 Next generator|Z 50 30 12 Shield bubble|A 86 14 Voracious Xuvvas",
          t: "P 50 24 Tank: cleave away", tb: ["Face the cleave away and stay inside the bubble.", "Carry the portable shield to the next generator quickly."],
          h: "P 44 34 Healers", hb: ["Players lost in the sandstorm get Womp Rat slows; heal them home."],
          d: "P 56 34 DPS (you)|> 56 34 80 22 kill Xuvvas before they kill the generator", db: ["Kill the Xuvva pairs attacking the generator.", "Stay with the shield when moving."] } ] },
    { name: "Titan 6", tr: "F 2 2 96 66 Arena with rock cover", sm: { t: "Same order as Veteran; burn below 20%.", h: "Lots of Missiles hits everyone: heal the group; spreading cuts damage.", d: "Spread for Lots of Missiles; dodge red Air Strike circles; burn at 20%." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlSV", "dSVn"],
      sorc: "Huge Grenade on you (MM): run out, bubble, defensives, Force Speed back for Launch.",
      nim: ["Merlyn MM: two Huge Grenades (destroy rocks); Launch one-shots anyone not behind a rock (2s cast); grenades and pulls continue in the burn."],
      ph: [
        { n: "Rocks and grenades", c: "B 50 18 Titan 6|O 30 40 Rock|O 50 46 Rock|O 70 40 Rock|Z 50 30 6 Airstrike",
          t: "P 50 24 Tank|> 50 24 88 24 Huge Grenade: run out, leap back", tb: ["Huge Grenade lands on you after Airstrike: take it out of the group.", "Kick gives Buried: stun-break it (every other time)."],
          h: "P 30 44 Healer behind rock", hb: ["VM: one player per rock (8m) for Launch (3s cast)."],
          d: "P 70 44 DPS behind rock (you)", db: ["Spread for Lots of Missiles.", "Below 20%: burn; Titan grapples players into the fire."] } ] },
    { name: "Thrasher", tr: "K 50 35 33 Raised sniper walkway|K 50 35 27 Round pit floor", sm: { t: "Hold Thrasher just to the side of the exit door; never leave melee range or he spams a raid AoE.", h: "Watch the snipers on the upper level.", d: "Fast fight: watch the Fire Bug positioning and snipers." }, ar: "c", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlSV", "dSVn"],
      sorc: "Ranged on the ground kills snipers once their Portable Cover is stripped by someone in the ring.",
      nim: ["Merlyn MM: Demolitionist at a random wall section; very high sniper damage; double sniper wave after 50%."],
      ph: [
        { n: "Arena + sniper ring", c: "B 50 35 Thrasher|Z 50 35 32 Elevated ring (snipers)|A 50 4 Sniper wave|A 70 6 Demolitionist|O 10 60 Gate",
          t: "P 50 30 Tank|> 50 30 50 6 Roar knock-up into the ring, AoE-taunt snipers", tb: ["Stand in front so Roar punts you (and a few others) up into the ring.", "Turrets spawn if a sniper wave isn't killed before the next one: wipe."],
          h: "P 46 40 Healer (1 goes up)", hb: ["One healer goes up with the ring team; the rest stay down."],
          d: "P 54 40 DPS (you)|> 22 56 14 60 Firebug: drop near the gates", db: ["Demolitionist red reticle: move as soon as Loading ends.", "Drop firebugs near the gates, not under the sniper spots."] } ] },
    { name: "Operations Chief", tr: "F 2 2 96 66 Oasis City / Operations Center", sm: { t: "Lead the group through Oasis City without tripping patrols.", h: "Same.", d: "Clear the 4 color teams within 10 minutes (Story timer); the Chief himself is a pushover." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM + 7.0 notes", src: ["mlSV", "dSVn", "p70"],
      flag: ["7.0: you can no longer hide (line-of-sight) from Terminate, so use defensives instead."],
      sorc: "Dulfy: Mass Explosive Probe can't be cleansed by Sorcerers; spread instead.",
      nim: ["Merlyn MM: 3-minute timer through Oasis City (6 min in VM); much heavier damage."],
      ph: [
        { n: "Oasis City + Chief", c: "B 50 14 Operations Chief|A 20 40 Colour group|A 80 40 Colour group|A 50 60 Colour group",
          t: "P 50 20 Tank", tb: ["Terminate: big defensive (no more LoS trick)."],
          h: "P 44 30 Healers", hb: ["Spread for grenades and probes."],
          d: "P 20 34 DPS pair on a colour group", db: ["VM: max 2 players per colour group (8m) or the raid wipes.", "Move fast: the timer is 6 min in VM."] } ] },
    { name: "Olok the Shadow", tr: "F 2 22 96 46 Show floor (below)|F 2 2 96 18 Upstairs start area", sm: { t: "Tank Olok and the purchased-droid fights; he stealths often.", h: "Same as Veteran.", d: "Agree how to spend tokens before the fight; then droid waves on the show floor." }, ar: "r", conf: "Checked against Merlyn (VM+MM) + Dulfy NiM", src: ["mlSV", "dSVn"],
      sorc: "Spread your DoTs on add waves; tokens expire in 15s in VM, so grab them on call.",
      nim: ["Merlyn MM: purchased droids are hostile; Arms Trader and Shady Customer can't be CC'd. Leave a melee droid for the last token round."],
      ph: [
        { n: "Tokens, droids, then traders", c: "B 50 12 Olok (upstairs)|O 50 34 Droid vendor|A 25 50 Assault droid|A 75 50 Frontline droid",
          t: "P 30 50 Tank", tb: ["Tank the add waves on the showroom floor."], h: "P 50 56 Healers", hb: ["Phase 3: two traders; no CC in MM."],
          d: "P 60 48 DPS (you)", db: ["VM: tokens expire after 15s; Package Deal stacks from too many Assault/Frontline droids at once."] } ] },
    { name: "Cartel Warlords", tr: "F 2 2 96 66 Warlords' arena", sm: { t: "Two tanks (or tank + DPS) kite Tu'chuk and Sunder around the room.", h: "Same as Veteran.", d: "Burn one Warlord at a time: Horic → Vilus Garr → Sunder → Tu'chuk (Horic/Vilus can swap)." }, ar: "r", conf: "Checked against Merlyn + Dulfy NiM; burn order disputed", src: ["mlSV", "dSVn"],
      flag: ["Burn order: Merlyn's usual order is Horic → Vilus Garr → … ; Dulfy's NiM strat is Horic → Tu'chuk, then Sunder + Garr killed at exactly the same time. Use your raid lead's call."],
      sorc: "Horic's Spray and Pray targets a player before firing; Force Speed out of the cone early.",
      nim: ["Dulfy NiM: Horic's Corrosive Grenade DoT (stun-breakers clear it); Tu'chuk strips the tank's armor (cleanse every time); the last two must die together or the survivor heals to full.", DULFY_OLD],
      ph: [
        { n: "Four bosses at once", c: "B 30 25 Captain Horic|B 70 25 Tu'chuk|B 30 52 Sunder (fixate)|B 70 52 Vilus Garr",
          t: "P 66 22 Tank: Tu'chuk|P 26 56 Tank: kite Sunder|> 26 56 10 40 own half of the room", tb: ["Tanks kite Tu'chuk and Sunder in their own halves of the room."],
          h: "P 50 40 Healers", hb: ["Assign a cleanse healer for the armor debuff and grenade DoTs."],
          d: "P 36 32 DPS (you)", db: ["Spray and Pray: the targeted player and everyone else leave the wide cone.", "Follow the called burn order."] } ] },
    { name: "Dread Master Styrak", tr: "K 50 35 33 Throne arena", sm: { t: "One tank is enough in Story.", h: "Same phases, lower damage.", d: "There is still a DPS check on Chained Manifestation and the final burn." }, ar: "c", conf: "All phases checked against Merlyn + Dulfy (HM + NiM); MM also Admiral Nick", src: ["mlSV", "dSVn", "anStyrak"],
      sorc: "This fight is about knockbacks (Dulfy). Keep Overload/Force Wave for the Chained Manifestations, which you must knock back in MM. Force Speed to your Lightning Manifestation.",
      nim: ["Dulfy NiM: a third Kell Dragon add leaps and knocks back (spread). The dragon punts the tank before Spines: taunt back at once. Line up behind the tanks for Spines.", "Admiral Nick (NiM): Chained Manifestations move much faster. Knock the small ones back to buy time to kill the big ghost.", "Admiral Nick / Dulfy NiM: Lightning Manifestations spawn in random spots, not fixed ones.", "Dulfy NiM: Chained Manifestation repeats 5–7 times; one resist can wipe. P3 dragon: swap tanks often; for giant Styrak everyone puts their back to the entrance wall (Force Push + Saber Throw).", DULFY_OLD, AN_NOTE],
      ph: [
        { n: "Opener + P1 Kell Dragon", c: "B 50 22 Kell Dragon|A 20 40 Buff add: kill first|A 80 40 Choke add (ghost Styrak)|Z 50 22 9 Spines (cone)|Z 82 58 5 Acid Spit (edge)",
          t: "P 50 28 Tank 1|P 56 30 Tank 2", tb: ["Opener: pull each Dread Guard wave from range; kill the Officer first.", "Drop Acid Spit at the edge by the pond.", "The ghost chokes the tank: the other tank (or a DPS) holds the dragon."],
          h: "P 50 52 Healers in line", hb: ["Spines (15s): line up behind the tanks; whoever is hit shields those behind."],
          d: "P 46 50 DPS in line (you)", db: ["Kill the ghost that chokes the tank right away.", "Kill the buffing add ASAP (NiM)."] },
        { n: "P2 Styrak: Blast, Pull, Nightmare", c: "B 50 30 Styrak (faces throne)|O 50 3 Throne|Z 50 16 9 Thundering Blast|Z 84 60 7 Water (Force Pull lands here)|Z 30 50 4 Nightmare purple circle",
          t: "P 50 24 Tank: face Styrak at the throne|> 82 58 52 26 out of the water, back fast", tb: ["Force Pull throws you across the room. Get out of the water and back, or let the other tank taunt before the next Thundering Blast."],
          h: "P 44 52 Healers (entrance side)", hb: ["Heal the player pulled into the Nightmare when they return; they leave a slow purple circle."],
          d: "P 56 52 You (entrance side)", db: ["Spread for the explosion at the end of Force Storm.", "Nightmare: kill your companion to return."] },
        { n: "P2 Chained Manifestation", c: "Z 50 35 30 Lightning cage (shrinks)|B 50 35 Big Manifestation|A 22 14 Small|A 78 14 Small|A 22 56 Small|A 78 56 Small",
          t: "P 53 38 Tank: stack under", tb: ["Styrak vanishes. DPS the big ghost from the stack."],
          h: "P 47 38 Healers: stack under", hb: ["Everyone stays tight under the big one."],
          d: "P 50 41 You: stack and burn the big one|> 50 41 26 18 MM: knock a small one back", db: ["Touching the lightning kills you.", "MM: assigned players knock back the small ghosts (rotation)."] },
        { n: "P2 Lightning Manifestations", c: "B 50 30 Styrak (returns)|A 14 35 Lightning Manifestation|A 86 35 Lightning Manifestation|A 50 6 Lightning Manifestation|A 50 64 Lightning Manifestation",
          t: "P 50 34 Tank: pull Styrak to the center|> 50 34 50 26 turn him out", tb: ["He casts Thundering Blast soon after returning: face him away fast."],
          h: "P 44 46 Healers", hb: ["Easier phase; top everyone up."],
          d: "> 50 42 16 36 run to your Manifestation|P 16 36 You: stay in contact", db: ["Kill all 4 (VM: a player must reach and stay on each).", "Then repeat: Force Storm, Chained, Lightning, until ~12–15%."] },
        { n: "P3 Kell Dragon, then giant Styrak", c: "B 50 30 Reanimated Kell Dragon (+150% dmg taken)|B 50 12 Styrak (immune, then giant)|O 50 67 Entrance wall",
          t: "P 50 36 Tank: Kell Dragon|> 50 36 50 60 then hold Styrak by the wall", tb: ["Shredding Claws stacks every 2s. Swap (or a DwT taunts briefly) at 10–15 stacks; it lasts 5s.", "Giant Styrak switches targets often: taunt back."],
          h: "P 44 62 Healers: backs to entrance wall", hb: ["Power of the Master makes the dragon's AoE huge: heavy AoE healing."],
          d: "P 56 62 You: back to the entrance wall", db: ["Kill the dragon fast; Styrak heals to ~15%.", "Back to the wall so Saber Throw/Force Charge can't punt you."] } ] },
  ] },
  { id: "tos", name: "Temple of Sacrifice", modes: "Story / Veteran", md: ["s", "v"], bosses: [
    { name: "Malaphar the Savage", mp: { a: "asset:map-tos.jpg", f: [0], n: 7, cr: "Merlyn's SWTOR Guides, Temple of Sacrifice area maps" }, sm: { t: "Very easy in Story (Merlyn).", h: "Healers aren't affected by Exhaustion: stay outside the circle.", d: "Inside the circle you get Savagery (more damage dealt and taken); step out at about 5–10 stacks until it flips to Exhaustion, then go back in." }, ar: "c", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlToS", "dTosMal"], flag: ["Room-map placement: Malaphar's circle is approximate."],
      sorc: "DPS: Savagery boosts your damage, so stay in until about 10 stacks, then walk out and come back. Healer: Revivification on the melee clump inside the circle.",
      nim: [NO_MM_RT, "VM (Dulfy HM): no new mechanics, but each Savagery stack hurts much more. Step out at about 10 stacks (depends on your healers). Tanks swap when adds arrive."],
      ph: [
        { n: "Savagery circle and adds", c: "B 50 35 Malaphar|Z 50 35 12.7 Savagery circle|A 22.7 14.1 Adds (30s, then every 50s)|Z 73.7 53.9 4.5 Spear Toss",
          t: "P 50 29 Tank 1|P 26.4 18.1 Tank 2: take adds, then swap", tb: ["Malaphar follows the tank with aggro, so the circle moves with him.", "Swap when the adds spawn so the old tank can leave the circle and reset stacks."],
          h: "P 50 57.9 Healer (outside or low stacks)", hb: ["Hammer Smash AoE every ~5s scales with Savagery stacks. Watch people above 10 stacks.", "Spike-heal the Spear Toss target."],
          d: "P 55.5 40 DPS inside (you)|> 55.5 40 57.3 55.9 step out to reset at ~10", db: ["Stay inside for Savagery (more damage dealt AND taken).", "Step outside until stacks flip to Exhaustion, then go back in.", "Spear Toss on you: drag the red AoE onto the adds."] } ] },
    { name: "Sword Squadron", mp: { a: "asset:map-tos.jpg", f: [1], n: 7, cr: "Merlyn's SWTOR Guides, Temple of Sacrifice area maps" }, sm: { t: "Needs at least one strong tank: often the hardest ToS boss in Story.", h: "One of the higher healing checks in Story.", d: "Kill Unit 1 and Unit 2 within 30s of each other; one player runs bombs to break Unit 1's shield every 60s (from 30s in)." }, ar: "r", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlToS", "dTosSword"],
      sorc: "Force Speed makes Sorc/Sage a good bomb runner. Keep a defensive for Huge Grenade and walk it to the shield door or the grass.",
      nim: [NO_MM_RT, "VM (Dulfy HM): Unit 1 pulls players in while its shield is up, and Gravity Missile is added. Otherwise the same fight with tighter numbers."],
      ph: [
        { n: "Unit 1 + bomb runs", c: "B 34.6 35 Unit 1|B 65.4 35 Unit 2 (untauntable)|O 80.8 6.9 Bombs (back right)|Z 33 51.5 3.9 Rapid Fire circles|R 34.6 2.1 30.8 5.8 Shield door",
          t: "P 29.9 36 Tank: Unit 1 (faces left)|> 29.9 36 28.4 49.5 keep moving off blue circles|P 68.5 39.9 Tank: Unit 2 (opens the pull)", tb: ["The Unit 2 tank opens: Unit 2 can't be taunted, so all DPS start on Unit 1.", "Unit 1 tank faces Mega Blast left, away from the middle, and keeps moving out of Rapid Fire circles.", "Unit 2 sometimes hits the Unit 1 tank. Call it out."],
          h: "P 50 51.5 Healers", hb: ["Rain of Missiles every 20s is raid-wide; red Ground Burst circles every 8–10s.", "Heavy healing on whichever tank Unit 2 targets."],
          d: "P 42.3 41.8 DPS on Unit 1 (you)|> 80.8 6.9 37.6 32.1 bomb runner: bomb to Unit 1", db: ["Stay on Unit 1 until 10–15%, then swap to Unit 2.", "Kill the Targeting Droid (spawns under Unit 1 every 50s) at once.", "Huge Grenade on you: walk it to the shield door or into the grass."] },
        { n: "Finish both within 30s", c: "B 34.6 35 Unit 1 (~10%)|B 65.4 35 Unit 2 (~10%)|A 50 20.5 Rolling Mines",
          t: "P 29.9 36 Tank 1|P 68.5 39.9 Tank 2", tb: ["Rolling Mines (pairs, every 45s): taunt them if you can."],
          h: "P 50 51.5 Healers", hb: ["Use cooldowns for the final push."],
          d: "P 39.2 39.9 You|> 39.2 39.9 60.8 37.9 swap on call", db: ["Both walkers must die within 30s of each other or they enrage.", "If in doubt, run a bomb and kill Unit 1 first, then Unit 2."] } ] },
    { name: "The Underlurker", mp: { a: "asset:map-tos.jpg", f: [2], n: 7, cr: "Merlyn's SWTOR Guides, Temple of Sacrifice area maps" }, sm: { t: "The boss hits the tank lightly; easy to move.", h: "Same 50s cycle as Veteran.", d: "50s cycle up to 5 times before enrage: kill adds fast, then hide behind rocks." }, ar: "c", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlToS", "dTosUnder"], flag: ["Room-map placement: exact floor vs pit edges approximate."],
      sorc: "Force Speed gets you behind a rock as Collapse ends. Merlyn notes strong AoE defensives can survive Rage Storm in the open, so Force Barrier is your emergency option. Devastation: stand at 0m.",
      nim: [NO_MM_RT, "VM (Dulfy HM): Lurkerlings have ~109k HP each and spam Jump Smash; Rage Storm kills anyone not behind a rock; tighter enrage. Ranged take the far adds, melee the near ones."],
      ph: [
        { n: "Lurkerlings, then rocks", c: "B 50 35 Underlurker|A 21.3 16.1 Lurkerling|A 50 5.1 Lurkerling|A 78.7 16.1 Lurkerling|Z 32 52 4.5 Collapse rock (red)|O 32 52 Rock: hide behind",
          t: "P 50 25 Tank: park him near the adds|> 50 25 35.6 57.9 behind a rock", tb: ["Hurl is a 2.1s rock throw on the tank. Low threat otherwise.", "Park him on or next to the adds so cleave and DoT spread hit them."],
          h: "P 35.6 57.9 Healer behind the rock|> 50 48 35.6 57.9", hb: ["Everyone behind the same rock if possible, for AoE heals.", "Rage Storm is a 7s channel right after Collapse."],
          d: "P 24.9 18.1 You: your assigned add|> 24.9 18.1 35.6 57.9 behind rock for Rage Storm", db: ["Adds spawn 15s in, then every 50s, along the wall. Kill them before Rage Storm.", "Don't stand in red circles (rock = instant death)."] },
        { n: "Devastation cross", c: "B 50 35 Underlurker|R 46.4 12.1 7.2 45.9 Cross: narrow arms|R 28.5 31 43.1 8 Cross: wide arms",
          t: "P 50 34 Tank at 0m", tb: ["After Rage Storm he leaps to a player and sets the cross."],
          h: "P 50.9 36 Healer at 0m", hb: ["Merlyn: everyone runs to 0.0m from him to pass."],
          d: "P 49.1 36 You at 0m", db: ["Hug the boss; keep DPSing. ~5s later the next add wave starts."] } ] },
    { name: "Revanite Commanders", mp: { a: "asset:map-tos.jpg", f: [3], n: 7, cr: "Merlyn's SWTOR Guides, Temple of Sacrifice area maps" }, sm: { t: "Fight each of the three bosses in turn; they jump out at about a third of their health.", h: "Coordination matters more than damage.", d: "Each boss is fought twice, then all three together." }, ar: "r", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlToS", "dTosCmd"], flag: ["Room-map placement: doors labelled generically; which door is left/centre/right is unconfirmed."],
      sorc: "Adds ignore interrupts: use Overload/Force Wave and Electrocute/Force Stun on Outlaws (Saturation Fire) and Mandalorians (Death From Above).",
      nim: [NO_MM_RT, "VM (Dulfy HM): almost the same as SM but much more DPS needed; Saturation Fire ~10k/tick with infinite range; Death From Above stacks when several Mandos target one spot."],
      ph: [
        { n: "Single Commander + adds", c: "B 50 38 Commander|O 50 63 Door|O 6 33 Door|O 50 5 Door|Z 50 38 9 Sano reflect field|A 72 17 Outlaws",
          t: "P 50 43.7 Tank: Commander|P 68.6 18.6 Off-tank: AoE-taunt adds", tb: ["Sano's Disrespectful Kick drops your threat: taunt back.", "Deron has a random aggro table; he only stays on you for the 6s taunt."],
          h: "P 45.7 49.5 Healer", hb: ["Deron's Guided Missile Volley scales with each player's Heat Signature stacks."],
          d: "P 52.9 39.9 You (inside Sano's field)|> 52.9 39.9 67.2 22.4 CC Outlaw casts", db: ["Stand inside Sano's field or 25% of your damage reflects.", "Outlaws: Saturation Fire reaches much further than its telegraph."] },
        { n: "Burn phase: all three", c: "B 29.9 37.9 Kurse (kill last)|B 50 30.2 Deron|B 70.1 37.9 Sano|A 50 59.2 Adds keep coming",
          t: "P 29.9 43.7 Tank: Kurse|P 70.1 43.7 Tank: Sano", tb: ["Tanks split to hold the two not being burned."],
          h: "P 50 51.5 Healers", hb: ["Adds love healers: call for help early."],
          d: "P 52.9 36 You: kill order (Sano/Deron, Kurse last)|P 42.8 57.3 1 DPS on adds full time", db: ["Merlyn: one DPS (two in 16m) on adds full time.", "Once the first boss dies it gets easier."] } ] },
    { name: "Revan", mp: { a: "asset:map-tos.jpg", f: [4, 5, 6], n: 7, cr: "Merlyn's SWTOR Guides, Temple of Sacrifice area maps" }, sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Same as Veteran." }, ar: "c", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlToS", "dTosRevan"],
      sorc: "Your knockbacks push the floating lightsabers (Blade of Alek/Revan) off the edge. Don't Phase Walk or teleport near the Core: Merlyn warns teleports can kill you.",
      nim: [NO_MM_RT, "VM (Dulfy HM): seven phases; many new mechanics and much more coordination. Unstable Aberrations expire in a set sequence, which matters a lot in VM."],
      ph: [
        { n: "Floor 1: Revan, then HK-47", c: "B 50 30 Revan / HK-47|Z 50 15 6 Impale cone|O 50 4 Rock pillar|A 18 46 Blade of Alek|A 80 46 Blade of Revan",
          t: "P 50 24 Tank: aim Impale at a pillar", tb: ["Impale is a long narrow knockback: aim it so you hit a pillar, not the void.", "HK-47 (after 64%): face Pseudorandom Violence away."],
          h: "P 38 50 Healer (spread for grenades)", hb: ["HK's Handful of Grenades: everyone spreads; heal through the 6s bombs.", "At 75% HK raises an Invulnerability Field: everyone must stand inside to damage him."],
          d: "P 62 50 You (spread)|> 18 46 12 51 knock blade off edge", db: ["Kite the blade following you to the edge and knock it off.", "Grenade on you: spread, don't overlap."] },
        { n: "Floor 2: Foci, then Revan", c: "B 50 35 Revan|O 37 10 Machine Focus|O 63 10 Machine Focus|O 37 60 Machine Focus|O 63 60 Machine Focus|Z 33 35 5 Force Aberration",
          t: "P 57.2 40 Tank|> 57.2 40 64.4 36 step around purple", tb: ["Kill all 4 Foci first. Then tank Revan in place on a side and dodge the circling purple Aberrations."],
          h: "P 47.1 52 Healer", hb: ["Foci pulse Essence Shear that grows over time."],
          d: "P 38 13 You: a Focus|> 38 13 50 48 back to Revan", db: ["Purple circles orbit the platform: step in or out."] },
        { n: "Floor 3: shield, Revan, Core burn", c: "B 50 35 Machine Core|Z 50 35 9 Charged Barrier: stand inside|Z 60 20 4 Unstable Aberration",
          t: "P 47.7 37 Tank inside", tb: ["Break Revan's Resonance shield, push him to 9%, then the Core."],
          h: "P 50 40 Healer inside", hb: ["Essence Shear lowers max HP 1%/stack: this is a DPS race."],
          d: "P 52.3 37 You inside (5m)", db: ["Outside the white circle your attacks reflect.", "Don't leap to the Core; you land outside the circle."] } ] },
  ] },
  { id: "rav", name: "The Ravagers", modes: "Story / Veteran", md: ["s", "v"], bosses: [
    { name: "Sparky", mp: { a: "asset:map-rav.jpg", f: [0], n: 6, cr: "Merlyn's SWTOR Guides, Ravagers area maps" }, sm: { t: "Merlyn: a super easy fight in Story; just handle the tank movement.", h: "Light healing.", d: "Kill adds as needed; most mechanics only matter in harder modes." }, ar: "r", conf: "Checked against Merlyn + Grophets + Dulfy HM (Zorz)", src: ["mlRav", "grSparky", "dRavSparky"], flag: ["Room-map placement: the room (tapcaf) is inferred from guides."],
      sorc: "Overload/Force Wave helps the off-tank keep adds off the group. Below 30%, ignore adds and burn.",
      nim: [NO_MM_RT, "VM (Grophets): keep adds away from Sparky, because she buffs adds inside her circle. Break the Shield Collar fast; it's an early DPS check."],
      ph: [
        { n: "Tank the throws, kill adds", c: "B 50 20 Sparky|O 50 12 Wall|A 25 50 Adds (doors)|A 75 50 Adds (doors)",
          t: "P 50 15 Tank: alternate facing toward/away from wall|P 29 46 Off-tank: grab adds by proximity", tb: ["Shoulder Throw (through the boss) and Body Slam (knockback) alternate. Turn so each one throws you into the wall.", "Off-tank: adds aggro by proximity and leap if taunted. AoE taunt more than ~3 only with a defensive."],
          h: "P 47.4 34 Healers close to Sparky", hb: ["Stay grouped near Sparky so adds go to the off-tank, not you.", "Rampage stuns random players. Heal through."],
          d: "P 52.7 34 You (near Sparky)|> 52.7 34 31.5 49.5 swap to adds on call", db: ["Break Brutalize (a channel on the tank) with damage.", "Assigned DPS (or all) kill adds as they spawn."] },
        { n: "Below 30%: burn", c: "B 50 20 Sparky|A 25 50 Endless adds|A 75 50 Endless adds",
          t: "P 50 15 Tank|> 30 46 30 56 off-tank kites adds", tb: ["Adds come faster and never stop; off-tank kites them."],
          h: "P 47.4 34 Healers", hb: ["Cooldowns for the final push."],
          d: "P 52.7 30.2 You: Sparky only", db: ["Ignore adds; everything on Sparky."] } ] },
    { name: "Quartermaster Bulo", mp: { a: "asset:map-rav.jpg", f: [1], n: 6, cr: "Merlyn's SWTOR Guides, Ravagers area maps" }, sm: { t: "Face Bulo toward the doors.", h: "Stay behind Bulo.", d: "Stay behind Bulo; Burst Volley still kills." }, ar: "r", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlRav", "dRavBulo"], flag: ["Room-map placement: the fight spot on the Dockside landing pad is inferred."],
      sorc: "Burst Volley follows you for ~3s then locks: Force Speed to the back wall before it drops. Drop Mass Barrage circles on the adds.",
      nim: [NO_MM_RT, "VM (Dulfy HM): same mechanics with much higher damage. Scatter Blaster and Burst Volley are the usual wipes."],
      ph: [
        { n: "Face Bulo at the doors", c: "B 20 30 Bulo|Z 26 30 5 Scatter Blaster cone|O 33 28 Add doors|O 6 30 Back wall (docks)|Z 12 44 3.5 Burst Volley drop",
          t: "P 24 27 Tank 1|P 24 33 Tank 2 (don't stack)", tb: ["Both tanks face Bulo toward the doors, away from the group.", "Cross-taunt often: Scatter Blaster alternates between the top two on threat."],
          h: "P 9 22 Healer (max range, back wall)", hb: ["Burst Volley picks a player outside melee: usually you. Drop it at the back wall."],
          d: "P 9 38 Ranged (you, back wall)|P 18 30 Melee: stack on Bulo", db: ["Drop threat. A DPS in the top two gets the group cleaved.", "Burst Volley: walk it to the back wall. Never drop it in the middle or on Bulo."] },
        { n: "Mass Barrage + adds", c: "B 20 30 Bulo|A 30 18 Adds (door nearest aggro)|Z 12 40 3 Barrage (stack x2)|Z 12 44 3.5 Burst Volley",
          t: "P 28 19 Off-tank: AoE-taunt adds|> 28 19 14 42 drag into Burst Volley", tb: ["Adds come from the door nearest the player with aggro and head for healers."],
          h: "P 9 22 Healer|> 9 26 11 40 kite adds into Volley", hb: ["If you pick up adds, kite them into the Burst Volley circle."],
          d: "P 9 37 You|> 9 35 12 39 drop Barrage on adds", db: ["Mass Barrage: 5 circles each; stack them two at a time, ideally on the adds.", "Load Lifters roll to a player and explode: spread briefly."] } ] },
    { name: "Chief Engineer Torque", mp: { a: "asset:map-rav.jpg", f: [2], n: 6, cr: "Merlyn's SWTOR Guides, Ravagers area maps" }, sm: { t: "Disrespectful Kick knocks you back and applies Sick of You: don't put your back to a wall; swap.", h: "Story stuns don't hurt, but cleanse them because of the fire.", d: "Race to kill Torque or repair consoles before he crashes the carrier." }, ar: "r", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlRav", "dRavTorque"], flag: ["Room-map placement: console positions are approximate."],
      sorc: "Ranged job: kill Incendiary Fire Devices from range. Keep your stun break for Magnetic Clamp + fire.",
      nim: [NO_MM_RT, "VM (Dulfy HM): assign a fixed clicking order (four people is enough) for Fix-It droids; save stun breaks for Clamp + fire/vents; melee watch Floor Vents."],
      ph: [
        { n: "Consoles, droids, fire", c: "B 56 33 Torque|O 35 27 Console|O 75 27 Console|O 35 39 Console|O 75 39 Console|O 38 12 Fix-It panel (back room)|A 44 35 Shoots Lasers|A 64 28 Fire Device",
          t: "P 56 37 Tank 1 (no wall behind)|P 60 37 Tank 2: swap on Sick of You", tb: ["Disrespectful Kick knocks you back and applies Sick of You: swap right away.", "Keep space behind you so the kick doesn't pin you to a wall."],
          h: "P 56 48 Healers (door side)", hb: ["Cleanse Magnetic Clamp stuns, especially on anyone in fire.", "Healers can DPS until the first Wookiee Rage (~45s)."],
          d: "P 46 38 You: kill Shoots Lasers|P 68 30 Ranged: kill Fire Devices|> 50 12 41 12 clicker spawns Fix-It", db: ["Shoots Lasers target the repair droids: kill them, or body-block the cone.", "Step out of fire under your feet at once."] } ] },
    { name: "Master & Blaster", mp: { a: "asset:map-rav.jpg", f: [3], n: 6, cr: "Merlyn's SWTOR Guides, Ravagers area maps" }, sm: { t: "Phase 2 hits both tanks hard: Merlyn rates it the toughest Ravagers fight in Story.", h: "Phase 2 has a LOT of group damage.", d: "Positioning and movement are punishing even in Story." }, ar: "c", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlRav", "dRavMB"], flag: ["Room-map placement: the guides disagree on where the fight sits (Bridge vs Weather Deck); positions approximate."],
      sorc: "Merlyn: a Sage/Sorcerer can take all 20 Overpowered Ion Cutter stacks with Force Barrier while the Master tank hides behind you. This is the best Sorc job in the op. In P3, Force Barrier or a back-to-wall stance stops the 9% knockback killing you.",
      nim: [NO_MM_RT, "VM (Merlyn/Dulfy): more Resonant Explosive Probes (6 in 8m, 8 in 16m), heavier damage across the board."],
      ph: [
        { n: "P1 Blaster (100–54%)", c: "B 50 20.1 Blaster|Z 50 9.1 7.3 Ultra Scatterblast cone|Z 29.9 46 4.6 Mortar|Z 70.1 46 4.6 Mortar",
          t: "P 50 14.1 Tank: Blaster faces the wall", tb: ["Scatterblast knocks back ~40m: keep it pointed at one side."],
          h: "P 42.7 53.9 Healer (spread)", hb: ["Blue probes: spread so no two meet (early detonation)."],
          d: "P 59.2 53.9 You (opposite side, spread)", db: ["Stay out of the cone side; dodge orange Mortars."] },
        { n: "P2 Master + Blaster", c: "B 31.7 26 Blaster|B 68.3 26 Master|Z 68.3 26 8.2 Fire Wheel|Z 50 55.9 3.7 Probe",
          t: "P 31.7 20.1 Blaster tank|P 72 20.1 Master tank: share Ion Cutter", tb: ["Master: don't take more than ~10 Ion Cutter stacks; let a soaker step in front.", "Rain of Pain (red floor) twice: move out."],
          h: "P 50 52 Healer", hb: ["Highest damage of the fight: both tanks plus the group."],
          d: "P 61 42 Ranged (you) on Master|P 37.2 32 Melee on Blaster|> 61 42 68.3 30 soak Ion Cutter if called", db: ["Ranged on Master, melee on Blaster (Blaster shields at ~25%)."] },
        { n: "P3 stack under Blaster", c: "B 45 36 Blaster|B 68 30 Master|Z 45 36 31 9%: knockback circle",
          t: "P 71 27 Master tank: face it away", tb: ["Hold Master just outside the group, Ion Pulse Wave away."],
          h: "P 44.5 41 Healers stacked", hb: ["Stack for AoE heals; probe holders join after their probe pops."],
          d: "P 48.2 40 You stacked|> 48.2 40 50 5.1 at 9%: get out, back to wall", db: ["Kill Master to 9%, then Blaster to 9%.", "At 9% the red circle knocks you back: aim at a wall or use a knockback immunity."] } ] },
    { name: "Coratanni, Pearl and Ruugar", mp: { a: "asset:map-rav.jpg", f: [4, 5], n: 6, cr: "Merlyn's SWTOR Guides, Ravagers area maps" }, sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Same as Veteran." }, ar: "r", conf: "Checked against Merlyn + Dulfy HM (Zorz)", src: ["mlRav", "dRavCora"],
      sorc: "Ricochet Shot (VM): count your Double Down stacks: a second one kills you. Self-cleanse helps with Flame Grenade but still use the blue circle when called.",
      nim: [NO_MM_RT, "VM (Dulfy HM): Ricochet Shot gives Double Down and passes it to the nearest player twice (4s apart). A second Double Down kills you. Tight Ruugar enrage."],
      ph: [
        { n: "Coratanni & Pearl", c: "B 35.1 30.2 Coratanni|B 63.6 37.9 Pearl (roams)|O 50 65 Fire-suppression panel|Z 43.2 55.3 3.4 Blue cleanse circle|R 66.3 5 16.3 23.2 Deck Guns (worse on the right)",
          t: "P 35.1 24.4 Tank: Cora (cone away)|P 63.6 45.7 Tank: Pearl (taunt back)", tb: ["Pearl turns untauntable briefly and attacks others: taunt back the moment you can.", "Keep Pearl's Trauma cone off the raid."],
          h: "P 32.3 49.5 Healers (left side)", hb: ["Flame Grenade on everyone every ~30s: cleanse in the blue circles (a different player clicks each time).", "Pearl pins her target and pecks it: heal through."],
          d: "P 28.3 39.9 You (left side)|> 28.3 39.9 41.8 53.4 cleanse in blue circle", db: ["Kill Cora first (Pearl first makes Cora invulnerable). Many groups take Pearl to 25–30% first.", "Yellow Deck Gun circles: get out at once."] },
        { n: "Ruugar (after the escape pod)", c: "B 68 35 Ruugar|Z 56 28 4 Land mine|Z 76 50 4 Land mine|Z 78 21 4 Grenade AoE",
          t: "P 68 29 Tank 1|P 74 30 Tank 2: swap on Corrosive Dart stacks", tb: ["Swap before Cull (~every 20s) hits a stacked tank.", "Either eat the mines in melee or kite in a pattern."],
          h: "P 60 46 Healer", hb: ["Cleanse Flame/Corrosive Grenades fast."],
          d: "P 70 45 You", db: ["Don't walk into armed mines.", "VM enrage is tight: go all out."] } ] },
  ] },
  { id: "ev", name: "Eternity Vault", modes: "Story / Veteran", md: ["s", "v"], bosses: [
    { name: "Annihilation Droid XRR-3", mp: { a: "asset:map-ev.jpg", f: [0], n: 5, cr: "Merlyn's SWTOR Guides, Eternity Vault area maps" }, sm: { t: "Face it toward the door, away from the group; run back in and re-taunt after punts.", h: "Stay at range; everyone runs under the boss for Missile Salvo.", d: "Range 20m+; run under it for Missile Salvo; dodge red circles below 50%." }, ar: "r", conf: "Checked against Merlyn (boss page) + Grophets", src: ["mlXRR", "grXRR", "vkNoNim"],
      sorc: "Stay 20m+ so Shockwave can't stun you. Bubble the group before Missile Salvo; save Force Barrier for the 10% soft enrage if needed.",
      nim: [NO_MM_EVKP, "VM (Grophets): same mechanics as SM; only health, damage and the DPS check change. Cannonade + Lock On on the same player can nearly one-shot them."],
      ph: [
        { n: "Face it at the door", c: "B 47 32 XRR-3|O 47 39 Vault door|O 38.5 33 Column|O 55 33 Column|Z 25 22 2.3 Storm Protocol circle",
          t: "P 47 36 Tank (back to door, near a column)", tb: ["Face XRR-3 toward the entrance, ideally angled at a column.", "Overwhelming Strike punts you and drops threat: taunt at once."],
          h: "P 40 18 Healer (20m+)", hb: ["Stay 20m+ to avoid Shockwave and Swipe.", "Burst-heal Cannonade and Lock On targets."],
          d: "P 54 18 Ranged (you, 20m+)|P 47 28 Melee: behind", db: ["Stay 20m+ if ranged.", "Step out of red Storm Protocol circles."] },
        { n: "Missile Salvo + 10% burn", c: "B 47 32 XRR-3|Z 47 32 4.7 Stack under the boss|Z 22 24 2.3 Storm circle|Z 72 24 2.3 Storm circle",
          t: "P 47 35.5 Tank", tb: ["Join the stack for Missile Salvo, then face it back to the door."],
          h: "P 44 30 Healer (stacked)|> 40 18 44 29 run in", hb: ["Prepare bubbles/HoTs before Salvo; save cooldowns for the 10% soft enrage."],
          d: "P 50 30 You (stacked)|> 54 18 50 29 run in", db: ["Everyone stacks under it during Missile Salvo.", "At ~10% it's a soft enrage: stack and use defensives."] } ] },
    { name: "Gharj", rv: { a: "asset:room-ev.jpg", i: 0, n: 1, H: [2.066508, -0.472674, -71.820353, -0.059215, 0.209895, 14.68905, -0.001857, -0.0084, 1.0], cr: "Frame at 0:21 of \"SWTOR Eternity Vault Veteran Boss Fight - Gharj. Legacy of the Sith Expansion\", YaiiE, YouTube, May 17, 2022", href: "https://www.youtube.com/watch?v=35UFe_4PAk4&t=21s", how: "Gharj's Stomp ring on the start island; which way the island faces is a guess" }, mp: { a: "asset:map-ev.jpg", f: [1], n: 5, cr: "Merlyn's SWTOR Guides, Eternity Vault area maps" }, sm: { t: "Hold him at one end of the island.", h: "If you're knocked into lava, run back and heal.", d: "When he jumps, cross the steps to the next island before the platform collapses." }, ar: "c", conf: "Checked against Merlyn (boss page) + Grophets", src: ["mlGharj", "grGharj", "vkNoNim"], flag: ["Room-map placement: island positions follow Merlyn's layout image and are approximate."],
      sorc: "Force Speed through the steps between Frenzy stomps. Stay 15m+ so Leap doesn't catch you.",
      nim: [NO_MM_EVKP, "VM (Merlyn/Grophets): no new mechanics. Leap and Frenzy stomps hit non-tanks very hard; the usual wipe is people in melee during Frenzy."],
      ph: [
        { n: "On the island", c: "B 59 36 Gharj (start island)|Z 59 36 5 Stomp / Leap|O 49 22 Next island",
          t: "P 62 34 Tank: island edge, face away", tb: ["Pull Gharj to a corner and face him away (Rending Swipe).", "Pulverising Slam knocks people into lava: they move back."],
          h: "P 53 44 Healer (15m+)", hb: ["Burst after Leap.", "Heavier if your group is melee-heavy."],
          d: "P 52 40 Ranged (you, 15m+)|P 61 38.5 Melee: behind", db: ["Ranged and healers 15m+ away, other side of the island."] },
        { n: "Frenzy: move islands", c: "B 59 36 Gharj (Frenzy)|O 49 22 New island|Z 55 29 3.5 Steps (temporary)|A 50 25 Adds (<50%)",
          t: "> 61 34 50 23.5 follow to new island|P 50 23.5 Tank", tb: ["Follow to the new island and reposition. Below 50%, AoE-taunt the adds."],
          h: "> 54 43 47 25 time it between stomps|P 47 25 Healer", hb: ["Burst-heal after each Frenzy stomp."],
          d: "> 52 39 52 21 out of melee, then go|P 52 21 You", db: ["Get out of melee range when Frenzy starts.", "Kill adds blocking the path; time the run between stomps."] } ] },
    { name: "Ancient Pylons", mp: { a: "asset:map-ev.jpg", f: [2], n: 5, cr: "Merlyn's SWTOR Guides, Eternity Vault area maps" }, sm: { t: "Optional: hold adds near the pylons.", h: "Anyone can run a pylon; match rows bottom to top.", d: "Kill adds while the puzzle is solved." }, ar: "r", conf: "Checked against Merlyn (boss page)", src: ["mlPylons", "vkNoNim"],
      sorc: "Healer Sorc/Sage is a natural puzzle runner (light healing here). DPS: Jolt/Mind Snap the Watchers' reflect shield, or stop attacking that add while it's up.",
      nim: [NO_MM_EVKP, "VM (Merlyn): only one change: rotating the puzzle gives Pylon Ward (30s, can't use the controls), so rotate clickers."],
      ph: [
        { n: "Split North / South, solve", c: "O 57 15 North pylon controls|O 57 52 South pylon controls|A 40 35 Rakata Watchers|Z 33 33 2.5 Lava",
          t: "P 51 19 Tank (North team)|P 51 49 Tank (South team)", tb: ["One tank per side. Taunt big adds the moment they spawn."],
          h: "P 62 19 Healer: runs North puzzle|P 62 49 Healer 2: South", hb: ["Healing is light; you're usually the puzzle runner.", "VM: hand off to the next clicker while you have Pylon Ward."],
          d: "P 44 30 You: kill adds|> 44 30 41 34", db: ["Interrupt the Watchers' reflect and stun; don't kill yourself on the reflect.", "Stay on rocks; lava stacks keep ticking after you leave."] },
        { n: "Acklays (near the reset)", c: "O 57 15 North controls|O 57 52 South controls|A 45 24 Proto Acklay|A 50 45 Proto Acklay",
          t: "P 46 27 Tank: taunt the Acklay", tb: ["Acklay waves (1, then 2, then 3) mean the puzzle is about to reset."],
          h: "P 60 19 Healer", hb: ["Spike healing if an Acklay hits a DPS or healer."],
          d: "P 50 26 You: burn the Acklay", db: ["Kill fast, then back to the puzzle."] } ] },
    { name: "Infernal Council", mp: { a: "asset:map-ev.jpg", f: [3], n: 5, cr: "Merlyn's SWTOR Guides, Eternity Vault area maps" }, sm: { t: "1 v 1: no guards in Story.", h: "1 v 1: no AoE heals or raid buffs; respec if your duel is hard.", d: "1 v 1: hit only your own boss." }, ar: "r", conf: "Checked against Merlyn (boss page)", src: ["mlICouncil", "vkNoNim"],
      sorc: "Merlyn: no Wandering Mend/Roaming Mend, no AoE, no group buffs once it starts. A Sage/Sorc healer usually duels an Assassin: interrupt Rapid Attack (Mind Snap/Jolt).",
      nim: [NO_MM_EVKP, "VM (Merlyn): the Assassins' Rapid Attack hits harder. Same rules."],
      ph: [
        { n: "1v1 duels in corners", c: "B 28.7 14.7 Juggernaut|B 71.3 14.7 Marauder|B 28.7 55.3 Assassin|B 71.3 55.3 Marauder",
          t: "P 32.2 18.6 Tank: Juggernaut (corner)", tb: ["Juggernauts have less HP and hit softly. Just DPS him."],
          h: "P 32.2 51.5 Healer: Assassin", hb: ["Interrupt Rapid Attack or use a defensive; self-heal.", "No AoE or multi-target heals (Penalty of Destiny)."],
          d: "P 67.7 18.6 You: your Marauder", db: ["Fight only your own boss, tucked in a corner.", "No AoE, no guards, no raid buffs; Sentinels/Marauders: no Zen/Berserk heal.", "When yours dies you get ONE attack to help someone else."] } ] },
    { name: "Soa", mp: { a: "asset:map-ev.jpg", f: [4], n: 5, cr: "Merlyn's SWTOR Guides, Eternity Vault area maps" }, sm: { t: "Don't enter the room early: since 6.0 the fight starts on entry.", h: "Avoid green puddles; heal through the floor drops.", d: "Avoid green; burn Soa when the pyramid stuns him at the bottom." }, ar: "c", conf: "Checked against Merlyn (boss page)", src: ["mlSoa", "vkNoNim"],
      sorc: "Ball Lightning on you: step out, use a defensive, then run into it. Force Speed helps you get to the edge before the floor drops.",
      nim: [NO_MM_EVKP],
      ph: [
        { n: "Top floor (to 75%)", c: "B 50 35 Soa|Z 34 22 5 Green puddle (pylon)|Z 67 50 5 Green puddle|O 26 35 Edge (drop at 75%)",
          t: "P 50 29 Tank", tb: ["At 75% he shields: get to the outer platform within ~10s."],
          h: "P 40 48 Healer", hb: ["Light damage. Watch for puddles near the entrance pylons."],
          d: "P 60 46 You (avoid green)|> 60 46 75 38 to the edge at 75%", db: ["Don't stand in the green puddles."] },
        { n: "Middle floor (75–29%)", c: "B 50 35 Soa|O 30 26 Mind Trap|A 68 20 Ball Lightning|O 76 40 Pylon",
          t: "P 50 29 Tank", tb: ["Kill Mind Traps fast, especially if a tank or healer is inside."],
          h: "P 42 50 Healer", hb: ["Heal the Ball Lightning targets."],
          d: "P 33 28 You: kill Mind Trap|> 60 46 70 53 step out for Ball Lightning", db: ["ONE assigned player kills the pylons on the way down (removes Power Orb stacks)."] },
        { n: "Bottom floor: kite into the pyramid", c: "B 40 40 Soa (shielded)|Z 69.9 30 8 Final Hurl pyramid AoE|O 69.9 30 Pyramid",
          t: "> 40 40 66.9 32 kite Soa into the pyramid AoE|P 40 40 Tank", tb: ["Soa only becomes vulnerable when hit by his own pyramid (Recovering, 12s). Kite him precisely."],
          h: "P 30.1 55.9 Healer", hb: ["The cycle is ~35s. Keep the kiter alive."],
          d: "P 56 57.9 You: burn during Recovering", db: ["Save burst for the 12s window when he's stunned."] } ] },
  ] },
  { id: "kp", name: "Karagga's Palace", modes: "Story / Veteran", md: ["s", "v"], bosses: [
    { name: "Bonethrasher", tr: "K 50 35 33 Rancor pit", sm: { t: "Untauntable: tanks only hold the Manka Cats.", h: "Stay behind the rancor.", d: "Whoever has aggro faces it to the side; everyone else stays behind." }, ar: "c", conf: "Checked against Merlyn (SM + VM notes)", src: ["mlKP", "vkNoNim"],
      sorc: "Keep Overload/Force Wave off cooldown for the Manka Cats. If you get aggro, turn him to the agreed direction.",
      nim: [NO_MM_EVKP, "VM (Merlyn): no new mechanics. Cleaves and the Gamorrean buff are far more dangerous; pick a fixed direction for the boss to face."],
      ph: [
        { n: "Untauntable rancor", c: "B 50 32 Bonethrasher|Z 50 18 9 Swipe cone (front)|A 24 14 Gamorrean drops in|O 50 66 Edge: Backhand ~15m",
          t: "P 72 50 Tank: Manka Cats later|> 72 50 86 58", tb: ["He can't be taunted. Tanks hold the two Manka Cats midway through."],
          h: "P 44 48 Healer (behind)", hb: ["Pounded targets take more Swipe damage: they go behind him."],
          d: "P 56 48 You (behind)|P 50 22 If he targets you: face him north", db: ["Kill the Gamorrean at once, or he eats it and gets a big buff.", "Keep away from the edge (Backhand)."] } ] },
    { name: "Jarg & Sorno", tr: "F 2 2 96 66 Mercenary chamber|F 30 1 40 9 Awning", sm: { t: "Tank both; DPS them evenly.", h: "Cleanse Jarg's fire DoT.", d: "Interrupt Sorno; kill both close together." }, ar: "r", conf: "Checked against Merlyn (SM + VM notes)", src: ["mlKP", "vkNoNim"],
      sorc: "You're a good Sorno interrupter: Jolt/Mind Snap on Unload and Rapid Scan if melee are short.",
      nim: [NO_MM_EVKP, "VM (Merlyn): no new mechanics. Interrupts and killing the Carbonizer Probe matter much more."],
      ph: [
        { n: "Both bosses, interrupts", c: "B 35 35 Jarg|B 65 35 Sorno|Z 35 24 7 Flamethrower",
          t: "P 35 42 Tank: Jarg|P 65 42 Tank 2: Sorno", tb: ["Jarg pulls random players in; take him back."],
          h: "P 50 58 Healer", hb: ["Cleanse Jarg's fire DoT."],
          d: "P 60 50 You: interrupt Unload / Rapid Scan|P 46 50 Balance their HP", db: ["Unload stacks a damage-taken debuff; Rapid Scan heals Jarg 3%. Interrupt both.", "Kill them at about the same time."] },
        { n: "Sorno on the awning", c: "B 45 36 Jarg (switches target)|B 50 5 Sorno (awning)|A 28 42 Carbonizer Probe|Z 72 52 4 Purple missiles",
          t: "P 45 42 Tank (frozen by probe)", tb: ["The probe freezes the Jarg tank; Jarg turns to the next on threat."],
          h: "P 56 56 Healer: spike-heal Jarg's new target", hb: ["This is the dangerous spike window."],
          d: "P 32 44 You: kill the Carbonizer Probe|> 72 52 80 60 out of purple", db: ["Swap to the probe right away."] } ] },
    { name: "Foreman Crusher", tr: "F 2 2 96 66 Crusher's pen", sm: { t: "Same positions as Veteran.", h: "Same as Veteran.", d: "Same as Veteran, lower damage." }, ar: "r", conf: "Checked against Merlyn (SM + VM notes)", src: ["mlKP", "vkNoNim"],
      sorc: "Force Storm/Forcequake on the Supervisors while the tank holds them, from behind the boss.",
      nim: [NO_MM_EVKP, "VM (Merlyn): the cleave slows; Rock Throw leaves dust (-100% accuracy); a roar stuns everyone and he switches target."],
      ph: [
        { n: "Wall, adds at 75/50/25%", c: "B 72 30 Crusher|Z 76 24 7 Cleave (slows)|A 40 30 Supervisors|Z 30 52 4 Rock Throw + dust",
          t: "P 78 30 Tank: by the shield|P 44 24 Off-tank: AoE-taunt adds", tb: ["Save defensives for Frenzy. After Frenzy or a roar he switches target: taunt back."],
          h: "P 30 40 Healer", hb: ["Burst on the tank during Frenzy."],
          d: "P 46 44 You: AoE the adds|> 30 52 22 60 out of rock + dust", db: ["Melee: never step in front (slowed, then dead).", "Leave the dust cloud: you can't hit anything in it."] } ] },
    { name: "G4-B3 Heavy Fabricator", tr: "F 2 14 96 54 Factory floor|F 2 1 96 12 Upper control floor|V 88 14 10 54 Lava pipe (right)", sm: { t: "Tank in place.", h: "Plain healing.", d: "Puzzle removed in Story (6.x): someone clicks the lava button on cooldown; then burn." }, ar: "r", conf: "Checked against Merlyn (SM + VM notes)", src: ["mlKP", "vkNoNim"],
      sorc: "Sticky Grenade on you: Force Speed out of the group. A healer Sage/Sorc at the [II] panel keeps line of sight on the other two (Merlyn).",
      nim: [NO_MM_EVKP, "VM (Merlyn): the lava needs the Tower of Hanoi puzzle (not automatic as in SM). In 16m you can't click the same panel twice in a row."],
      ph: [
        { n: "Tank, puzzle, lava", c: "B 50 42 G4-B3|O 50 32 Lava spigot (above)|Z 50 42 7 Lava splash|O 20 8 Panel: Left|O 50 8 Panel: Center|O 80 8 Panel: Right",
          t: "P 50 50 Tank (swap on Battered)", tb: ["Pummel stacks Battered (-16% armor each). Swap at high stacks."],
          h: "P 50 12 Healer on the [II] panel (VM)", hb: ["Merlyn: 2 DPS + 1 healer up top; the healer at [II] keeps line of sight."],
          d: "P 20 12 You on a puzzle panel (if assigned)|P 68 52 Others: clear the splash", db: ["Stack [I][II][III] on one position to fire it; Right = vulnerable 20s.", "Droids spawn 20s after the lava. Kill those near the group."] } ] },
    { name: "Karagga the Unyielding", tr: "F 4 4 92 62 Throne room (rectangular)", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Same as Veteran." }, ar: "c", conf: "Checked against Merlyn (SM + VM notes)", src: ["mlKP", "vkNoNim"],
      sorc: "Stand side-on to Karagga. A Merc/Commando should cleanse Gravity Well. Overload/Force Wave the mouse droids.",
      nim: [NO_MM_EVKP, "VM (Merlyn): no new mechanics; front and rear cleaves, Gravity Well and mouse droids hit much harder."],
      ph: [
        { n: "Kite around the edge", c: "B 26 35 Karagga|Z 14 35 6 Rear cone|Z 38 35 6 Front cone|Z 26 50 5 Burning Oil",
          t: "> 26 35 42 62 move on each Burning Oil|P 26 30 Tank", tb: ["Kite around the edge; move every time Burning Oil lands. Avoid the two alcoves.", "He cleaves front AND back: keep him side-on to the group."],
          h: "P 60 36 Healer (middle, side-on)", hb: ["Heaviest damage in KP."],
          d: "P 56 26 You (side-on)", db: ["Never stand in front or behind him."] },
        { n: "Gravity Well + mouse droids", c: "B 40 60 Karagga|A 62 46 Mouse droids|Z 72 28 6 Gravity Well player",
          t: "P 40 56 Tank", tb: ["Keep kiting; the group moves with you."],
          h: "P 54 30 Healer|> 60 30 50 24", hb: ["Don't cleanse Gravity Well near others (it explodes) unless you're a Merc/Commando."],
          d: "P 60 40 You: AoE mouse droids|> 66 30 54 22 away from the Well", db: ["Mouse droids run out and explode: AoE them the moment they spawn."] } ] },
  ] },
  { id: "ec", name: "Explosive Conflict", modes: "Story / Veteran / Master", md: ["s", "v", "m"], bosses: [
    { name: "Zorn & Toth", tr: "F 2 2 96 66 Open drouk arena", sm: { t: "Surge (keep them 15m apart) was removed in Story: you can stack them.", h: "Same as Veteran.", d: "Cleave both together while stacked." }, ar: "r", conf: "VM + MM checked against Merlyn (detailed VM/MM sections)", src: ["mlEC", "idsEC"],
      sorc: "Merlyn: Madness/Balance players struggle to place their rotational AoE from 28m+. Stay at range anyway: Fearful and Mental Anguish cost the raid more than you lose.",
      nim: ["Merlyn MM: Baradium Poisoning DoT on everyone at the pull, which only a medpac cleanses. Everyone needs a medpac.", "Merlyn MM: much harder in 16m (damage scaling); otherwise the same fight, hitting harder."],
      ph: [
        { n: "Opposite walls, 28m+", c: "B 10 35 Zorn|B 90 35 Toth|Z 10 35 9 Shriek / Fearful (28m)|Z 70 52 4 Ground Shatter",
          t: "P 6 35 Tank: Zorn|P 94 35 Tank: Toth (30m+ from Zorn)", tb: ["Keep them 15m+ apart (Surge: +10% damage dealt, -10% damage taken per stack).", "Zorn deals Force/Tech, Toth deals melee/ranged damage: pick your defensives to match.", "Sonic Paralysis stuns the tank: break it to dodge Ground Shatter."],
          h: "P 50 62 Healers 28m+ from both", hb: ["Cleanse Mental Anguish (it also stacks Weakened).", "Burst for the Toth tank during Berserk (Baradium Heave)."],
          d: "P 44 18 Ranged on Zorn, 28m+ (you)|P 84 35 Melee on Toth", db: ["28m+ from Zorn = no Fearful and no Mental Anguish.", "Baradium Heave on you: run it under Toth.", "Dodge Ground Shatter red circles immediately."] },
        { n: "Toth leaps (90/70/50/30/10%)", c: "B 13 35 Zorn + Toth (leap)|Z 13 35 13 Fearful radius (28m)|O 90 35 Toth's wall",
          t: "P 6 30 Zorn tank|> 90 35 20 40 Toth tank taunts and drags back", tb: ["Merlyn's default: cross-taunt on the leap, then put them back on their walls."],
          h: "P 50 62 Healers", hb: ["Burst on the Zorn tank during Fearful if you don't swap."],
          d: "P 50 18 You: stay 28m+", db: ["Wait for the 10% leap before the final push.", "Get both below 10%, then kill them together (the survivor enrages +200%)."] } ] },
    { name: "Firebrand & Stormcaller", tr: "F 2 2 96 66 Walker field", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Get into a shield during Defensive Systems." }, ar: "r", conf: "VM + MM checked against Merlyn", src: ["mlEC", "idsEC"],
      sorc: "Targeted (VM): cleanse yourself to drop the reticle where it can't hurt anyone. Merlyn: in MM Mortar Barrage one-shots non-tanks, so be in the shield early.",
      nim: ["Merlyn MM: the Double Destruction DoT lasts 36s (was 15s) on a 30s cooldown, so it never drops between casts.", "Merlyn MM: Stormcaller hits very hard; Mortar Barrage one-shots non-tanks.", "Merlyn MM: kill Firebrand within 60s of the shield generator appearing; deal with the exploding add in the shield."],
      ph: [
        { n: "Offensive Systems: on the walkers", c: "B 30 35 Firebrand (walker)|B 70 35 Stormcaller (walker)|Z 50 56 4 Targeted missile",
          t: "P 30 43 Player tank: Firebrand|P 70 43 Player tank: Stormcaller", tb: ["VM Double Destruction hits the two closest in its cone. Stormcaller tank runs behind the grouped DPS/healers.", "Incinerate Armor: someone fresh must take it (or the Firebrand tank with cooldowns)."],
          h: "P 28 30 Healer (standing on the walker)|P 72 30 Healer 2", hb: ["Standing on a walker gives Magnetically Stabilized (can't be Targeted)."],
          d: "P 66 30 You on Stormcaller, grouped|P 34 30 DPS on Firebrand", db: ["Group on Stormcaller's side so Double D hits the planned players.", "Targeted: cleanse to drop it away from the group."] },
        { n: "Defensive Systems: into the shield", c: "B 30 35 Firebrand|B 70 35 Stormcaller|Z 14 12 7 Shield|Z 86 12 7 Shield|A 14 12 Adds + exploding add",
          t: "P 70 43 Stormcaller tank stays out|P 18 16 Firebrand tank in the shield", tb: ["The Stormcaller tank takes reduced Mortar Barrage damage and stays out."],
          h: "P 12 15 Healers in the shield", hb: ["25s phase; top up before going back to the walkers."],
          d: "P 10 10 You in the shield: kill adds", db: ["VM: only one shield per side. Use the minimap to find it fast."] } ] },
    { name: "Colonel Vorgath", tr: "F 2 2 96 66 Minefield approach and cave", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Follow the safe path across the minefield." }, ar: "r", conf: "VM + MM checked against Merlyn", src: ["mlEC", "idsEC"],
      sorc: "You have two interrupts for the Overload rotation (Jolt/Mind Snap, and Electrocute/Force Stun as a backup stun). Healers at the cave mouth line-of-sight the turrets.",
      nim: ["Merlyn MM: healers must line-of-sight the turrets from the cave while tanks and DPS ignore them.", "Merlyn MM: Vorgath switches targets: taunt back at once. Tanks use cooldowns freely and swap if needed."],
      ph: [
        { n: "Minefield", c: "R 20 14 60 30 7x4 minefield|A 50 52 Demolition Probe|A 34 22 Assassin Droids",
          t: "P 50 58 Tank: Demolition Probe", tb: ["VM: only one Mine Defusal Kit per probe."],
          h: "P 40 62 Healer: cleanse Explosive Probe", hb: ["Explosive Probe must be cleansed in VM."],
          d: "P 58 58 You: interrupt Overload|P 46 40 Defuser walks yellow squares", db: ["Overload (1.5s, 360° knockback) must always be interrupted.", "Assassin Droids walk in and explode: knock back, CC, stun."] },
        { n: "Vorgath + turrets", c: "B 50 22 Vorgath|A 18 30 Turret|A 82 30 Turret|O 50 66 Cave entrance",
          t: "P 50 28 Tank (taunt when he drops you)", tb: ["Turrets enrage 6 minutes after the fight begins (VM)."],
          h: "P 50 62 Healers at the cave: LoS turrets", hb: ["Turrets can't be CC'd in VM; they aggro you but can't see you at the cave."],
          d: "P 56 30 You: Vorgath only", db: ["Ignore the turrets (VM strategy)."] } ] },
    { name: "Warlord Kephess", tr: "F 2 2 96 66 Open walker field", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Same as Veteran." }, ar: "r", conf: "VM + MM checked against Merlyn", src: ["mlEC", "idsEC"],
      sorc: "Bomb carrier: Force Speed under the walker. Pulsar droids: stand right on the idle one (Rail Shot). Kephess: stay out of his cleave and Gift of the Masters.",
      nim: ["Merlyn MM: interrupt nearly every Calibrating Shot (+12% per stack).", "Merlyn MM: only 10s to get the Baradium Pack under the walker; 3-bomb kill is a high DPS check (a 4th bomb may be needed).", "Merlyn MM: 2 Trandoshan Warriors per wave; Rail Shot hits extremely hard (tanks take turns with cooldowns).", "Merlyn MM: Kephess pulls the group in during Gift of the Masters; after the tank drops the 2nd Void Zone he pulls them in; Nightmare of the Masters buff if 2 players die after 58%."],
      ph: [
        { n: "Siege droids + Bomber", c: "B 50 10 Battlewalker|A 24 40 Siege droid|A 50 46 Siege droid|A 76 40 Siege droid|A 86 60 Baradium Bomber|Z 50 10 8 Under the walker",
          t: "P 72 46 Tank: interrupt a droid", tb: ["Tanks and healers help interrupt the two droids DPS aren't on."],
          h: "P 40 56 Healer: interrupt help", hb: ["Calibrating Shot stacks make the droids hit harder."],
          d: "P 28 44 You: focus one droid|> 86 60 50 16 bomb carrier: run under the walker", db: ["Pull the Bomber in and burst it; the carrier runs the bomb under the walker."] },
        { n: "Trandoshans, then Pulsar droids", c: "B 50 10 Battlewalker|A 30 40 Trandoshan Warrior (reflect shield)|A 70 46 Pulsar Power Droids|Z 50 28 9 Saturation Fire",
          t: "P 84 30 Tanks: stand 8m+ out for Rail Shot", tb: ["Merlyn: both tanks out >8m to take Rail Shot (or alternate)."],
          h: "P 70 52 Healers on top of the idle Pulsar droid", hb: ["Rail Shot is deadly to non-tanks in VM."],
          d: "P 66 48 You: stack on the idle Pulsar droid|P 32 46 Trandos: kill the Warrior first", db: ["Don't hit the Trenchcutters from outside the Warrior's shield (reflect).", "Get out of purple Saturation Fire."] },
        { n: "Kephess", c: "B 50 36 Kephess|Z 50 36 12 Gift of the Masters (58%)|Z 30 56 4 Leap landing|Z 78 18 5 Void Zone",
          t: "P 50 30 Tank 1|P 60 28 Tank 2: swap after Empowered Slash|> 50 30 80 14 Breath: drop Void Zones away", tb: ["Swap after Empowered Slash + Savage Wounding (mandatory in VM+).", "Touch of the Masters: the knocked-back tank must not take another hit for 16s."],
          h: "P 30 24 Healer (out of the cleave)", hb: ["Very heavy tank damage; be ready for burst."],
          d: "P 34 46 You: side-on; leave purple at 58%", db: ["Arcing Slash cleaves: stay out of the front.", "Leap: get out of the red landing circle."] } ] },
  ] },
  { id: "toborro", name: "Toborro's Courtyard", modes: "Story / Veteran (lair: the terminal list shows no modes; modes from guides)", md: ["s", "v"], bosses: [
    { name: "Golden Fury (Toborro's Courtyard)", tr: "F 2 2 96 66 Courtyard|F 2 2 22 20 Raised steps|F 76 2 22 20 Raised steps", sm: { t: "Isotope-5 buff lasts 100s in Story (70s in VM).", h: "Lasers charge more slowly in Story.", d: "Still run behind the yellow line for Massive Laser." }, ar: "r", conf: "Checked against Grophets + SWTOR Cantina + IDS", src: ["grToborro", "cantToborro", "mlOther"],
      sorc: "As ranged, stand on or next to a raised platform: Massive Laser warning gets shorter each time (VM: 6s down to 2s).",
      nim: ["No Master Mode (Grophets, IDS).", "VM (Cantina/Grophets): the Isotope-5 buff lasts 70s (100s in SM); each laser charges faster (6s down to 2s); droids hit harder: second tank holds them, interrupt every Isotope-5 Laser channel."],
      ph: [
        { n: "Tank + Isotope containers", c: "B 50 42 Golden Fury|O 24 54 Isotope-5 containers (pre-stacked)|O 50 67 Entrance / fountain|R 2 2 22 20 Raised platform|R 76 2 22 20 Raised platform",
          t: "P 50 36 Tank: break a container (50% DR)|P 34 52 Off-tank: droids", tb: ["Only the tank breaks containers (last hit gets the buff).", "Satellite Strike can't target the boss tank."],
          h: "P 14 14 Healer near a platform", hb: ["Spike after the container buff falls off before the next laser."],
          d: "P 86 16 Ranged (you) near a platform|P 50 50 Melee", db: ["Don't break containers (tank only).", "Satellite Strike (purple, 7s): move away from others."] },
        { n: "Massive Laser", c: "B 50 42 Golden Fury (faces entrance)|R 28 30 44 38 Laser lane|R 2 2 22 20 Safe platform|R 76 2 22 20 Safe platform|A 50 62 Security droids (after)",
          t: "> 50 36 82 14 up the stairs, behind the yellow line|P 82 14 Tank", tb: ["When he turns to the entrance and goes red, everyone runs up a staircase behind the double yellow line.", "Afterwards the off-tank picks up the droids."],
          h: "> 20 30 14 12 behind the line|P 14 12 Healer", hb: ["Boxes over the line are not safe."],
          d: "> 70 30 86 14 behind the line|P 86 14 You", db: ["From 95%; up to every 45s. At 20%, lasers stop and Radiation Leak starts: burn."] } ] },
  ] },
  { id: "hor", name: "Heart of Ruin", modes: "Story / Veteran (lair: the terminal list shows no modes; modes from guides)", md: ["s", "v"], bosses: [
    { name: "Colossal Monolith (Heart of Ruin)", tr: "K 50 35 33 Monolith arena", sm: { t: "Same as Veteran.", h: "Same as Veteran.", d: "Story: two colors at fixed spots (Veteran: four, random)." }, ar: "c", conf: "Checked against Grophets + IDS", src: ["grMono", "grWorld", "mlOther"],
      sorc: "Terrible Shout on you: stand still and bubble yourself (Force/Tech defensives work). Lingering Destruction: Force Speed to the edge and count 10 orange circles.",
      nim: ["No Master Mode (Grophets, IDS).", "VM (Grophets): everyone needs Ancient Protection from killing Worldbreaker Monolith on Ziost first.", "VM: colors spawn at random spots; you can't take the same color twice in a row; pair players (yellow/green, red/purple)."],
      ph: [
        { n: "Core loop: circles and Shout", c: "B 50 35 Monolith|Z 50 18 10 Terrible Shout (follows a DPS)|Z 32 56 3 White circle|Z 82 56 3 Orange trail|O 14 35 Rift|O 86 35 Rift",
          t: "P 50 42 Tank: keep it off rifts|P 58 42 Tank 2: swap Bite Wounds at 2", tb: ["Rifts buff the boss when it stands on them.", "During Shout it's taunt-immune for 8s; it comes back by itself."],
          h: "P 44 52 Healer", hb: ["Heavy heals on the Shout target (10s DoT).", "Rifts reduce healing on players standing in them."],
          d: "P 56 52 You|> 76 52 94 58 Lingering Destruction: to the edge", db: ["White circles every 15s: move out (stun + damage).", "Shout target: stand still so others can leave the cone."] },
        { n: "Colors: break the channel", c: "B 50 35 Monolith (Breaking the Rift)|O 10 10 Color|O 90 10 Color|O 10 60 Color|O 90 60 Color|R 42 27 16 16 Color grid",
          t: "P 50 46 Tank", tb: ["Hold it in place while runners work."],
          h: "P 44 54 Healer", hb: ["Runners are stunned briefly on pickup; heal them."],
          d: "P 88 12 Color runner (you, if assigned)|> 88 12 56 31 into your color square", db: ["SM: two colors, fixed spots. VM: four, random spots, alternate with your partner.", "Don't touch another color on the way in."] } ] },
  ] },
  { id: "hive", name: "Hive of the Mountain Queen", modes: "Story / Veteran (lair: the terminal list shows no modes; modes from guides)", md: ["s", "v"], bosses: [
    { name: "Mutated Geonosian Queen", tr: "K 50 35 33 Toxic outer ring|K 50 35 27 Queen's chamber", sm: { t: "Tank the Queen in the center; Guillotine is a Veteran mechanic.", h: "Same as Veteran.", d: "Break the red eggs early." }, ar: "c", conf: "Checked against Grophets + Dulfy (5.10.1) + IDS", src: ["grQueen", "dQueen", "mlOther"],
      sorc: "Pheromonic Blast on you: Force Speed out of the group and away from red eggs, then cleanse. Electrocute/Force Stun helps stun-lock Royal Guards.",
      nim: ["No Master Mode (Grophets, IDS).", "VM (Grophets): Queen stuns the tank, then Guillotine executes: break the stun or another player taunts.", "VM: 3 red eggs (break 2 at the start). Royal Guards execute stunned targets after Concentrate: stun-lock them or let a tank take Staggering Strike.", "VM: groups can't survive a third set of Royal Guards: burn before it."],
      ph: [
        { n: "Center tank, guards and eggs", c: "B 50 35 Queen|O 26 18 Red egg|O 74 18 Egg|A 30 56 Royal Guard|Z 50 35 31 Toxic ring (outside)",
          t: "P 50 29 Tank: stun-break fast (Guillotine)|P 34 52 Tank 2: Royal Guard", tb: ["Tank the Queen in the center.", "Swap after her stun if two tanks."],
          h: "P 60 46 Healer: cleanse Pheromonic Blast", hb: ["Stand in the outer yellow, never the red center of a Blast."],
          d: "P 40 46 You|> 40 46 62 62 Blast: take it out, away from red eggs", db: ["Break the 2 planned red eggs early; avoid tagging others."] },
        { n: "Burn before the 3rd Guard set", c: "B 50 35 Queen|A 70 56 Caustic Drones|Z 50 35 31 Toxic ring",
          t: "P 50 29 Tank", tb: ["Rallying Call: all Royal Guards dead before it completes."],
          h: "P 56 48 Healer", hb: ["Multi-Blasts put 2–3 circles on a player: move away from the group."],
          d: "P 44 46 You: raid buffs, all on Queen", db: ["Burn usually starts around 3:30–4:00 (VM)."] } ] },
  ] },
  { id: "rr", name: "Relentless Replication", modes: "Story / Veteran / Master (lair: the terminal list shows no modes; modes from guides)", md: ["s", "v", "m"], bosses: [
    { name: "Propagator Core XR-53", tr: "K 50 35 33 Round lab, vats around the wall", sm: { t: "Same stack-and-kite as Veteran; there is still a tank swap on Lethal Strike (Vulkk: a DPS with a taunt can cover it in Story).", h: "Damage is low, and constructs don't leave acid in Story (acid is Veteran+).", d: "Story: you don't need to kill Imperfect Constructs; there's plenty of time to step out of their circles (Vulkk)." }, ar: "c", conf: "Checked against Vulkk (Story + Veteran) + Swtorista + Admiral Nick (Hard). Room is traced: no area map found", src: ["vkXR", "swXR", "swXRmm", "anXR"],
      sorc: "Force Speed out of a construct's red circle late rather than early so the acid lands tight to the group. In Master Mode a ranged Sorc is a natural Hunting Grounds bait (farthest player).",
      flag: ["Room shape traced from guide descriptions (round room, vats on the wall); vat count and spacing are approximate.", "Prime Directive role order differs by guide: Admiral Nick sends Healer, then DPS, then Tank; plan with your group."],
      nim: ["Master Mode (Swtorista, notes from progression, not a clear): hard enrage at about 10:20.", "Prime Directive needs two roles in the yellow circle, so two role constructs spawn at once.", "Huge green acid splats; Hunting Grounds targets the farthest player: bait it at the room edge.", "Extraneous Expulsion (red rectangle): the hit player drops the green at the room edge, not in the stack."],
      ph: [
        { n: "Construct loop: stack and spiral", c: "B 50 35 Propagator Core XR-53|Z 31 22 6 Imperfect Construct (explodes after 15s, 10m)|Z 20 40 6 Acid (Veteran+: permanent)|R 64 50 14 7 Yellow rectangle|A 80 18 Prey Seeker droid|O 50 3 Vat|O 83 35 Vat|O 17 35 Vat|O 50 67 Vat",
          t: "P 53 31 Tank: hold the boss on the outer track|> 53 31 70 20 move along the outer ring, then spiral in|P 46 30 Off-tank: taunt on Lethal Strike", tb: ["Swap on every Lethal Strike and use a defensive (Vulkk).", "Start on the outer ring and move the boss around it, spiralling inward so the acid fills the room from the outside in."],
          h: "P 46 39 Healers: stack on the boss|> 52 42 66 52 Hungering Bite stacks: step into the yellow rectangle", hb: ["Digestive Enzymes stacks from attacks and acid can't be cleansed by players; the yellow rectangle (Hungering Bite) clears them.", "Constructs leap to random players every 15s: everyone steps out of the red circle together."],
          d: "P 55 39 You: stack just outside the red circle, next to old acid|> 76 22 79 20 kill Prey Seekers", db: ["Stack tightly on the boss so the acid circles overlap and you don't run out of room (Vulkk).", "Kill Prey Seeker droids fast (they stun); cleave and DoT spread reach them from the stack."] },
        { n: "Prime Directive (Veteran+): pick the role", c: "B 50 35 XR-53|Z 50 35 5 Prime Directive (yellow circle)|A 83 30 Defender Construct (spawns at nearest vat)|A 30 55 Supplicant Construct|A 70 55 Rampaging Construct|O 83 35 Vat",
          t: "P 51 33 Tank in the circle on the tank's turn|> 58 33 80 31 Defender: pick it up; boss is immune while it lives", tb: ["The role standing in the circle decides the construct: tank → Defender, healer → Supplicant, DPS → Rampaging (Vulkk/Admiral Nick).", "Never send the same role twice: that spawns a Mistaken Construct (wipe)."],
          h: "P 48 37 Healer in the circle on the healer's turn", hb: ["On the healer turn the Supplicant heals: make sure it gets interrupted.", "Agree the order before the pull (Admiral Nick: Healer, DPS, Tank)."],
          d: "P 54 38 You|> 54 40 33 53 interrupt the Supplicant; kill each construct", db: ["Interrupt the Supplicant's heal every time.", "On the DPS turn the Rampaging Construct hits hard: kill it quickly."] } ] },
  ] },
];

function parse(s: string) {
  return s.split("|").map((tok: string) => {
    const p = tok.trim().split(" ");
    const k = p[0];
    const n = k === "Z" || k === "K" ? 3 : k === "R" || k === ">" || k === "F" || k === "V" ? 4 : 2;
    const nums = p.slice(1, 1 + n).map((x: string) => Number(x));
    return { k, nums, label: p.slice(1 + n).join(" ") };
  }).filter((x: { k: string }) => x.k.length > 0);
}

type Tok = { k: string; nums: number[]; label: string };
// Room view: project map-view coordinates (100x70) onto a perspective video frame with a homography; anything that lands
// outside the frame is pinned to the nearest edge and its label says which way it is.
function hp(H: number[], x: number, y: number): number[] {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
}
function pin(p: number[]): { p: number[]; off: string } {
  const [x, y] = p;
  const off = y > 68 ? "toward the camera" : x < 2 ? "left" : x > 98 ? "right" : y < 2 ? "far end" : "";
  return { p: [Math.min(97, Math.max(3, x)), Math.min(67, Math.max(3, y))], off };
}
function projTok(e: Tok, H: number[]): Tok {
  const [x, y, a, b] = e.nums;
  const tag = (off: string) => (off && e.label ? " (off-screen, " + off + ")" : "");
  if (e.k === "R") {
    const c = [hp(H, x, y), hp(H, x + a, y), hp(H, x + a, y + b), hp(H, x, y + b)];
    return { k: "Q", nums: c.flat(), label: e.label };
  }
  if (e.k === "Z") {
    const c = hp(H, x, y); const pn = pin(c);
    const qx = [hp(H, x + a, y), hp(H, x - a, y)]; const qy = [hp(H, x, y + a), hp(H, x, y - a)];
    const rx = Math.abs(qx[0][0] - qx[1][0]) / 2; const ry = Math.abs(qy[0][1] - qy[1][1]) / 2;
    return { k: "E", nums: [pn.p[0], pn.p[1], pn.off ? Math.min(rx, 3) : rx, pn.off ? Math.min(ry, 3) : ry], label: e.label + tag(pn.off) };
  }
  if (e.k === ">") {
    const p1 = pin(hp(H, x, y)); const p2 = pin(hp(H, a, b));
    return { k: ">", nums: [p1.p[0], p1.p[1], p2.p[0], p2.p[1]], label: e.label + tag(p2.off || p1.off) };
  }
  const pn = pin(hp(H, x, y));
  return { k: e.k, nums: [pn.p[0], pn.p[1]], label: e.label + tag(pn.off) };
}

function Arena({ ph, role, boss, pi, uid, dt }: { ph: Ph; role: Role; boss: Boss; pi: number; uid: string; dt?: Rng }) {
  const th = useGrokTheme();
  const [view, setView] = useState<string>("room");
  const rv = boss.rv && view === "room" ? boss.rv : undefined;
  const you = th.dataviz.categorical[0];
  const bc = th.dataviz.categorical[1];
  const haz = th.dataviz.categorical[2];
  const grey = th.dataviz.other;
  const onMap = !!boss.mp;
  const ctx = rv ? parse(ph.c).map((e: Tok) => projTok(e, rv.H)) : parse(ph.c);
  const mine = rv ? parse(role === "t" ? ph.t : role === "h" ? ph.h : ph.d).map((e: Tok) => projTok(e, rv.H)) : parse(role === "t" ? ph.t : role === "h" ? ph.h : ph.d);
  const isOther = (label: string) => role === "d" && !!dt && dpsCat(label) !== "shared" && dpsCat(label) !== dt;
  const hasOwnMelee = mine.some((e) => e.k === "P" && dpsCat(e.label) === "melee");
  const mainBoss = ctx.find((e) => e.k === "B");
  const meleeRing = role === "d" && dt === "melee" && !hasOwnMelee && mainBoss
    ? <g><circle cx={mainBoss.nums[0]} cy={mainBoss.nums[1]} r={5.5} fill="none" stroke={you} strokeWidth={0.5} strokeDasharray="0.9 0.7" /></g>
    : null;
  // Numbered labels: every label becomes a small numbered badge placed next to its marker without overlapping
  // other badges or markers and always inside the frame; the text goes in a key under the diagram.
  type Lab = { x: number; y: number; text: string; col: string; dim: boolean };
  const labs: Lab[] = [];
  const traced = boss.tr ? parse(boss.tr) : [];
  if (!onMap) traced.forEach((e) => { const [x, y, a] = e.nums; if (e.label && (e.k === "K" || e.k === "F")) labs.push({ x: e.k === "K" ? x : x + 2, y: e.k === "K" ? y - a + 2.5 : y + 2.5, text: e.label, col: grey, dim: false }); });
  ctx.forEach((e) => {
    const [x, y, a, b] = e.nums;
    if (!e.label) return;
    if (e.k === "Z") labs.push({ x, y: y - a, text: e.label, col: haz, dim: false });
    else if (e.k === "E") labs.push({ x, y: Math.max(2, y - b), text: e.label, col: haz, dim: false });
    else if (e.k === "R") labs.push({ x: x + a / 2, y: y + b / 2, text: e.label, col: haz, dim: false });
    else if (e.k === "Q") labs.push({ x: (e.nums[0] + e.nums[2] + e.nums[4] + e.nums[6]) / 4, y: (e.nums[1] + e.nums[3] + e.nums[5] + e.nums[7]) / 4, text: e.label, col: haz, dim: false });
    else if (e.k === "B") labs.push({ x, y, text: e.label, col: bc, dim: false });
    else if (e.k === "A" || e.k === "O") labs.push({ x, y, text: e.label, col: grey, dim: false });
  });
  mine.forEach((e) => {
    if (!e.label) return;
    const dim = isOther(e.label);
    if (e.k === ">") labs.push({ x: (e.nums[0] + e.nums[2]) / 2, y: (e.nums[1] + e.nums[3]) / 2, text: e.label, col: dim ? grey : you, dim });
    if (e.k === "P") labs.push({ x: e.nums[0], y: e.nums[1], text: e.label + (dim ? " (not your type)" : ""), col: dim ? grey : you, dim });
  });
  const pts: number[][] = [...ctx, ...mine].filter((e) => e.k === "B" || e.k === "A" || e.k === "O" || e.k === "P").map((e) => [e.nums[0], e.nums[1], e.k === "B" ? 3.2 : 2.4]);
  const OFFS = [[3.6, -3], [-3.6, -3], [3.6, 3], [-3.6, 3], [0, -4.4], [0, 4.4], [5, 0], [-5, 0], [6, -5], [-6, -5], [6, 5], [-6, 5], [0, -7], [0, 7], [8.5, 0], [-8.5, 0], [9, -7], [-9, -7], [9, 7], [-9, 7]];
  const placed: number[][] = [];
  const RB = 1.75;
  const badges = labs.map((l) => {
    let best: number[] = [];
    let bestScore = 1e9;
    for (const [dx, dy] of OFFS) {
      const bx = Math.min(100 - RB - 0.4, Math.max(RB + 0.4, l.x + dx));
      const by = Math.min(70 - RB - 0.4, Math.max(RB + 0.4, l.y + dy));
      let score = Math.hypot(bx - l.x, by - l.y) * 0.05;
      for (const q of placed) { const d = Math.hypot(bx - q[0], by - q[1]); if (d < 2 * RB + 0.5) score += 100 + (2 * RB + 0.5 - d); }
      for (const q of pts) { const d = Math.hypot(bx - q[0], by - q[1]); if (d < q[2] + RB) score += 10 + (q[2] + RB - d); }
      if (score < bestScore) { bestScore = score; best = [bx, by]; }
      if (score < 1) break;
    }
    placed.push(best);
    return best;
  });
  const bfs = 2.1;
  const svg = (
    <svg viewBox="0 0 100 70" width="100%" height={onMap ? "100%" : undefined} role="img" aria-label={ph.n} style={onMap ? { position: "absolute", left: 0, top: 0 } : undefined}>
      <defs>
        <marker id={"ah" + uid} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={you} />
        </marker>
      </defs>
      {onMap ? null : boss.tr ? traced.map((e, i) => {
        const [x, y, a, b] = e.nums;
        if (e.k === "K") return <circle key={"k" + i} cx={x} cy={y} r={a} fill={th.bg.subtle} stroke={th.border.default} strokeWidth={0.4} />;
        if (e.k === "F") return <rect key={"f" + i} x={x} y={y} width={a} height={b} rx={1} fill={th.bg.subtle} stroke={th.border.default} strokeWidth={0.4} />;
        if (e.k === "V") return <rect key={"v" + i} x={x} y={y} width={a} height={b} fill={haz + th.dataviz.areaAlpha} stroke={th.border.default} strokeWidth={0.3} />;
        return null;
      }) : (boss.ar === "c" ? <circle cx={50} cy={35} r={33} fill={th.bg.subtle} stroke={th.border.default} strokeWidth={0.4} />
        : boss.ar === "d" ? <polygon points="50,2 98,35 50,68 2,35" fill={th.bg.subtle} stroke={th.border.default} strokeWidth={0.4} />
        : <rect x={1} y={1} width={98} height={68} rx={2} fill={th.bg.subtle} stroke={th.border.default} strokeWidth={0.4} />)}
      {ctx.map((e, i) => {
        const [x, y, a, b] = e.nums;
        if (e.k === "Z") return <circle key={"z" + i} cx={x} cy={y} r={a} fill={haz + th.dataviz.areaAlpha} stroke={haz} strokeWidth={0.35} strokeDasharray="1.2 0.8" />;
        if (e.k === "E") return <ellipse key={"e" + i} cx={x} cy={y} rx={a} ry={b} fill={haz + th.dataviz.areaAlpha} stroke={haz} strokeWidth={0.35} strokeDasharray="1.2 0.8" />;
        if (e.k === "R") return <rect key={"r" + i} x={x} y={y} width={a} height={b} fill={haz + th.dataviz.areaAlpha} stroke={haz} strokeWidth={0.35} strokeDasharray="1.2 0.8" />;
        if (e.k === "Q") return <polygon key={"q" + i} points={e.nums[0] + "," + e.nums[1] + " " + e.nums[2] + "," + e.nums[3] + " " + e.nums[4] + "," + e.nums[5] + " " + e.nums[6] + "," + e.nums[7]} fill={haz + th.dataviz.areaAlpha} stroke={haz} strokeWidth={0.35} strokeDasharray="1.2 0.8" />;
        return null;
      })}
      {ctx.map((e, i) => {
        const [x, y] = e.nums;
        if (e.k === "B") return <circle key={"b" + i} cx={x} cy={y} r={3} fill={bc} stroke={onMap ? "#000000" : "none"} strokeWidth={0.4} />;
        if (e.k === "A") return <circle key={"a" + i} cx={x} cy={y} r={1.6} fill={grey} stroke={onMap ? "#FFFFFF" : "none"} strokeWidth={0.3} />;
        if (e.k === "O") return <rect key={"o" + i} x={x - 1.5} y={y - 1.5} width={3} height={3} fill={th.bg.base} stroke={grey} strokeWidth={0.5} />;
        return null;
      })}
      {meleeRing}
      {mine.map((e, i) => {
        if (e.k !== ">") return null;
        const [x1, y1, x2, y2] = e.nums;
        const dim = isOther(e.label);
        return <line key={"m" + i} opacity={dim ? 0.45 : 1} x1={x1} y1={y1} x2={x2} y2={y2} stroke={dim ? grey : you} strokeWidth={0.7} strokeDasharray="1.6 1" markerEnd={dim ? undefined : "url(#ah" + uid + ")"} />;
      })}
      {mine.map((e, i) => {
        if (e.k !== "P") return null;
        const [x, y] = e.nums;
        const c = role === "d" ? dpsCat(e.label) : "shared";
        const dim = isOther(e.label);
        const mark = c === "melee"
          ? <polygon points={(x) + "," + (y - 2.6) + " " + (x + 2.6) + "," + y + " " + x + "," + (y + 2.6) + " " + (x - 2.6) + "," + y} fill={dim ? "none" : you} stroke={dim ? grey : (onMap ? "#FFFFFF" : th.bg.base)} strokeWidth={0.5} />
          : <circle cx={x} cy={y} r={2.1} fill={dim ? "none" : you} stroke={dim ? grey : (onMap ? "#FFFFFF" : th.bg.base)} strokeWidth={0.5} />;
        return <g key={"p" + i} opacity={dim ? 0.55 : 1}>{mark}{!dim && c !== "shared" && role === "d" ? <circle cx={x} cy={y} r={3.6} fill="none" stroke={you} strokeWidth={0.4} /> : null}</g>;
      })}
      {labs.map((l, i) => {
        const [bx, by] = badges[i];
        const far = Math.hypot(bx - l.x, by - l.y) > 4.2;
        return <g key={"lb" + i} opacity={l.dim ? 0.6 : 1}>
          {far ? <line x1={l.x} y1={l.y} x2={bx} y2={by} stroke={onMap ? "#FFFFFF" : th.text.tertiary} strokeWidth={0.25} opacity={0.8} /> : null}
          <circle cx={bx} cy={by} r={RB} fill={l.col} stroke={onMap ? "#000000" : th.bg.base} strokeWidth={0.35} />
          <text x={bx} y={by + bfs * 0.36} fontSize={bfs} fontWeight={700} fill="#0B1220" textAnchor="middle" fontFamily={th.font.family}>{i + 1}</text>
        </g>;
      })}
    </svg>
  );
  const key = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 8, fontSize: 13, lineHeight: 1.35, color: th.text.secondary }}>
      {boss.tr ? <div style={{ width: "100%", color: th.text.tertiary, fontStyle: "italic" }}>Room map unavailable, traced layout</div> : null}
      {labs.map((l, i) => (
        <div key={"k" + i} style={{ display: "flex", alignItems: "flex-start", gap: 6, opacity: l.dim ? 0.6 : 1, minWidth: 0, maxWidth: "100%" }}>
          <span style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 9, background: l.col, color: "#0B1220", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
          <span style={{ overflowWrap: "anywhere" }}>{l.text}</span>
        </div>
      ))}
    </div>
  );
  if (!boss.mp) return <div>{svg}{key}</div>;
  const mp = boss.mp;
  const fi = mp.f[Math.min(pi, mp.f.length - 1)];
  const note = { fontSize: 12, lineHeight: 1.35, color: th.text.tertiary, marginTop: 4 };
  return (
    <div>
      {boss.rv ? <div style={{ marginBottom: 6 }}><Segmented options={[{ value: "room", label: "Room view" }, { value: "map", label: "Map view" }]} value={view} onChange={(v: string) => setView(v)} /></div>
        : <div style={{ ...note, marginTop: 0, marginBottom: 4 }}>Map view (no clear overhead frame from a kill video yet, so no Room view for this boss).</div>}
      <div style={{ position: "relative", width: "100%", aspectRatio: "10 / 7", overflow: "hidden", borderRadius: 8 }}>
        {rv ? <div style={{ position: "absolute", left: 0, width: "100%", top: (-(rv.i ?? 0) * 100) + "%" }}>
            <Image src={rv.a} alt={"In-game screenshot of the boss room: " + boss.name} ratio={"800/" + (560 * (rv.n ?? 1))} width="100%" />
          </div>
          : <div style={{ position: "absolute", left: 0, width: "100%", top: (-fi * 100) + "%" }}>
            <Image src={mp.a} alt={"In-game area map: " + boss.name} ratio={"800/" + (560 * mp.n)} width="100%" />
          </div>}
        {svg}
      </div>
      {rv ? <div style={note}>{"Room view: " + rv.cr + ". Markers are projected from the map view onto this camera angle (lined up on " + (rv.how ?? "the raised emblem") + "), so they are approximate; spots outside the shot are pinned to the edge. Video: " + rv.href}</div> : null}
      {key}
    </div>
  );
}

type Rng = "melee" | "ranged";
interface Disc { id: string; ic: string; idisc: string; rc: string; rdisc: string; role: Role; rng: Rng; dist: string; names: string; defs: string[]; intr: string[]; cln: string[]; brk: string[]; mob: string[]; rez: string[]; src: string[] }
// Every live 7.x discipline (8.0 not live). Role, range and abilities from Swtorista's discipline basics guides (updated for 7.8).
const DISCS: Disc[] = [
  { id: "lightning-telekinetics", ic: "Sorcerer", idisc: "Lightning", rc: "Sage", rdisc: "Telekinetics", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial", defs: ["Static Barrier", "Unnatural Preservation", "Force Barrier"], intr: ["Jolt"], cln: ["Expunge"], brk: ["Unbreakable Will"], mob: ["Force Speed", "Cloud Mind (optional)", "Extrication", "Phase Walk (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-inquisitor-sorcerer-lightning-basics-guide/"] },
  { id: "madness-balance", ic: "Sorcerer", idisc: "Madness", rc: "Sage", rdisc: "Balance", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial", defs: ["Static Barrier", "Unnatural Preservation", "Force Barrier"], intr: ["Jolt"], cln: ["Expunge"], brk: ["Unbreakable Will"], mob: ["Force Speed", "Cloud Mind (optional)", "Extrication", "Phase Walk (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-inquisitor-sorcerer-madness-basics-guide/"] },
  { id: "corruption-seer", ic: "Sorcerer", idisc: "Corruption", rc: "Sage", rdisc: "Seer", role: "h", rng: "ranged", dist: "Long Range", names: "Imperial", defs: ["Static Barrier", "Force Barrier"], intr: ["Jolt"], cln: ["Expunge"], brk: ["Unbreakable Will"], mob: ["Force Speed", "Cloud Mind (optional)", "Extrication", "Phase Walk (optional)"], rez: ["Reanimation"], src: ["https://swtorista.com/articles/sith-inquisitor-sorcerer-corruption-basics-guide/"] },
  { id: "darkness-kinetic-combat", ic: "Assassin", idisc: "Darkness", rc: "Shadow", rdisc: "Kinetic Combat", role: "t", rng: "melee", dist: "Short Range", names: "Imperial", defs: ["Deflection", "Dark Ward", "Overcharge Saber (optional)", "Force Shroud"], intr: ["Jolt"], cln: ["Force Shroud"], brk: ["Unbreakable Will"], mob: ["Force Speed", "Force Cloak", "Phantom Stride", "Obfuscating Speed (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-inquisitor-assassin-darkness-basics-guide/"] },
  { id: "deception-infiltration", ic: "Assassin", idisc: "Deception", rc: "Shadow", rdisc: "Infiltration", role: "d", rng: "melee", dist: "Short Range", names: "Imperial + Republic", defs: ["Deflection", "Overcharge Saber / Battle Readiness (optional)", "Force Shroud / Resilience (optional)"], intr: ["Jolt / Mind Snap"], cln: ["Force Shroud / Resilience (optional)"], brk: ["Unbreakable Will / Force of Will"], mob: ["Force Speed", "Force Cloak", "Mass Mind Control", "Phantom Stride / Shadow Stride", "Obfuscating Speed (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-inquisitor-assassin-deception-basics-guide/", "https://swtorista.com/articles/jedi-consular-shadow-infiltration-basics-guide/"] },
  { id: "hatred-serenity", ic: "Assassin", idisc: "Hatred", rc: "Shadow", rdisc: "Serenity", role: "d", rng: "melee", dist: "Short Range", names: "Imperial + Republic", defs: ["Deflection", "Overcharge Saber / Battle Readiness (optional)", "Force Shroud / Resilience (optional)"], intr: ["Jolt / Mind Snap"], cln: ["Force Shroud / Resilience (optional)"], brk: ["Unbreakable Will / Force of Will"], mob: ["Force Speed", "Force Cloak", "Mass Mind Control", "Phantom Stride / Shadow Stride", "Obfuscating Speed (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-inquisitor-assassin-hatred-basics-guide/", "https://swtorista.com/articles/jedi-consular-shadow-serenity-basics-guide/"] },
  { id: "immortal-defense", ic: "Juggernaut", idisc: "Immortal", rc: "Guardian", rdisc: "Defense", role: "t", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Saber Ward", "Endure Pain / Enure", "Enraged Defense / Focused Defense", "Invincible / Warding Call", "Saber Reflect (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: ["Endure Pain / Enure"], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Intercede / Guardian Leap", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-juggernaut-immortal-basics-guide/", "https://swtorista.com/articles/defense-guardian-jedi-knight-basics-guide/"] },
  { id: "vengeance-vigilance", ic: "Juggernaut", idisc: "Vengeance", rc: "Guardian", rdisc: "Vigilance", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Saber Ward", "Endure Pain / Enure", "Enraged Defense / Focused Defense", "Saber Reflect (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: ["Endure Pain / Enure"], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Threatening Scream / Challenging Call", "Skewering Strike / Leaping Strike (optional)", "Intercede / Guardian Leap", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-juggernaut-vengeance-basics-guide/", "https://swtorista.com/articles/vigilance-guardian-jedi-knight-basics-guide/"] },
  { id: "rage-focus", ic: "Juggernaut", idisc: "Rage", rc: "Guardian", rdisc: "Focus", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Saber Ward", "Endure Pain / Enure", "Enraged Defense / Focused Defense", "Saber Reflect (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: ["Endure Pain / Enure"], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Enrage / Combat Focus", "Threatening Scream / Challenging Call", "Obliterate / Zealous Leap", "Intercede / Guardian Leap", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-juggernaut-rage-basics-guide/", "https://swtorista.com/articles/focus-guardian-jedi-knight-basics-guide/"] },
  { id: "annihilation-watchman", ic: "Marauder", idisc: "Annihilation", rc: "Sentinel", rdisc: "Watchman", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Cloak of Pain / Rebuke", "Saber Ward", "Undying Rage / Guarded by the Force (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: [], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Predation / Transcendence (optional)", "Force Camouflage", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-marauder-annihilation-basics-guide/", "https://swtorista.com/articles/watchman-sentinel-jedi-knight-basics-guide/"] },
  { id: "carnage-combat", ic: "Marauder", idisc: "Carnage", rc: "Sentinel", rdisc: "Combat", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Cloak of Pain / Rebuke", "Saber Ward", "Undying Rage / Guarded by the Force (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: [], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Driving Gore / Driving Lance (optional)", "Predation / Transcendence (optional)", "Force Camouflage", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-marauder-carnage-basics-guide/", "https://swtorista.com/articles/combat-sentinel-jedi-knight-basics-guide/"] },
  { id: "fury-concentration", ic: "Marauder", idisc: "Fury", rc: "Sentinel", rdisc: "Concentration", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Cloak of Pain / Rebuke", "Saber Ward", "Undying Rage / Guarded by the Force (optional)"], intr: ["Force Charge / Force Leap", "Disruption / Force Kick"], cln: [], brk: ["Unleash / Resolute"], mob: ["Force Charge / Force Leap", "Predation / Transcendence (optional)", "Force Camouflage", "Obliterate / Zealous Leap", "Mad Dash / Blade Blitz (optional)"], rez: [], src: ["https://swtorista.com/articles/sith-warrior-marauder-fury-basics-guide/", "https://swtorista.com/articles/concentration-sentinel-jedi-knight-basics-guide/"] },
  { id: "shield-tech-shield-specialist", ic: "Powertech", idisc: "Shield Tech", rc: "Vanguard", rdisc: "Shield Specialist", role: "t", rng: "melee", dist: "Short Range", names: "Republic", defs: ["Reactive Shield", "Adrenaline Rush", "Riot Gas"], intr: ["Riot Strike", "Impact Charge"], cln: [], brk: ["Adrenaline Rush", "Tenacity"], mob: ["Impact Charge", "Hold the Line (optional)"], rez: [], src: ["https://swtorista.com/articles/trooper-vanguard-shield-specialist-basics-guide/"] },
  { id: "pyrotech-plasmatech", ic: "Powertech", idisc: "Pyrotech", rc: "Vanguard", rdisc: "Plasmatech", role: "d", rng: "melee", dist: "Short Range", names: "Republic", defs: ["Durasteel Armor", "Reactive Shield", "Adrenaline Rush"], intr: ["Riot Strike", "Storm (optional)"], cln: [], brk: ["Adrenaline Rush", "Tenacity"], mob: ["Storm (optional)", "Sonic Round", "Hold the Line (optional)"], rez: [], src: ["https://swtorista.com/articles/trooper-vanguard-plasmatech-basics-guide/"] },
  { id: "advanced-prototype-tactics", ic: "Powertech", idisc: "Advanced Prototype", rc: "Vanguard", rdisc: "Tactics", role: "d", rng: "melee", dist: "Short Range", names: "Republic", defs: ["Reactive Shield", "Adrenaline Rush"], intr: ["Riot Strike", "Storm (optional)"], cln: [], brk: ["Adrenaline Rush", "Tenacity"], mob: ["Storm (optional)", "Sonic Round", "Hold the Line (optional)"], rez: [], src: ["https://swtorista.com/articles/trooper-vanguard-tactics-basics-guide/"] },
  { id: "bodyguard-combat-medic", ic: "Mercenary", idisc: "Bodyguard", rc: "Commando", rdisc: "Combat Medic", role: "h", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Energy Shield / Reactive Shield", "Chaff Flare / Diversion (optional)", "Kolto Overload / Adrenaline Rush", "Responsive Safeguards / Echoing Deterrence (optional)"], intr: ["Disabling Shot"], cln: ["Cure / Field Aid"], brk: ["Determination / Tenacity"], mob: ["Chaff Flare / Diversion (optional)", "Hydraulic Overrides / Hold The Line", "Rocket Out / Propulsion Round (optional)"], rez: ["Onboard AED / Emergency Medical Probe"], src: ["https://swtorista.com/articles/bounty-hunter-mercenary-bodyguard-basics-guide/", "https://swtorista.com/articles/trooper-commando-combat-medic-basics-guide/"] },
  { id: "arsenal-gunnery", ic: "Mercenary", idisc: "Arsenal", rc: "Commando", rdisc: "Gunnery", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Energy Shield / Reactive Shield", "Chaff Flare / Diversion (optional)", "Kolto Overload / Adrenaline Rush", "Responsive Safeguards / Echoing Deterrence (optional)"], intr: ["Disabling Shot"], cln: ["Cure / Field Aid"], brk: ["Determination / Tenacity"], mob: ["Chaff Flare / Diversion (optional)", "Hydraulic Overrides / Hold The Line", "Rocket Out / Propulsion Round (optional)"], rez: [], src: ["https://swtorista.com/articles/bounty-hunter-mercenary-arsenal-basics-guide/", "https://swtorista.com/articles/trooper-commando-gunnery-basics-guide/"] },
  { id: "innovative-ordnance-assault-specialist", ic: "Mercenary", idisc: "Innovative Ordnance", rc: "Commando", rdisc: "Assault Specialist", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Energy Shield / Reactive Shield", "Chaff Flare / Diversion (optional)", "Kolto Overload / Adrenaline Rush", "Responsive Safeguards / Echoing Deterrence (optional)"], intr: ["Disabling Shot"], cln: ["Cure / Field Aid"], brk: ["Determination / Tenacity"], mob: ["Chaff Flare / Diversion (optional)", "Hydraulic Overrides / Hold The Line", "Rocket Out / Propulsion Round (optional)"], rez: [], src: ["https://swtorista.com/articles/bounty-hunter-mercenary-innovative-ordnance-basics-guide/", "https://swtorista.com/articles/trooper-commando-assault-specialist-basics-guide/"] },
  { id: "medicine-sawbones", ic: "Operative", idisc: "Medicine", rc: "Scoundrel", rdisc: "Sawbones", role: "h", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Evasion / Dodge", "Shield Probe / Defense Screen"], intr: ["Distraction", "Jarring Strike / K.O. (optional)"], cln: ["Evasion / Dodge", "Toxin Scan / Triage"], brk: ["Escape"], mob: ["Cloaking Screen / Disappearing Act", "Exfiltrate / Scamper", "Holotraverse / Trick Move (optional)"], rez: ["Resuscitation Probe / Heartrigger Patch"], src: ["https://swtorista.com/articles/imperial-agent-operative-medicine-basics-guide/", "https://swtorista.com/articles/smuggler-scoundrel-sawbones-basics-guide/"] },
  { id: "concealment-scrapper", ic: "Operative", idisc: "Concealment", rc: "Scoundrel", rdisc: "Scrapper", role: "d", rng: "melee", dist: "Melee Range", names: "Imperial + Republic", defs: ["Evasion / Dodge", "Shield Probe / Defense Screen"], intr: ["Distraction", "Jarring Strike / K.O. (optional)"], cln: ["Evasion / Dodge", "Toxin Scan / Triage"], brk: ["Escape"], mob: ["Cloaking Screen / Disappearing Act", "Exfiltrate / Scamper", "Holotraverse / Trick Move (optional)"], rez: [], src: ["https://swtorista.com/articles/imperial-agent-operative-concealment-basics-guide/", "https://swtorista.com/articles/smuggler-scoundrel-scrapper-basics-guide/"] },
  { id: "lethality-ruffian", ic: "Operative", idisc: "Lethality", rc: "Scoundrel", rdisc: "Ruffian", role: "d", rng: "melee", dist: "Short Range", names: "Imperial + Republic", defs: ["Evasion / Dodge", "Shield Probe / Defense Screen"], intr: ["Distraction", "Jarring Strike / K.O. (optional)"], cln: ["Evasion / Dodge", "Toxin Scan / Triage"], brk: ["Escape"], mob: ["Cloaking Screen / Disappearing Act", "Exfiltrate / Scamper", "Holotraverse / Trick Move (optional)"], rez: [], src: ["https://swtorista.com/articles/imperial-agent-operative-lethality-basics-guide/", "https://swtorista.com/articles/smuggler-scoundrel-ruffian-basics-guide/"] },
  { id: "marksmanship-sharpshooter", ic: "Sniper", idisc: "Marksmanship", rc: "Gunslinger", rdisc: "Sharpshooter", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Diversion", "Entrench / Hunker Down", "Shield Probe / Defense Screen", "Ballistic Shield / Scrambling Field (optional)"], intr: ["Distraction"], cln: [], brk: ["Escape"], mob: ["Countermeasures / Surrender", "Covered Escape / Hightail It", "Hololocate / Hideout (optional)"], rez: [], src: ["https://swtorista.com/articles/imperial-agent-sniper-marksmanship-basics-guide/", "https://swtorista.com/articles/smuggler-gunslinger-sharpshooter-basics-guide/"] },
  { id: "engineering-saboteur", ic: "Sniper", idisc: "Engineering", rc: "Gunslinger", rdisc: "Saboteur", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Diversion", "Entrench / Hunker Down", "Shield Probe / Defense Screen", "Ballistic Shield / Scrambling Field (optional)"], intr: ["Distraction"], cln: [], brk: ["Escape"], mob: ["Countermeasures / Surrender", "Covered Escape / Hightail It", "Hololocate / Hideout (optional)"], rez: [], src: ["https://swtorista.com/articles/imperial-agent-sniper-engineering-basics-guide/", "https://swtorista.com/articles/smuggler-gunslinger-saboteur-basics-guide/"] },
  { id: "virulence-dirty-fighting", ic: "Sniper", idisc: "Virulence", rc: "Gunslinger", rdisc: "Dirty Fighting", role: "d", rng: "ranged", dist: "Long Range", names: "Imperial + Republic", defs: ["Diversion", "Entrench / Hunker Down", "Shield Probe / Defense Screen", "Ballistic Shield / Scrambling Field (optional)"], intr: ["Distraction"], cln: [], brk: ["Escape"], mob: ["Countermeasures / Surrender", "Covered Escape / Hightail It", "Hololocate / Hideout (optional)"], rez: [], src: ["https://swtorista.com/articles/imperial-agent-sniper-virulence-basics-guide/", "https://swtorista.com/articles/smuggler-gunslinger-dirty-fighting-basics-guide/"] },
];
const CLASS_PAIRS = DISCS.map((d: Disc) => d.ic + " / " + d.rc).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
const ROLE_WORD: Record<string, string> = { t: "Tank", h: "Healer", d: "DPS" };
const discLabel = (d: Disc) => d.idisc + " / " + d.rdisc + " – " + (d.role === "d" ? (d.rng === "melee" ? "Melee DPS" : "Ranged DPS") : ROLE_WORD[d.role]);
const dpsCat = (label: string) => /melee/i.test(label) ? "melee" : /ranged|\brange\b/i.test(label) ? "ranged" : "shared";
const LS_KEY = "swtorOpsGuide.class.v1";
// One recent kill video per boss (YouTube search, Nov 24, 2026; post-7.0 preferred, Veteran/Master preferred).
const VID: Record<string, Record<string, { t: string; s: string; h: string } | null>> = {"Pack Leader Red": {"s": {"t": "[SWTOR 6.0] SM Dxun, Pack Leader Red, 1st boss - Gunslinger DPS", "s": "YouTube · JayJay · Nov 1, 2019 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=4MIYL8fhy_s"}, "v": {"t": "Pack Leader Red (Veteran) - I have allergies, OKAY?! achievement - SWTOR", "s": "YouTube · Classic Gaming BOSS · May 4, 2025", "h": "https://www.youtube.com/watch?v=WQ5tM6uFE1s"}, "m": {"t": "Mercenary Arsenal DPS POV | Pack Leader Red Mastermode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Oct 25, 2026", "h": "https://www.youtube.com/watch?v=OGXBmNjP7Ks"}}, "Breach CI-004 (Lights Out + According to Plan)": {"s": {"t": "Swtor The Nature of Progress: Breaching CI-004 SM | PT DPS PoV | PTS kill", "s": "YouTube · Galen · Sep 26, 2019 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=w3r8-SVufv8"}, "v": {"t": "Star Wars - The Old Republic - Breaching Cl 004 in Nature of Progress (veteran)", "s": "YouTube · Classic Gaming BOSS · Mar 13, 2024", "h": "https://www.youtube.com/watch?v=FBDJUQNpfWI"}, "m": {"t": "Mercenary Arsenal DPS POV | Breach CI-004: Part 1 Mastermode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Oct 25, 2026", "h": "https://www.youtube.com/watch?v=rATlPkIwshc"}}, "Mutant Trandoshan Squad": {"s": {"t": "SWTOR Guides - Dxun Nature of Progress - Mutant Trandoshan Squad SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jun 30, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=6AIiMaMqxDw"}, "v": {"t": "Mutant Trandoshan Squad (veteran) - Star Wars: The Old Republic - DDR Guild", "s": "YouTube · Classic Gaming BOSS · May 4, 2025", "h": "https://www.youtube.com/watch?v=XBtNl0aJ5UQ"}, "m": {"t": "Mercenary Arsenal DPS POV | Mutant Trandoshan Squad Mastermode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Oct 25, 2026", "h": "https://www.youtube.com/watch?v=oXmjn_scPGw"}}, "The Huntmaster": {"s": null, "v": {"t": "SWTOR 7.2 - Dxun HM: Huntmaster (Engineering Sniper)", "s": "YouTube · PyroPilot · Jan 16, 2023", "h": "https://www.youtube.com/watch?v=tqlvYVtfGM8"}, "m": {"t": "SWTOR [7.5] 8M NiM Dxun - Huntmaster", "s": "YouTube · Natsuki · Aug 14, 2024", "h": "https://www.youtube.com/watch?v=P55ueeQhhk4"}}, "Apex Vanguard": {"s": {"t": "SWTOR Guides - Dxun Nature of Progress - Apex Vanguard SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jun 30, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=AezBuKzrG1Q"}, "v": {"t": "SWTOR Dxun Vet, Apex Vanguard, Battery Runner (7.5)", "s": "YouTube · Viejito SWTOR · Jul 13, 2024", "h": "https://www.youtube.com/watch?v=EpAJtBWhTzU"}, "m": {"t": "SWTOR 7.1 Team Blunder 8M NiM Apex Vanguard (+timer)", "s": "YouTube · Aakurb · Nov 10, 2022", "h": "https://www.youtube.com/watch?v=z_2xUwdPVJo"}}, "Tyth, God of Rage": {"s": {"t": "SWTOR Guides - Gods from the Machine - Tyth SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jul 2, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=tDWkZZwkfLU"}, "v": {"t": "SWTOR Guides - Gods from the Machine - Tyth Hard/Veteran Mode", "s": "YouTube · Merlyn SWTOR · Oct 8, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=eCcGu121vgo"}, "m": {"t": "Powertech Dps POV | Tyth Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Aug 26, 2026", "h": "https://www.youtube.com/watch?v=Dj-sqkRsfhI"}}, "Aivela & Esne": {"s": {"t": "SWTOR Guides - Gods from the Machine - Aivela & Esne SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jul 3, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=zINQweBV2Is"}, "v": {"t": "SWTOR -  Gods from the Machine 16m (HM/Veteran Mode) - Aivela & Esne - Laggy Healer POV", "s": "YouTube · plink · May 3, 2026", "h": "https://www.youtube.com/watch?v=4If9DMCbVtU"}, "m": {"t": "Powertech Dps POV | Aivela & Esne Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Aug 26, 2026", "h": "https://www.youtube.com/watch?v=Bh6pfo5f9e4"}}, "Nahut, Son of Shadow": {"s": {"t": "SWTOR Guides - Gods from the Machine - Nahut SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jul 3, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=3v_KY8IPR34"}, "v": {"t": "SWTOR -  Gods from the Machine 16m (HM/Veteran Mode) - Nahut - Laggy Healer POV", "s": "YouTube · plink · May 3, 2026", "h": "https://www.youtube.com/watch?v=mMHMFUqL79E"}, "m": {"t": "Powertech Dps POV | Nahut Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Aug 26, 2026", "h": "https://www.youtube.com/watch?v=CJ9CVphi37k"}}, "Scyva": {"s": {"t": "SWTOR Guides - Gods from the Machine - Scyva SM Video Guide", "s": "YouTube · Merlyn SWTOR · Jul 6, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=2mhKMswT3IU"}, "v": {"t": "SWTOR 7.4 Gods - Scyva HM - Tank POV (OA)", "s": "YouTube · Rey Gaming · Feb 13, 2024", "h": "https://www.youtube.com/watch?v=zAESq5xMi8g"}, "m": {"t": "Powertech Dps POV | Scyva Mastermode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Aug 27, 2026", "h": "https://www.youtube.com/watch?v=6ym-ukAxUVk"}}, "Izax": {"s": {"t": "SWTOR \"Final Boss Izax\" The Gods from the Machine 8m (Story Mode) / Tal der Maschinengötter (Story)", "s": "YouTube · Blaster Sisters · May 13, 2018 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=VEAFNPRbx0s"}, "v": {"t": "SWTOR -  Gods from the Machine 16m (HM/Veteran Mode) - Izax - Healer POV", "s": "YouTube · plink · May 3, 2026", "h": "https://www.youtube.com/watch?v=p-io8as2qCA"}, "m": {"t": "SWTOR - Gods from the Machine - Izax [Sith Marauder - Master Mode]", "s": "YouTube · Dkgray · Oct 31, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=KoKe7uxIJyw"}}, "IP-CPT": {"s": {"t": "SWTOR Guides - R-4 Anomaly - IP-CPT Story Mode Guide", "s": "YouTube · Merlyn SWTOR · Jul 7, 2022", "h": "https://www.youtube.com/watch?v=SGyVOP1Nci8"}, "v": {"t": "Swtor 7.1  R4  Anomaly  IP-CPT Veteran mode pyro dps", "s": "YouTube · Kenava · Aug 18, 2022", "h": "https://www.youtube.com/watch?v=D-mXxFnBicQ"}}, "Watchdog": {"s": {"t": "Story Mode Watchdog - R4-Anomaly [Lighting Sorc POV] | SWTOR 7.1", "s": "YouTube · Daax Plays · Sep 1, 2022", "h": "https://www.youtube.com/watch?v=uP8GhRrA8QU"}, "v": {"t": "SWTOR 7.1 | WATCHDOG VM/HM | Achievement - Perfect Polarity | MULTI POV", "s": "YouTube · Kraken · Aug 18, 2022", "h": "https://www.youtube.com/watch?v=fy2rGzOGlFM"}}, "Lord Kanoth": {"s": {"t": "SWTOR 7.1 | LORD KANOTH SM | DPS POV", "s": "YouTube · Kraken · Aug 9, 2022", "h": "https://www.youtube.com/watch?v=bFY3pHEMqPw"}, "v": {"t": "SWTOR 7.1 | LORD KANOTH VM/HM | Achievement - No Rough Edges | TANK POV", "s": "YouTube · Kraken · Sep 29, 2022", "h": "https://www.youtube.com/watch?v=hiHziVISIzE"}}, "Lady Dominique": {"s": {"t": "SWTOR [7.1] 8M SM R4 Anomaly - Lady Dominique", "s": "YouTube · Natsuki · Aug 13, 2022", "h": "https://www.youtube.com/watch?v=FejMAOSrTdQ"}, "v": {"t": "SWTOR [7.2] 8M HM R4 Anomaly - Lady Dominique", "s": "YouTube · Natsuki · Jan 12, 2023", "h": "https://www.youtube.com/watch?v=PRvqXxT7CHI"}}, "Nefra, Who Bars the Way": {"s": {"t": "STORY TIME AND NEFRA | Swtor", "s": "YouTube · TakesCooosh · May 19, 2022", "h": "https://www.youtube.com/watch?v=NXMtIG7RxmE"}, "v": {"t": "SWTOR 7.3 - Dread Fortress - 16 Man - Veteran: Nefra", "s": "YouTube · xtopolis · Sep 23, 2023", "h": "https://www.youtube.com/watch?v=JnrA0j7O3TI"}, "m": {"t": "SWTOR 7.0.1 Nim Nefra Guide for Beginners (Rakata Loot Pinata)", "s": "YouTube · Mark Biggs · Apr 16, 2022", "h": "https://www.youtube.com/watch?v=r1S3r_s3Kz4"}}, "Gate Commander Draxus": {"s": {"t": "SWTOR Dread Fortress - Gate Commander Draxus SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=XWwQILGUbCI"}, "v": {"t": "SWTOR 7.3 - Dread Fortress - 16 Man - Veteran: Gate Commander Draxus", "s": "YouTube · xtopolis · Sep 23, 2023", "h": "https://www.youtube.com/watch?v=ekS1xV_cmWI"}, "m": {"t": "Gate Commander Draxus 8M Master Mode | SWTOR", "s": "YouTube · MrBrendini · Jul 22, 2025", "h": "https://www.youtube.com/watch?v=4gF3WtIzm-o"}, "m2": {"t": "Dread Fortress - Master Mode - Draxus - Guide (fully narrated)", "s": "YouTube · Red Hoth Chilly Peppers · Jul 4, 2024 (7.5) · Room view frame source", "h": "https://www.youtube.com/watch?v=Muqfj9Ss0WU"}}, "Grob'thok, Who Feeds the Forge": {"s": {"t": "SWTOR Dread Fortress - Grob Thok | Lightning Sorcerer | Story Mode Operation", "s": "YouTube · YaiiE · Sep 20, 2021 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=EvnsVfHsNIQ"}, "v": {"t": "Grob'thok 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 18, 2025", "h": "https://www.youtube.com/watch?v=Dhcb15we2oQ"}, "m": {"t": "SWTOR 7.6 - Dread Fortress - Grob'thok tanking guide - NiM / Master Mode 8M (4K)", "s": "YouTube · Bela'vierr · Jan 28, 2025", "h": "https://www.youtube.com/watch?v=Bst3YXHBn3k"}}, "Corruptor Zero": {"s": {"t": "SWTOR Corruptor Zero - Dread Fortress Operation(8M Story Mode) Tanker View", "s": "YouTube · cohge · Jun 7, 2014 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=igO6jzivkvg"}, "v": {"t": "Corruptor Zero 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 21, 2025", "h": "https://www.youtube.com/watch?v=hJiJcuJSEuo"}, "m": {"t": "SWTOR 7.3: Schreckensfestung/Dread Fortress - Corruptor Zero - 8er Mastermode - Omerta - Tank PoV", "s": "YouTube · Omerta · Sep 19, 2023", "h": "https://www.youtube.com/watch?v=88cvBNJTTWY"}}, "Dread Council": {"s": {"t": "SWTOR Dread Palace - Dread Council SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=LYOiq7ZGd_M"}, "v": {"t": "Dread Council 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 9, 2025", "h": "https://www.youtube.com/watch?v=t_kyFnRpV8Y"}, "m": {"t": "SWTOR | The Dread Palace Master Mode (NiM) | The Dread Council", "s": "YouTube · Amethine · Jul 15, 2025", "h": "https://www.youtube.com/watch?v=Sxret9A241w"}}, "The Writhing Horror": {"s": {"t": "SWTOR - The Writhing Horror SM", "s": "YouTube · Bdan Bauer · Jan 20, 2017 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=YuMynm-yC8g"}, "v": {"t": "SWTOR 7.4 - Terror From Beyond Vet - 16M - The Writhing Horror", "s": "YouTube · xtopolis · Dec 25, 2023", "h": "https://www.youtube.com/watch?v=kaWOzsfliMI"}, "m": {"t": "SWTOR | Master Mode (Nightmare) Terror From Beyond | Writhing Horror", "s": "YouTube · Amethine · Aug 6, 2025", "h": "https://www.youtube.com/watch?v=p5KaQGWDkw4"}}, "Dread Guards (Heirad, Ciphas, Kel'sara)": {"s": {"t": "SWTOR - The Dread Guard - Terror From Beyond (8-man Story Mode)", "s": "YouTube · GrievanceGaming · Oct 4, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=w6vjuX7AbIo"}, "v": {"t": "SWTOR 7.4 - Terror From Beyond Vet - 16M - Dread Guards", "s": "YouTube · xtopolis · Dec 25, 2023", "h": "https://www.youtube.com/watch?v=hLVkBu_f_mQ"}, "m": {"t": "SWTOR - Dread Guards (Master Mode) 7.0 - Tank PoV", "s": "YouTube · Jaydenz Omega · Apr 6, 2022", "h": "https://www.youtube.com/watch?v=9LJQVun2Dls"}}, "Operator IX": {"s": {"t": "Swtor Operator 9 Terror From Beyond 16man Story Mode", "s": "YouTube · Aurllia · Oct 9, 2013 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=ISbR-PhpVSQ"}, "v": {"t": "SWTOR 7.4 - Terror From Beyond Vet - 16M - Operator IX", "s": "YouTube · xtopolis · Dec 25, 2023", "h": "https://www.youtube.com/watch?v=6qgBw3ONVFo"}, "m": {"t": "SWTOR | Master Mode (Nightmare) | Terror from Beyond | Operator IX", "s": "YouTube · Amethine · Sep 16, 2025", "h": "https://www.youtube.com/watch?v=s8F9UXK1JKQ"}}, "Kephess the Undying": {"s": {"t": "SWTOR Terror From Beyond - Kephess the Undying SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=HGptCTxEqzI"}, "v": {"t": "SWTOR 7.4 - Terror From Beyond Vet - 16M - Kephess the Undying", "s": "YouTube · xtopolis · Dec 25, 2023", "h": "https://www.youtube.com/watch?v=fT_UQpkP50M"}, "m": {"t": "Kephess the Undying 8M Master Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 3, 2025", "h": "https://www.youtube.com/watch?v=LmJHaw9sG7c"}}, "The Terror From Beyond": {"s": {"t": "SWTOR 6.2: Intro to PvE - Terror From Beyond (TFB) Story Mode Guide", "s": "YouTube · Mark Biggs · Mar 8, 2021 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=bVhm_iGpH9U"}, "v": {"t": "SWTOR - Terror from Beyond 8m Veteran Mode - Operator IX (Off-Tank PoV)", "s": "YouTube · Wookiee Whackers · May 2, 2023", "h": "https://www.youtube.com/watch?v=MI-sAD0JYWc"}, "m": {"t": "SWTOR | Terror from Beyond NiM/MM | DF Gunslinger POV [ 7.6 ]", "s": "YouTube · SWIT · May 30, 2025", "h": "https://www.youtube.com/watch?v=6YQPJQgBzdE"}}, "Dash'roode": {"s": {"t": "SWTOR Scum & Villainy - Dash'roode SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=b69uyO0GNvo"}, "v": {"t": "Dash'Roode 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Jul 29, 2025", "h": "https://www.youtube.com/watch?v=EMoLj8-Ocx0"}, "m": {"t": "SWTOR | Dash'Roode | Master Mode (Nightmare)", "s": "YouTube · Amethine · Jan 29, 2025", "h": "https://www.youtube.com/watch?v=KEnoIZUjIS8"}}, "Titan 6": {"s": {"t": "SWTOR Scum & Villainy - Titan 6 SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=F8lcz7eG2VY"}, "v": {"t": "Titan 6 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Jul 31, 2025", "h": "https://www.youtube.com/watch?v=NI2hun-Tu1w"}, "m": {"t": "SWTOR | Titan 6 Master Mode (Nightmare) Full Guide | Scum & Villainy Operation", "s": "YouTube · Amethine · Jun 16, 2025", "h": "https://www.youtube.com/watch?v=cna23Now0L8"}}, "Thrasher": {"s": {"t": "SWTOR Scum & Villainy - Thrasher SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=Br0Fa_kkdYo"}, "v": {"t": "Thrasher 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 5, 2025", "h": "https://www.youtube.com/watch?v=4U6oQZB1ork"}, "m": {"t": "Master/Nightmare THRASHER | FULL ENCOUNTER GUIDE | SWTOR | Scum & Villainy Operation", "s": "YouTube · Amethine · Mar 4, 2026", "h": "https://www.youtube.com/watch?v=qI2aWBti2JI"}}, "Operations Chief": {"s": {"t": "SWTOR Scum & Villainy - Operations Chief (Oasis City) SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=jfGvXCy80kk"}, "v": {"t": "Operations Chief 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 7, 2025", "h": "https://www.youtube.com/watch?v=KdDWRQsJEK0"}, "m": {"t": "Star Wars: The Old Republic | Master Mode (Nightmare) Scum & Villainy | Operations Chief", "s": "YouTube · Amethine · Feb 13, 2025", "h": "https://www.youtube.com/watch?v=sdYRA1bdJAM"}}, "Olok the Shadow": {"s": {"t": "SWTOR Scum & Villainy - Olok the Shadow SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=hzPgrfJiBjM"}, "v": {"t": "SWTOR - Scum & Villainy (S&V) - Olok the Shadow 8m Veteran (Hard) Mode (Sage Seer Healer PoV)", "s": "YouTube · Wookiee Whackers · Dec 31, 2023", "h": "https://www.youtube.com/watch?v=s9W1ieU867A"}, "m": {"t": "Star Wars: The Old Republic | Master Mode (Nightmare) Scum & Villainy | Olok, the Shadow", "s": "YouTube · Amethine · Feb 19, 2025", "h": "https://www.youtube.com/watch?v=ol8iuW8y0dw"}}, "Cartel Warlords": {"s": {"t": "SWTOR 7.7 - Scum & Villainy SM - Cartel Warlords boss fight - Commando Combat Medic POV, 51k HPS", "s": "YouTube · Tilik SWTOR · Jul 20, 2025", "h": "https://www.youtube.com/watch?v=JgsqbV0jxFk"}, "v": {"t": "Cartel Warlords 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 14, 2025", "h": "https://www.youtube.com/watch?v=eAEuPrT8viY"}, "m": {"t": "NiM Cartel Warlords - Balance POV #SWTOR 7.8", "s": "YouTube · Daax Plays · Jan 13, 2026", "h": "https://www.youtube.com/watch?v=cjyTai84kiQ"}}, "Malaphar the Savage": {"s": {"t": "SWTOR - Temple of Sacrifice - Malaphar the Savage 16m-SM (Heals) [KOTOO]", "s": "YouTube · Kotoo Operations · Jan 18, 2015 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=WS3HrAMllAY"}, "v": {"t": "SWTOR | Hard (Veteran) Mode Temple of Sacrifice | Malaphar the Savage Clear", "s": "YouTube · Amethine · Nov 12, 2025", "h": "https://www.youtube.com/watch?v=EquzU1WdBM0"}}, "Sword Squadron": {"s": {"t": "SWTOR Sword Squadron Unit 8 Man SM Guide", "s": "YouTube · Show Me Your Crits · Jan 20, 2015 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=OolcgO_18W0"}, "v": {"t": "SWTOR - Temple of Sacrifice 16m (HM/Veteran Mode) - Sword Squadron - Healer POV", "s": "YouTube · plink · May 11, 2026", "h": "https://www.youtube.com/watch?v=RZj_6uoOtDE"}}, "The Underlurker": {"s": {"t": "SWTOR Temple of Sacrifice - The Underlurker 16m-SM (mDPS) [KOTOO]", "s": "YouTube · Kotoo Operations · Feb 5, 2015 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=FyVNE3HnPQw"}, "v": {"t": "SWTOR 7.0 HM Underlurker Almost Destroys Queue Dodging Mechanics", "s": "YouTube · Mark Biggs · Feb 24, 2022", "h": "https://www.youtube.com/watch?v=K1y04c5Exms"}}, "Revanite Commanders": {"s": {"t": "SWTOR Temple of Sacrifice - Revanite Commanders SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 22, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=UyiY7Rwde4o"}, "v": {"t": "SWTOR - Temple of Sacrifice 16m (HM/Veteran Mode) - Revanite Commanders - Healer POV", "s": "YouTube · plink · May 11, 2026", "h": "https://www.youtube.com/watch?v=D_wnIOCuFsw"}}, "Revan": {"s": {"t": "SWTOR - Temple of Sacrifice Last boss Revan 16m SM ops", "s": "YouTube · nays · Jan 16, 2015 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=T5Dstig4oG0"}, "v": {"t": "SWTOR - Temple of Sacrifice - Revan [7.0 PTS Veteran mode]", "s": "YouTube · Dkgray · Dec 19, 2021", "h": "https://www.youtube.com/watch?v=hP-IQqdCOlU"}}, "Sparky": {"s": {"t": "SWTOR The Ravagers - Sparky 16m-SM (mDPS) [KOTOO]", "s": "YouTube · Kotoo Operations · Dec 27, 2014 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=-WZ2dEdCSsA"}, "v": {"t": "SWTOR - The Ravagers 16m (HM/Veteran Mode) - Sparky - Healer POV", "s": "YouTube · plink · May 10, 2026", "h": "https://www.youtube.com/watch?v=ByFnAVkX9io"}}, "Quartermaster Bulo": {"s": null, "v": {"t": "SWTOR | Veteran (Hard) Mode Ravagers | Quartermaster Bulo", "s": "YouTube · Amethine · Aug 18, 2025", "h": "https://www.youtube.com/watch?v=UuYpkq6I8S4"}}, "Chief Engineer Torque": {"s": {"t": "SWTOR Ravagers - Chief Engineer Torque SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=KmO7EtlYiOs"}, "v": {"t": "Hardmode Ravager Chief Engineer Torque 8man", "s": "YouTube · Snack Empire Gaming · Jun 29, 2023", "h": "https://www.youtube.com/watch?v=SU9wabKU_2U"}}, "Coratanni, Pearl and Ruugar": {"s": {"t": "SWTOR - Operation: The Ravagers - Coratanni & Rugaar (8M SM) - Sith Assassin PoV", "s": "YouTube · TheSkyWookie · May 31, 2018 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=qRsrjf6aBnQ"}, "v": {"t": "SWTOR | Veteran (Hard) Mode Ravagers | Coratanni", "s": "YouTube · Amethine · Sep 8, 2025", "h": "https://www.youtube.com/watch?v=POCuneW92BI"}}, "Annihilation Droid XRR-3": {"s": {"t": "[SWTOR] {Story Mode Eternity Vault} - Annihilation Droid XRR3 - Smuggler Healer PoV", "s": "YouTube · Gary Foster · Jun 2, 2017 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=KtRzurX-BVU"}, "v": {"t": "Annihilation Droid XRR-3 8M HM (DPS POV) - Star Wars: The Old Republic", "s": "YouTube · Argure · Jan 19, 2025", "h": "https://www.youtube.com/watch?v=MiZ0eSXdNMA"}}, "Gharj": {"s": {"t": "SWTOR - The Eternity Vault - Normal 8-man Gharj Walkthrough", "s": "YouTube · Trevor MacLeod · Feb 25, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=_jyOUzlClJQ"}, "v": {"t": "SWTOR Eternity Vault Veteran Boss Fight - Gharj. Legacy of the Sith Expansion", "s": "YouTube · YaiiE · May 17, 2022", "h": "https://www.youtube.com/watch?v=35UFe_4PAk4"}}, "Ancient Pylons": {"s": null, "v": {"t": "Ancient Pylons 8M HM (DPS POV) - Star Wars: The Old Republic", "s": "YouTube · Argure · Jan 19, 2025", "h": "https://www.youtube.com/watch?v=0Q-ToImMvwc"}}, "Infernal Council": {"s": {"t": "SWTOR Eternity Vault - Infernal Council SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=-_u7S1Xh6Zo"}, "v": {"t": "Infernal Council 8M HM (DPS POV) - Star Wars: The Old Republic", "s": "YouTube · Argure · Jan 19, 2025", "h": "https://www.youtube.com/watch?v=dCsMWc9IZoU"}}, "Soa": {"s": {"t": "SWTOR ETERNITY VAULT STORY MODE SOA", "s": "YouTube · Boteta Soahc · May 6, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=piXfXEaavGY"}, "v": {"t": "SWTOR 7.0 Madness Sorcerer: Veteran Boss Fight - Soa From Eternity Vault", "s": "YouTube · YaiiE · May 17, 2022", "h": "https://www.youtube.com/watch?v=cDVPU8CXaO4"}}, "Bonethrasher": {"s": {"t": "[Guide] SWTOR- Bonethrasher Karagga's Palace ( 8 man Story Mode)", "s": "YouTube · Reyna Sage · Jul 6, 2016 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=KK5g1HvJIeY"}, "v": {"t": "SWTOR KP HM Bonethrasher Tank Perspective", "s": "YouTube · bgray0685 · Dec 4, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=pFcmEo669uE"}}, "Jarg & Sorno": {"s": {"t": "SWtOR 5.4/ Karaggas Palace SM / Jarg and Sorno Guide", "s": "YouTube · David Shepherd (Dave) · Sep 22, 2017 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=xeZqsYeREg8"}, "v": {"t": "SWTOR Madness Sorcerer Karagga's Palace Veteran - Jarg & Sorno", "s": "YouTube · YaiiE · May 24, 2022", "h": "https://www.youtube.com/watch?v=L0sxZCrKIR0"}}, "Foreman Crusher": {"s": {"t": "SWtOR 5.4: Karaggas Palace SM/ Foreman Crusher Guide", "s": "YouTube · David Shepherd (Dave) · Sep 23, 2017 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=Hn54j1FTf0o"}, "v": {"t": "SWTOR Madness Sorcerer - Karagga's Palace Veteran: Foreman Crusher", "s": "YouTube · YaiiE · May 24, 2022", "h": "https://www.youtube.com/watch?v=zaUxW_DQ00E"}}, "G4-B3 Heavy Fabricator": {"s": {"t": "SWTOR Karagga's Palace - G4-B3 Heavy Fabricator SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=SdUKGQ_LR1Q"}, "v": {"t": "[SWTOR Guide] Karaggas Palace HM - G4-B3 Heavy Fabricator - Elite Gaming", "s": "YouTube · Thermal · Mar 10, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=thHpGhPadpg"}}, "Karagga the Unyielding": {"s": {"t": "SWTOR Karagga's Palace - Karagga the Unyielding SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=MQcVeAZ6dg8"}, "v": {"t": "SWTOR 7.0.2: Karagga the Unyielding, Boss Fight (Veteran Mode) Bounty Hunter, Innovative Ordnance", "s": "YouTube · Sovereign23-1 · Jun 6, 2022", "h": "https://www.youtube.com/watch?v=zLupGR-huqI"}}, "Zorn & Toth": {"s": {"t": "SWTOR Zorn and Toth in Denova Operation Story Mode", "s": "YouTube · Jay's Games & Tech Channel · Apr 15, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=jj7dYhk-FrU"}, "v": {"t": "Zorn and Toth 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 13, 2025", "h": "https://www.youtube.com/watch?v=QHJg0kUxESI"}, "m": {"t": "Mercenary Heal POV | Zorn & Toth Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Sep 3, 2026", "h": "https://www.youtube.com/watch?v=6vPSAmqOBI8"}}, "Firebrand & Stormcaller": {"s": {"t": "SWTOR Explosive Conflict - Firebrand & Stormcaller SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=BHrRNg--v7c"}, "v": {"t": "Firebrand and Stormcaller 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 16, 2025", "h": "https://www.youtube.com/watch?v=1QGUh8lxvN0"}, "m": {"t": "Mercenary Heal POV | Firebrand & Stormcaller Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Sep 3, 2026", "h": "https://www.youtube.com/watch?v=mcyOEdbT2uE"}}, "Colonel Vorgath": {"s": {"t": "SWTOR Explosive Conflict - Colonel Vorgath SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 23, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=Ezpy20Rcv9Q"}, "v": {"t": "Colonel Vorgath 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 19, 2025", "h": "https://www.youtube.com/watch?v=oIF8Q5fm29Y"}, "m": {"t": "Juggernaut Tank POV | Colonel Vorgath Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Nov 7, 2026", "h": "https://www.youtube.com/watch?v=1tRDTUxujLs"}}, "Warlord Kephess": {"s": {"t": "SWTOR: Warlord Kephess (8 MAN STORY MODE)", "s": "YouTube · Tim B. · Apr 18, 2012 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=dRXus1bF3bE"}, "v": {"t": "Warlord Kephess 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 22, 2025", "h": "https://www.youtube.com/watch?v=iMAsyTQUPyI"}, "m": {"t": "SWTOR 7.9 Master Mode Warlord Kephess PT Tank PoV with notes", "s": "YouTube · Dr Ace · Sep 2, 2026", "h": "https://www.youtube.com/watch?v=ZVW2BmBNssA"}}, "Golden Fury (Toborro's Courtyard)": {"s": {"t": "SWTOR - Toborro's Courtyard Golden Fury - 16m SM", "s": "YouTube · Steve M (Cyni) · Apr 23, 2014 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=MEaYNdosHus"}, "v": {"t": "SWTOR - Toborro's Courtyard/Golden Fury 8m Veteran Mode", "s": "YouTube · Wookiee Whackers · Apr 9, 2023", "h": "https://www.youtube.com/watch?v=W1JeA_Z4MYs"}}, "Colossal Monolith (Heart of Ruin)": {"s": {"t": "SWTOR Mount Drop: Covert Gateway on Colossal Monolith (Heart of Ruin) 8 man SM!!!", "s": "YouTube · NeoManger · Apr 5, 2024", "h": "https://www.youtube.com/watch?v=W21B3FjJqJg"}, "v": {"t": "SWTOR 7.6 - Monolith 8M Veteran - Tank POV Guide (4K)", "s": "YouTube · Bela'vierr · Jan 1, 2025", "h": "https://www.youtube.com/watch?v=eKPfe6lE6fw"}}, "Mutated Geonosian Queen": {"s": {"t": "SWTOR - Operation: Hive of the Mountain Queen - Mutated Geonosian Queen (16M SM) - Sith Assassin PoV", "s": "YouTube · TheSkyWookie · Mar 18, 2019 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=RHzBpeon3gI"}, "v": {"t": "SWTOR 7.6 - Hive of the Mountain Queen - 8M HM - Guidelines (4K)", "s": "YouTube · Bela'vierr · Jan 5, 2025", "h": "https://www.youtube.com/watch?v=_EJX3jnEF9I"}}, "Propagator Core XR-53": {"s": {"t": "SWTOR Relentless Replications Propagator Core XR-53 Story Mode Guide", "s": "YouTube · steeledgator · Mar 25, 2025", "h": "https://www.youtube.com/watch?v=irs6dM-R6ac"}, "v": {"t": "This TRICK Makes Killing The Ilum Lair Boss EASY | Propagator Core XR-53 HM Boss Guide | SWTOR 7.6", "s": "YouTube · Ivano 1337 · Dec 17, 2024", "h": "https://www.youtube.com/watch?v=TRoAc0GwE3g"}, "m": {"t": "Powertech Dps POV (Kite Strat) | Propagator Core XR-53 Master Mode | SWTOR 7.9", "s": "YouTube · Juicyyy_TV · Nov 5, 2026", "h": "https://www.youtube.com/watch?v=e-kwBxtN_TI"}}, "Dread Master Brontes": {"s": {"t": "SWTOR - Dread Master Brontes (16-Man Raid Story Mode) Powertech DPS", "s": "YouTube · WalkmanPlays · Apr 16, 2014 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=E5v2Qdqe9NE"}, "v": {"t": "Dread Master Brontes 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 24, 2025", "h": "https://www.youtube.com/watch?v=0R-7n87hToQ"}, "m": {"t": "Dread Master Brontes 16M Master Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 21, 2025", "h": "https://www.youtube.com/watch?v=TSt2FM4Uxis"}}, "Dread Master Bestia": {"s": {"t": "SWTOR Dread Palace - Dread Master Bestia SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=Fq9JztX0HiI"}, "v": {"t": "Dread Master Bestia 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 27, 2025", "h": "https://www.youtube.com/watch?v=k858kEU86To"}, "m": {"t": "SWTOR - The Dread Palace 16m (NiM/Master Mode) - Dread Master Bestia - Healer POV", "s": "YouTube · plink · Apr 28, 2026", "h": "https://www.youtube.com/watch?v=-pzUdO5Xc-4"}}, "Dread Master Tyrans": {"s": {"t": "SWTOR Dread Palace - Dread Master Tyrans SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=N31GnjLBLzM"}, "v": {"t": "Dread Master Tyrans 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Aug 29, 2025", "h": "https://www.youtube.com/watch?v=UygjGCeliFM"}, "m": {"t": "SWTOR | The Dread Palace Master Mode (Nightmare) | Dread Master Tyrans", "s": "YouTube · Amethine · Jun 5, 2025", "h": "https://www.youtube.com/watch?v=uJ8ez0CsRI0"}}, "Dread Master Calphayus": {"s": {"t": "SWTOR Dread Palace - Dread Master Calphayus SM Kill Video", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=Kk4dvCyrfeM"}, "v": {"t": "Dread Master Calphayus 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 2, 2025", "h": "https://www.youtube.com/watch?v=UkRtUcAVmUk"}, "m": {"t": "SWTOR | The Dread Palace Master Mode (Nightmare) | Dread Master Calphayus | Dual Portal POV", "s": "YouTube · Amethine · Jun 6, 2025", "h": "https://www.youtube.com/watch?v=BnU2-xv1PlQ"}}, "Dread Master Raptus": {"s": {"t": "SWTOR Dread Palace - Dread Master Raptus SM Kill Video (DPS PoV)", "s": "YouTube · Merlyn SWTOR · Feb 21, 2020 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=B_FhL-hW8RA"}, "v": {"t": "Dread Master Raptus 8M Veteran Mode | SWTOR", "s": "YouTube · MrBrendini · Sep 4, 2025", "h": "https://www.youtube.com/watch?v=N8ZoRGBEtGc"}, "m": {"t": "SWTOR - The Dread Palace 16m (NiM/Master Mode) - Dread Master Raptus - Healer POV", "s": "YouTube · plink · Apr 28, 2026", "h": "https://www.youtube.com/watch?v=7ttG-SShkTQ"}}, "Dread Master Styrak": {"s": {"t": "SWTOR - Dread Master Styrak - Story Mode - Templars Guild", "s": "YouTube · Starman Gaming · May 27, 2013 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=ZyihwE21zOM"}, "v": {"t": "SWTOR Boss Guide: DREAD MASTER STYRAK Hard Mode", "s": "YouTube · VULKK · Nov 26, 2015 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=yATpc-yEK6U"}, "m": {"t": "Star Wars: The Old Republic | Master Mode (Nightmare) Scum & Villainy | Dread Master Styrak", "s": "YouTube · Amethine · May 6, 2025", "h": "https://www.youtube.com/watch?v=crRVKHwYk9s"}}, "Master & Blaster": {"s": {"t": "SWTOR Bosses Guide - Master and Blaster (SM - The Ravagers)", "s": "YouTube · DBSmiley · Dec 12, 2014 · pre-7.0, flagged", "h": "https://www.youtube.com/watch?v=ZrwAVUjQ5Dg"}, "v": {"t": "SWTOR 7.6 Ravagers - Master & Blaster HM - Tank Master POV (TTO)", "s": "YouTube · Rey Gaming · Mar 30, 2025", "h": "https://www.youtube.com/watch?v=0nXxz75phqs"}}};
const S16: Record<string, string[]> = {"Infernal Council": ["Standard comp: 8m 2 tanks / 2 healers / 4 DPS; 16m 2 tanks / 4 healers / 10 DPS. Positions are the same (Merlyn)."], "Soa": ["Healers: one healer can carry 8m (two in 16m), but Merlyn recommends 2 healers in 8m and 3 in 16m because Mind Traps catch healers. Positions are the same (Merlyn)."], "Aivela & Esne": ["Opener: in 16m, 2 players stand on each Codex instead of 1, and each Codex drops 2 Polarity Modules instead of 1 (Merlyn).", "16m damage buff after the Sisters' heal looks like 200% instead of 100% (Dulfy, 2017; flagged as old and unconfirmed for 7.x)."], "Scyva": ["Comp: 8m 2 tanks / 2 healers / 4 DPS; 16m 2 tanks / 3-4 healers / 10-11 DPS. Positions are the same (Merlyn)."], "Tyth, God of Rage": ["Boss health doubles in 16m (7M vs 14M on the 2017 PTS, Dulfy); Dulfy notes 8m and 16m mechanics are otherwise identical. Old figures; 7.x numbers differ."], "Mutant Trandoshan Squad": ["16m: bring 3 tanks if you can (Merlyn says 'highly recommended', especially in Veteran); the tank split then covers more Trandoshans without DPS help. Lower overall difficulty in 16m (Merlyn)."], "The Huntmaster": ["16m: higher base damage makes the solo-tank and DPS-tank strategies much harder; Merlyn recommends 2 tanks. DPS check is easier in 16m (Merlyn)."], "Apex Vanguard": ["Each Darkness Overdrive stack adds about 15-17% boss damage in 16m Story vs 8-10% in 8m Story, so clear darkness faster in 16m (Merlyn)."], "Titan 6": ["Launch: 2 players can hide behind each rock in 16m (1 in 8m), so pair up on rocks (Merlyn)."], "Olok the Shadow": ["Tokens: each player can take one token, so in 8m everyone gets one; in 16m only half the group does (Merlyn)."], "Operator IX": ["Colors: 4 players per color in 16m (2 in 8m) and 4 Color Spheres per color phase (2 in 8m). Merlyn suggests 16m groups can give DPS every color assignment, with a ranged DPS in the middle for adds (Merlyn)."], "Dread Guards (Heirad, Ciphas, Kel'sara)": ["Kel'sara adds at 75/50/25%: 2 adds cast Mass Affliction in 16m (1 in 8m); both must die inside the 8s cast (cannot be interrupted) (Merlyn)."], "Kephess the Undying": ["Phase 1: 4 Energy Distortions in 16m (2 in 8m); Master Mode 6 in 16m (3 in 8m) (Merlyn).", "Phase 2: Corrupted Nanites hit 2 players at a time in 16m Story (1 in 8m); Master Mode 5 at a time in 16m (3 in 8m) (Merlyn).", "Orbs: 2 per end in 16m (1 in 8m) (Merlyn)."], "Firebrand & Stormcaller": ["Targeted hits 2 players at a time in 16m. Assign one healer plus a mobile DPS to stay on the ground and kite Electrical Disturbance / Targeted in 16m (one healer in 8m) (Merlyn).", "Merlyn: damage scaling makes Master Mode much harder in 16m."], "G4-B3 Heavy Fabricator": ["16m Veteran: a debuff stops anyone clicking the same panel twice, so the panel rotation needs more clickers (Merlyn)."], "Master & Blaster": ["Resonant Explosive Probes: 2 in 8m Story, 4 in 16m Story, 6 in 8m Veteran, 8 in 16m Veteran (Merlyn).", "Burn phase is usually 1-2 yellow patterns in 16m vs 2 in 8m (Dulfy, HM 2015)."], "Revanite Commanders": ["Adds: put 2 DPS on adds full time in 16m (1 in 8m) (Merlyn)."], "Sword Squadron": ["Grapple pulls the whole raid in 8m but only 8 players in 16m (Dulfy HM guide, 2015; unverified for 7.x)."], "Revan": ["Melee hits on a player who stays in front: nearly a one-shot in 8m, a one-shot in 16m Veteran (Dulfy HM guide, 2015)."], "Nefra, Who Bars the Way": ["Master Mode Twin Attack soak: at least 6 players (ideally all 8) in 8m; 13-16 players in 16m (Dulfy NiM guide, 2014)."], "Corruptor Zero": ["A player report says the Unified Beam phase started at 30% instead of 20% on 16m Veteran (Dulfy comment, unverified)."], "Colossal Monolith (Heart of Ruin)": ["Grophets: 16m Veteran is more of a healing check than a DPS check; one listed comp is 4 healers, 1 tank and 1 DPS-in-tank-stance."], "Pack Leader Red": ["16m Master Mode: Admiral Nick's Festering Wounds explosion one-shots the tank without a defensive (Merlyn)."]};
const COMP: Record<string, string> = { "8": "2 tanks, 2 healers, 4 DPS", "16": "2 tanks, 4 healers, 10 DPS (some fights want 3 tanks or 3-4 healers; see below)" };
function loadPick(): { cls: string; disc: string; role: string; dps: string } {
  try {
    const raw = typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem(LS_KEY) : null;
    if (raw) { const v = JSON.parse(raw); return { cls: String(v.cls ?? ""), disc: String(v.disc ?? ""), role: String(v.role ?? "d"), dps: String(v.dps ?? "ranged") }; }
  } catch (e) { /* storage blocked */ }
  return { cls: "", disc: "", role: "d", dps: "ranged" };
}
function savePick(v: { cls: string; disc: string; role: string; dps: string }) {
  try { if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem(LS_KEY, JSON.stringify(v)); } catch (e) { /* storage blocked */ }
}
function toolkit(boss: Boss, d: Disc, role: Role): string[] {
  const txt = [...boss.ph.flatMap((p: Ph) => [...p.tb, ...p.hb, ...p.db, p.n]), boss.sm.t, boss.sm.h, boss.sm.d, ...boss.nim].join(" ");
  const out: string[] = [];
  const sentences = txt.split(/(?<=[.!?;])\s+/);
  const needsInterrupt = sentences.some((x: string) => /interrupt/i.test(x) && !/(can't|cannot|can not|not|no|un)[ -]?(be )?interrupt/i.test(x));
  if (needsInterrupt) out.push("This fight has interrupts: yours is " + d.intr.join(", ") + ".");
  if (/cleans/i.test(txt)) out.push(d.cln.length ? "Cleansable effects come up here: your cleanse " + (d.cln.length > 1 ? "options are " : "is ") + d.cln.join(", ") + " (check in game what each removes)." : "Cleansable effects come up here: " + d.ic + "/" + d.rc + " has no cleanse in Swtorista's ability list, so leave it to healers.");
  if (/\b(kite|kiting|knock|punt|run|move|moving|leap|jump|spread|dodge|get out)\b/i.test(txt)) out.push("Movement-heavy fight: mobility, threat-drop and rescue tools: " + d.mob.join(", ") + ".");
  if (/\bstun/i.test(txt)) out.push("Stuns appear in this fight; your stun break is " + d.brk.join(", ") + " (not every boss stun can be broken).");
  if (role === "h" && d.rez.length && /(revive|rez|death|dies|died)/i.test(txt)) out.push("Combat revive: " + d.rez.join(", ") + ".");
  out.push("Defensive cooldowns to map to the big hits: " + d.defs.join(", ") + ".");
  return out;
}

const ROLE_OPTS = [{ value: "t", label: "Tank" }, { value: "h", label: "Healer" }, { value: "d", label: "DPS" }];
const MODE_LABEL: Record<string, string> = { s: "Story", v: "Veteran", m: "Master" };
const ORDER = ["ev", "ec", "gods", "hor", "hive", "kp", "rr", "sv", "tos", "tfb", "df", "dp", "nop", "r4", "rav", "toborro"];
const MAPCRED = [
  { k: "fdDP", who: "The Dread Palace (5 rooms)" },
  { k: "fdDF", who: "The Dread Fortress (5 rooms)" },
  { k: "mlEVmap", who: "Eternity Vault (5 bosses)" },
  { k: "mlNopMap", who: "The Nature Of Progress (5 bosses, incl. the Red battle-area image)" },
  { k: "mlGodsMap", who: "Gods From The Machine (5 bosses)" },
  { k: "mlRav", who: "The Ravagers (5 bosses)" },
  { k: "mlToS", who: "Temple of Sacrifice (5 bosses)" },
];

export default function App() {
  const ops = ORDER.map((id: string) => OPS.find((o: Op) => o.id === id)).filter((o): o is Op => !!o);
  const [opId, setOpId] = useState<string>("nop");
  const [bi, setBi] = useState<string>("0");
  const init = loadPick();
  const [cls, setCls] = useState<string>(init.cls);
  const [discId, setDiscId] = useState<string>(init.disc);
  const [roleSel, setRoleSel] = useState<Role>((init.role === "t" || init.role === "h" ? init.role : "d") as Role);
  const [dpsSel, setDpsSel] = useState<Rng>((init.dps === "melee" ? "melee" : "ranged") as Rng);
  const disc = DISCS.find((d: Disc) => d.id === discId && d.ic + " / " + d.rc === cls);
  const role: Role = disc ? disc.role : roleSel;
  const dt: Rng = disc ? disc.rng : dpsSel;
  const store = (c: string, d: string, r: string, p: string) => savePick({ cls: c, disc: d, role: r, dps: p });
  const clsDiscs = DISCS.filter((d: Disc) => d.ic + " / " + d.rc === cls);
  const [mode, setMode] = useState<string>("v");
  const [gsz, setGsz] = useState<string>((() => { try { return (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("swtorOpsGuide.size.v1")) === "16" ? "16" : "8"; } catch (e) { return "8"; } })());
  const pickSize = (v: string) => { setGsz(v); try { if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("swtorOpsGuide.size.v1", v); } catch (e) { /* storage blocked */ } };
  const op = ops.find((o: Op) => o.id === opId) ?? ops[0];
  const boss = op.bosses[Math.min(Number(bi), op.bosses.length - 1)];
  const md = op.md.includes(mode) ? mode : "v";
  const s16 = S16[boss.name] ?? [];
  const roleName = role === "t" ? "Tank" : role === "h" ? "Healer" : (dt === "melee" ? "Melee DPS" : "Ranged DPS");
  const kit = disc ? toolkit(boss, disc, role) : [];
  const showSorc = !!boss.sorc && (!disc || disc.ic === "Sorcerer");
  const real = ops.reduce((a: number, o: Op) => a + o.bosses.filter((b: Boss) => !!b.mp).length, 0);
  const total = ops.reduce((a: number, o: Op) => a + o.bosses.length, 0);
  const covRows = ops.map((o: Op) => [o.name, o.modes, String(o.bosses.length), o.bosses.filter((b: Boss) => !!b.mp).length + " real map / " + o.bosses.filter((b: Boss) => !b.mp).length + " traced"]);
  const smText = role === "t" ? boss.sm.t : role === "h" ? boss.sm.h : boss.sm.d;
  return (
    <Page title="SWTOR Operations: Positioning by Role" width="wide"
      summary="Pick an operation (named as in the in-game Operations Terminal), a boss, a difficulty and your role to see only your role's spots and moves, phase by phase, drawn on the real boss room where an in-game map exists. Live game: 7.9 (level 80), checked Nov 24, 2026.">
      <TableOfContents items={[{ label: "Choose a boss, mode and class", id: "pick" }, { label: "Diagrams by phase", id: "diag" }, { label: "Story / Master Mode notes", id: "mm" }, { label: "Sources for this boss", id: "bsrc" }, { label: "Classes and disciplines", id: "cls" }, { label: "Coverage", id: "cov" }, { label: "Room map credits", id: "maps" }, { label: "Key sources and patch checks", id: "src" }]} />
      <Section heading="Choose a boss, mode and class" id="pick">
        <Grid columns={2} plain>
          <Select label="Operation" options={ops.map((o: Op) => ({ value: o.id, label: o.name }))} value={op.id} onChange={(v: string) => { setOpId(v); setBi("0"); }} />
          <Select label="Boss" options={op.bosses.map((b: Boss, i: number) => ({ value: String(i), label: b.name }))} value={bi} onChange={(v: string) => setBi(v)} />
          <Segmented options={op.md.map((m: string) => ({ value: m, label: MODE_LABEL[m] }))} value={md} onChange={(v: string) => setMode(v)} />
          <Segmented options={[{ value: "8", label: "8 players" }, { value: "16", label: "16 players" }]} value={gsz} onChange={(v: string) => pickSize(v)} />
          <Select label="Your class (Imperial / Republic)" options={[{ value: "", label: "Any class: pick role myself" }, ...CLASS_PAIRS.map((c: string) => ({ value: c, label: c }))]} value={cls} onChange={(v: string) => { setCls(v); setDiscId(""); store(v, "", roleSel, dpsSel); }} />
          {cls ? <Select label="Discipline" options={[{ value: "", label: "Choose a discipline…" }, ...clsDiscs.map((d: Disc) => ({ value: d.id, label: discLabel(d) }))]} value={disc ? disc.id : ""} onChange={(v: string) => { setDiscId(v); store(cls, v, roleSel, dpsSel); }} />
            : <Segmented options={ROLE_OPTS as { value: Role; label: string }[]} value={roleSel} onChange={(v: Role) => { setRoleSel(v); store("", "", v, dpsSel); }} />}
          {!disc && role === "d" ? <Segmented options={[{ value: "melee", label: "Melee DPS" }, { value: "ranged", label: "Ranged DPS" }]} value={dpsSel} onChange={(v: Rng) => { setDpsSel(v); store(cls, discId, roleSel, v); }} /> : null}
          {cls && !disc ? <Segmented options={ROLE_OPTS as { value: Role; label: string }[]} value={roleSel} onChange={(v: Role) => { setRoleSel(v); store(cls, "", v, dpsSel); }} /> : null}
        </Grid>
        {disc ? <Callout tone="info" lead={disc.idisc + " / " + disc.rdisc + ":"}>{"Showing the " + roleName + " view. " + (role === "d" ? (dt === "melee" ? "Melee spots are diamonds and are highlighted; ranged-only spots are dimmed. " : "Ranged spots are highlighted; melee-only spots are dimmed. ") : "") + "Swtorista lists this discipline as " + disc.dist + ". Your choice is remembered on this device."}</Callout> : null}
        <Callout tone="info" lead={boss.mp ? "Drawn on the real room." : "Room map unavailable, traced layout."}>{boss.mp ? "The background is the in-game area map of this boss's room (" + boss.mp.cr + "); markers are placed on it by hand, so treat them as close, not pixel-exact." : "No in-game area map of this room could be found, so the room is redrawn from guide descriptions and is not to scale."} Each diagram shows only the {roleName} markers and arrows; the boss, adds and hazards are there for context. Positions are the same in every mode; the mode switch changes the notes. 8.0 (level 85) is not live yet; expect retuning when it lands.</Callout>
      </Section>
      <Section heading={boss.name + " – " + roleName + " view (" + MODE_LABEL[md] + ")"} id="diag">
        <Properties items={[{ label: "Operation", value: op.name }, { label: "Modes (Operations Terminal)", value: op.modes }, { label: "Room", value: boss.mp ? "Real in-game area map" : "Traced layout (no map found)" }, { label: "Verification", value: boss.conf }, { label: "Group size", value: gsz + " players: " + COMP[gsz] }]} />
        {md === "s" ? <Callout tone="info" lead={"Story Mode, " + roleName + ":"}>{smText}</Callout> : null}
        {gsz === "16" ? (s16.length ? <Callout tone="warning" lead="16-player differences for this boss:"><BulletList items={s16} /></Callout>
          : <Callout tone="info" lead="16 players:">No 8 vs 16 positioning difference for this boss was found in the guides checked, so use the same spots with 2 tanks, 4 healers and 10 DPS spread across the shared markers. Boss health and damage scale up in 16m. Unverified: check in game.</Callout>)
          : (s16.length ? <Text>{"8 players: diagrams show the 8-player layout. This boss has verified 16-player differences; switch to 16 players to see them."}</Text> : null)}
        <Legend names={[roleName + " position / move", "Boss", "Hazard or zone", "Adds and objects"]} />
        {role === "d" ? <Text>{"DPS markers: diamonds are melee-only spots, circles are ranged-only or shared spots; the other DPS type's spots are dimmed. Most guides give one DPS spot per phase, so those are shared by melee and ranged" + (dt === "melee" ? "; as melee, stay within 4m of the boss (dotted ring) unless a marker says otherwise." : "; as ranged you can stand further back in the same direction, up to 30m.")}</Text> : null}
        <Grid columns={2}>
          {boss.ph.map((p: Ph, i: number) => (
            <Section key={op.id + bi + role + i} heading={(i + 1) + ". " + p.n}>
              <Arena ph={p} role={role} boss={boss} pi={i} uid={op.id + bi + role + dt + i} dt={dt} />
              <BulletList items={role === "t" ? p.tb : role === "h" ? p.hb : p.db} />
            </Section>
          ))}
        </Grid>
        {md === "s" ? <Text>Phase bullets above are the Veteran version; Story uses the same spots with lower damage, and anything marked Veteran/VM doesn't happen in Story.</Text> : null}
        {showSorc ? <Callout lead="Sorc/Sage tip.">{boss.sorc}</Callout> : null}
        {disc ? <Section heading={"Your " + disc.ic + " / " + disc.rc + " (" + disc.idisc + " / " + disc.rdisc + ") toolkit for this boss"}>
          <BulletList items={kit} />
          <Text>{"Matched automatically: this boss's mechanics (from the sources below) against your discipline's abilities from Swtorista's " + disc.idisc + " / " + disc.rdisc + " basics guide. These are general uses of your kit, not boss-specific advice. Ability names are shown as " + (disc.names === "Imperial + Republic" ? "Imperial / Republic" : disc.names + " only (the source page for the mirror wasn't available)") + "."}</Text>
        </Section> : null}
      </Section>
      <Section heading={md === "m" ? "Master Mode (NiM) differences" : md === "s" ? "Story Mode notes, all roles" : "Story and Master Mode notes"} id="mm">
        {md !== "m" ? <BulletList items={["Tank: " + boss.sm.t, "Healer: " + boss.sm.h, "DPS: " + boss.sm.d, "Story notes come from Merlyn's Story Mode guides (Vulkk for XR-53). Where a note says 'Same as Veteran' or 'No Story-specific guide found', no role-specific Story info was found: check in game."]} /> : null}
        {md !== "s" ? <BulletList items={[...(op.md.includes("m") ? boss.nim : ["This operation has no Master Mode on the Operations Terminal."]), ...(boss.flag ?? []).map((f: string) => "Flag: " + f)]} /> : null}
      </Section>
      <Section heading="Sources for this boss" id="bsrc">
        <LinkCards links={[...boss.src, "mlSM"].map((k: string) => ({ title: SRC[k].title, site: SRC[k].site, href: SRC[k].href }))} />
        <Text>{"Kill video, " + MODE_LABEL[md] + " Mode (switch the mode above to see the others). Found by a YouTube search on boss name and mode (Story, Veteran = Hard Mode/HM, Master = Nightmare/NiM). 7.0 or later preferred; older videos are flagged. Positions were checked frame by frame only for Draxus so far."}</Text>
        {(() => { const vm = VID[boss.name] ?? {}; const list = [vm[md], vm[md + "2"]].filter((v): v is { t: string; s: string; h: string } => !!v); return list.length ? <LinkCards links={list.map((v) => ({ title: v.t, site: v.s, href: v.h }))} /> : <Callout tone="info" lead={MODE_LABEL[md] + " Mode:"}>No video found for this mode.</Callout>; })()}
      </Section>
      <Section heading="Classes and disciplines" id="cls" caption="All 24 live disciplines (7.x; 8.0 is not live). Role and range from Swtorista's basics guides (updated for 7.8). Short Range disciplines (about 10m) use the melee positions in this guide.">
        <Table columns={["Imperial", "Republic", "Role", "Positioning", "Swtorista range"]} rows={DISCS.map((d: Disc) => [d.ic + " – " + d.idisc, d.rc + " – " + d.rdisc, ROLE_WORD[d.role], d.role === "d" ? (d.rng === "melee" ? "Melee DPS" : "Ranged DPS") : (d.rng === "melee" ? "Melee (" + ROLE_WORD[d.role] + ")" : "Ranged (" + ROLE_WORD[d.role] + ")"), d.dist])} />
        <Text>Flagged: Lethality / Ruffian, Pyrotech / Plasmatech, Advanced Prototype / Tactics and the Assassin / Shadow disciplines are listed as Short Range by Swtorista; Merlyn calls Ruffian a melee DPS, so they use the melee spots here. Virulence / Dirty Fighting is Long Range (ranged).</Text>
        <LinkCards links={[{ title: "Discipline basics guides (role, range, abilities)", site: "swtorista.com", href: "https://swtorista.com/articles/smuggler-scoundrel-ruffian-basics-guide/" }, { title: "Class Guides List (7.9)", site: "vulkk.com", href: "https://vulkk.com/2022/02/23/swtor-7-0-class-guides-list/" }, { title: "Ruffian Scoundrel (melee DoT)", site: "merlynswtor.com", href: "https://sites.google.com/view/merlyn-swtor/republic/smuggler/scoundrel/ruffian-scoundrel" }]} />
      </Section>
      <Section heading="Coverage" id="cov" caption={"As of Nov 24, 2026, matching the in-game Operations Terminal list: 16 operations, " + total + " bosses; " + real + " drawn on real room maps, " + (total - real) + " on traced layouts."}>
        <Table columns={["Operation", "Modes", "Bosses", "Room diagrams"]} rows={covRows} />
        <Text>Children of Nul (8.0) is not on the live terminal yet, so it isn't covered. Lair names (Heart of Ruin = Colossal Monolith, Hive of the Mountain Queen = Mutated Geonosian Queen, Relentless Replication = Propagator Core XR-53, Toborro's Courtyard = Golden Fury) checked against the Galactic Seasons objectives and Swtorista.</Text>
      </Section>
      <Section heading="Room map credits" id="maps" caption="Room backgrounds are the game's own in-game area maps (BioWare / EA), cropped to each boss room. Copies came from these pages.">
        <Table columns={["Operation", "Map source"]} rows={MAPCRED.map((m) => [m.who, SRC[m.k].site + ": " + SRC[m.k].title])} />
        <LinkCards links={[...MAPCRED.map((m) => m.k), "idsFind"].map((k: string) => ({ title: SRC[k].title, site: SRC[k].site, href: SRC[k].href }))} />
      </Section>
      <Section heading="Key sources and patch checks" id="src">
        <Text>Ops-wide changes since the guides were written: 7.0 scaled every op to level 80 and changed several mechanics (Terminate LoS, Operator IX cores, Terror scream, Tyrans vanish); 7.0.2 made Dash'roode's sandstorm unavoidable; 7.1 reduced the health of every op encounter in every mode. Nothing in 7.2–7.9.1 patch notes changed these bosses' mechanics, as far as the notes searched show.</Text>
        <LinkCards links={["p70", "p702", "p71", "s80", "s80ls", "mlTfB", "vkNop", "idsR4", "gsLairs"].map((k: string) => ({ title: SRC[k].title, site: SRC[k].site, href: SRC[k].href }))} />
      </Section>
    </Page>
  );
}
