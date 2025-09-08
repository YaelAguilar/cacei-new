export class Role {
    private _menuCount?: number;
    private _submenuCount?: number;
    private _usersCount?: number;

    constructor(
        private readonly id: string | number,
        private readonly uuid: string,
        private readonly name: string,
        private readonly description: string,
    ) {}
  
    getId(): string | number {
        return this.id;
    }

    getUuid(): string {
        return this.uuid;
    }
  
    getName(): string {
        return this.name;
    }
  
    getDescription(): string {
        return this.description;
    }

    // Getters para los conteos
    getMenuCount(): number {
        return this._menuCount || 0;
    }

    setMenuCount(count: number): void {
        this._menuCount = count;
    }

    getSubmenuCount(): number {
        return this._submenuCount || 0;
    }

    setSubmenuCount(count: number): void {
        this._submenuCount = count;
    }

    getUserCount(): number {
      return this._usersCount || 0;
    }

    setUserCount(count: number): void {
        this._usersCount = count;
    }
}