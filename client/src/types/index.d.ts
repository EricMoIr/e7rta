type Hero = {
  code: string;
  grade: string;
  name: string;
  job_cd: string;
  attribute_cd: string;
};
type Option = { label: string; value: string };
type TurnOrderTable = {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
};

type HeroDTO = {
  id: string;
  artifact?: string;
  sets?: string[];
};

type DraftDTO = {
  winRate: number;
  totalGames: number;
  draft: {
    myHeroes: HeroDTO[];
    theirHeroes: HeroDTO[];
    isFirstPick: boolean;
  };
};
type BestPicksDTO = {
  drafts: DraftDTO[];
};

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
