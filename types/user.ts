export type UserRole = "USER" | "RIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
// types/user.ts


export interface DashboardLayoutProps {
  admin: React.ReactNode;
  rider: React.ReactNode;
  sender: React.ReactNode;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRiderProfile {
  id: string;
  userId: string;
  phone: string;
  district: string;
  region: string;
  vehicle: string;
  status: "AVAILABLE" | "BUSY";
  isApproved: boolean;
  withdrawableBalance: number;
  totalEarned: number;
  appliedAt: Date;
  user?: IUser;
}