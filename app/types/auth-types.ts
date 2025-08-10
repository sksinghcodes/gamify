export type FormFieldState<T = string> = {
  value: T;
  error: string;
  touched: boolean;
  validatingAsync?: boolean;
};

export type SignUpFormState = {
  username: FormFieldState;
  email: FormFieldState;
  password: FormFieldState;
  confirmPassword: FormFieldState;
};

export type SignInFormState = {
  usernameOrEmail: FormFieldState;
  password: FormFieldState;
};

export type PasswordResetFormState = {
  code: FormFieldState;
  newPassword: FormFieldState;
  confirmNewPassword: FormFieldState;
};

export type EmailFormState = {
  email: FormFieldState;
};

export type CodeFormState = {
  code: FormFieldState;
};

export type ApiValidationResponse<T extends Record<string, any>> = {
  data: {
    success: boolean;
    error?: string;
    confirmationCodeId?: string;
    passwordResetId?: string;
    validation?: Partial<
      Record<
        keyof T,
        {
          errorMessage: string;
          isUnique?: boolean;
        }
      >
    >;
  };
};
