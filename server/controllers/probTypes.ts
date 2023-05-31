export type Token = string;

export interface IProbInfo {
  probId?: string;
  prob_desc?: string;
  prob_input?: string;
  prob_output?: string;
  samples?: { input: string; output: string }[];
  source?: string;
  solvedAC?: {
    problemId: number;
    titleKo: string;
    titles: [];
    isSolvable: boolean;
    isPartial: boolean;
    acceptedUserCount: number;
    level: number;
    votedUserCount: number;
    sprout: boolean;
    givesNoRating: boolean;
    isLevelLocked: boolean;
    averageTries: number;
    official: boolean;
    tags: object;
    metadata: object;
  };
}
