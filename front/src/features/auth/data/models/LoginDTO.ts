export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseAttributes {
  uuid: string;
  email: string;
  name: string;
  lastName: string;
  secondLastName: string;
  fullName: string;
  roles: { id: number, name: string }[];
  token: string;
}

export interface LoginResponseDTO {
  type: string;
  id: string;
  attributes: LoginResponseAttributes;
}

export interface JsonApiLoginResponse {
  data: LoginResponseDTO;
}