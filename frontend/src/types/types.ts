export type User = {
  id: string;
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};

export type RivalryPopulated = {
  _id: string;
  playerA: User;
  playerB: User;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  stats: {
    playerA: {
      yellow: number;
      red: number;
    };
    playerB: {
      yellow: number;
      red: number;
    };
  };
  history?: {
    _id: string;
    type: "yellow" | "red";
    status: "active" | "converted" | "trigger-red";
    giver: User;
    receiver: User;
    createdAt: string;
    reason?: string;
  }[];
};