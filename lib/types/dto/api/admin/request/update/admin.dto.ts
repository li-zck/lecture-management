export type UpdateAdminRequest = {
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
  active?: boolean;
};
