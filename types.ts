export type UserRole = "student" | "teacher" | "parent" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  gradeId: string;
  classId: string;
  points: number;
  streak: number;
  achievements: string[];
  createdAt: string;
  nationalId?: string; // for student
  parentEmail?: string; // for student auto-linking with parent
  childrenNationalIds?: string[]; // for parent
  subject?: string; // for teacher
  teacherCode?: string; // for teacher
}

export interface ClassScore {
  id: string;
  name: string;
  points: number;
}

export interface LeagueTeam {
  id: string;
  ownerEmail: string;
  ownerName: string;
  teamName: string;
  division: "prep" | "secondary";
  gradeId: string;
  group: "A" | "B";
  mainPlayers: string[];
  subPlayers: string[];
  createdAt: number;
}

export interface LeagueMatch {
  id: string;
  division: "prep" | "secondary" | "super";
  stage: "groups" | "semi" | "final" | "super-final";
  groupName?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  mvpName: string;
  mvpTeamId: string;
  penaltyWinnerTeamId?: string;
  notes?: string;
  scorers: Array<{
    teamId: string;
    playerName: string;
    goals: number;
  }>;
  playedAt: number;
}

export interface LeagueVideo {
  id: string;
  title: string;
  url: string;
  kind: "هدف" | "مهارة" | "لقطة";
  addedAt: number;
  addedBy: string;
}

export interface LeagueVote {
  email: string;
  target: string;
  at: number;
}
