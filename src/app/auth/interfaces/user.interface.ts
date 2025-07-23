// interfaces/user.interface.ts
export type UserRole = 'ADMIN' | 'USER' | 'FARMER' | 'RESTAURANT' | 'COURIER';

export interface UserPreferences {
    theme: string;
    notifications: boolean;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    preferences: UserPreferences;
    userId: number;
}

export interface Account {
    id: number;
    farmer?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        farmEstablishedDate: string;
        farmType: string;
        passwordHash: string;
        ssoProvider: string | null;
        ssoId: string | null;
        active: boolean;
        createdAt: string;
        updatedAt: string;
        lastLogin: string;
        language: string;
        timezone: string;
        communicationPreference: string;
        emergencyContactName: string;
        emergencyContactPhone: string;
        organicCertification: boolean;
        certificationDate: string;
        products: number[];
    };
    restaurant?: any;
    balance: number;
    availableBalance: number;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    transactions: number[];
    bankTransfers: number[];
    credits: any[];
    createdAt: string;
    updatedAt: string;
    name: string;
    accountType: string;
}