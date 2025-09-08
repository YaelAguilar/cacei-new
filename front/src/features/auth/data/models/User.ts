export class User {
  constructor(
    private readonly id: string | number,
    private readonly name: string,
    private readonly lastName: string,
    private readonly secondLastName: string,
    private readonly email: string,
    private readonly phone: string,
    private readonly password: string,
    private readonly uuid?: string,
    private readonly roles?: { id: number, name: string }[],
    private readonly active?: boolean,
    private readonly created_at?: Date,
    private readonly updated_at?: Date,
    private readonly user_creation?: string,
    private readonly user_update?: string
  ) {}

  getId(): string | number { return this.id; }
  getName(): string { return this.name; }
  getLastName(): string { return this.lastName; }
  getSecondLastName(): string { return this.secondLastName; }
  getEmail(): string { return this.email; }
  getPhone(): string { return this.phone; }
  getPassword(): string { return this.password; }
  getFullName(): string {
    return `${this.name} ${this.lastName ? this.lastName + ' ' : ''}${this.secondLastName}`;
  }
  getUuid(): string | undefined { return this.uuid; }
  getRoles(): { id: number, name: string }[] | undefined { return this.roles; }
  isActive(): boolean | undefined { return this.active; }
  getCreatedAt(): Date | undefined { return this.created_at; }
  getUpdatedAt(): Date | undefined { return this.updated_at; }
  getUserCreation(): string | undefined { return this.user_creation; }
  getUserUpdate(): string | undefined { return this.user_update; }
}