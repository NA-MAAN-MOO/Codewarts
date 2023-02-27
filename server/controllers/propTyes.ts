// export type Token = string;

// export interface IUserInfo {
//   userId: string;
//   userPw: string;
//   userNickname: string;
//   userBojId?: string;
//   userLeetId?: string;
// }

export type Token = string;

export interface IProbInfo {
  probId?: string;
  prob_desc?: string;
  prob_input?: string;
  prob_output?: string;
  samples?: { input: string; output: string }[];
  source?: string;
}
