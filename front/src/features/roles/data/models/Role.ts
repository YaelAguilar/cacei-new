// role.ts
export class Role {
    name: string;
    description: string;
    id?: number;
    uuid?: string;
    active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    user_creation?: string | null;
    user_update?: string | null;

    constructor(
        name: string,
        description: string,
        id?: number,
        uuid?: string,
        active?: boolean,
        created_at?: Date,
        updated_at?: Date,
        user_creation?: string | null,
        user_update?: string | null
    ) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.active = active;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.user_creation = user_creation;
        this.user_update = user_update;
    }
}