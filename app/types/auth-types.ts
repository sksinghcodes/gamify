export interface AvailabilityIF {
  checkingUnique: boolean;
  isUnique: boolean | null;
}

export interface SignUpDataIF {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationIF {
  errorMessage: string;
  touched: boolean;
  isValid: boolean;
}

export interface SignUpValidationIF {
  username: ValidationIF;
  email: ValidationIF;
  password: ValidationIF;
  confirmPassword: ValidationIF;
}

export interface ValidationRuleIF {
  function: string;
  args?: any[];
}

export interface SignUpValidationRulesIF {
  username: ValidationRuleIF[];
  email: ValidationRuleIF[];
  password: ValidationRuleIF[];
  confirmPassword: ValidationRuleIF[];
}

export interface SignInDataIF {
  usernameOrEmail: string;
  password: string;
}

export interface SignInValidationIF {
  usernameOrEmail: ValidationIF;
  password: ValidationIF;
}

export interface SignInValidationRulesIF {
  usernameOrEmail: ValidationRuleIF[];
  password: ValidationRuleIF[];
}

export interface ResetPasswordDataIF {
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordValidationIF {
  code: ValidationIF;
  newPassword: ValidationIF;
  confirmNewPassword: ValidationIF;
}

export interface ResetPasswordValidationRulesIF {
  code: ValidationRuleIF[];
  newPassword: ValidationRuleIF[];
  confirmNewPassword: ValidationRuleIF[];
}

export interface ValidationRuleIF {
  function: string;
  args?: any[];
}
