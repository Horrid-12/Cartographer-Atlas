export interface SectorMeta {
  index: number;
  id: string;
  roman: string;
  sectorTag: string;
  coords: string;
  docket: string;
  lore: string;
  task: string;
  inkCostLabel: string;
  mapX: number;
  mapY: number;
  iconType: "bridge" | "clock" | "tower" | "river" | "cave" | "dunes";
}

export const SECTOR_METAS: SectorMeta[] = [
  {
    index: 0,
    id: "1",
    roman: "I",
    sectorTag: "SECTOR I: UNLOCKED",
    coords: "42°20'14\" N • 09°42'02\" W",
    docket: "C-1887-IV",
    lore: "Cross the forgotten span over the Whispering Chasm. Recover the Cartographer's lost brass cylinder before the evening mist engulfs the valley floor.",
    task: "Decipher Arch Inscription",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 20,
    mapY: 46,
    iconType: "bridge",
  },
  {
    index: 1,
    id: "2",
    roman: "II",
    sectorTag: "SECTOR II: MERIDIAN",
    coords: "42°22'30\" N • 09°34'18\" W",
    docket: "C-1887-V",
    lore: "Ascend the sun-bleached meridian terrace. Decode the shadow marks before the solar noon passes.",
    task: "Calibrate Meridian Sundial",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 38,
    mapY: 39,
    iconType: "clock",
  },
  {
    index: 2,
    id: "3",
    roman: "III",
    sectorTag: "SECTOR III: TOWER",
    coords: "42°19'05\" N • 09°23'45\" W",
    docket: "C-1887-VI",
    lore: "Climb the windswept promontory to the ruined watchtower. Signal the distant fleet before coastal fog rolls in.",
    task: "Ignite Promontory Beacon",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 62,
    mapY: 48,
    iconType: "tower",
  },
  {
    index: 3,
    id: "4",
    roman: "IV",
    sectorTag: "SECTOR IV: RIVER",
    coords: "42°17'12\" N • 09°32'50\" W",
    docket: "C-1887-VII",
    lore: "Search the mudbanks along the serpentine river. Unearth the rusted lockbox half-submerged in silt.",
    task: "Excavate Silt Casket",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 45,
    mapY: 54,
    iconType: "river",
  },
  {
    index: 4,
    id: "5",
    roman: "V",
    sectorTag: "SECTOR V: CAVE",
    coords: "42°26'40\" N • 09°32'10\" W",
    docket: "C-1887-VIII",
    lore: "Venture into the subterranean cavern where crystal stalactites mirror the northern constellations.",
    task: "Trace Polaris Vault",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 45,
    mapY: 29,
    iconType: "cave",
  },
  {
    index: 5,
    id: "6",
    roman: "VI",
    sectorTag: "SECTOR VI: DUNES",
    coords: "42°13'55\" N • 09°28'15\" W",
    docket: "C-1887-IX",
    lore: "Trek across the shifting dunes of the arid waste to uncover the tomb of the ancient navigator.",
    task: "Unseal Navigator Tomb",
    inkCostLabel: "Ink Required: 1 Pt",
    mapX: 55,
    mapY: 64,
    iconType: "dunes",
  },
];
