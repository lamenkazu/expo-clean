export type AuthUserDTO = {
  id: string;
  email: string | null;
};

export type AuthSessionDTO = {
  user: AuthUserDTO;
};

export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  email: string;
  password: string;
  fullName?: string;
};

export type SignUpResultDTO = {
  needsEmailConfirmation: boolean;
};

export type ResetPasswordDTO = {
  email: string;
};
