export interface IUserModel {
    userId: number;
    name: string;
    createdAt: number;
}

export class UserModel implements IUserModel {
    get userId(): number {
        return this.userId;
    }

    set userId(value) {
        this.userId = value;
    }

    get name(): string {
        return this.name;
    }

    set name(value) {
        this.name = value;
    }

    get createdAt(): number {
        return this.createdAt;
    }

    set createdAt(value) {
        this.createdAt = value;
    } 
}
