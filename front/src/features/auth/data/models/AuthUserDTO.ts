export interface AuthUserAttributes {
  uuid: string;
  email: string;
  name: string;
  lastName: string;
  secondLastName: string;
  fullName: string;
  roles: { id: number, name: string }[];
}

export interface AuthUserDTO {
  type: string;
  id: string;
  attributes: AuthUserAttributes;
}

export interface JsonApiAuthUserResponse {
  data: AuthUserDTO;
  success: boolean;
}