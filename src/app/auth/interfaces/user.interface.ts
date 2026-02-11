// interfaces/user.interface.ts
export type UserRole = 'ADMIN' | 'USER' | 'MERCHANT' | 'BUYER' | 'COURIER';

export interface UserPreferences {
    theme: string;
    notifications: boolean;
}

export interface User {
    id: number;
    bannerUrl: string;
    avatarUrl?: string;
    address: string;
    email: string;
    fullName: string;
    role: UserRole;
    preferences: UserPreferences;
    userId: number;
    phone: string;
    twoFaEnabled: boolean;
    twoFaMethod: string;
    bio: string;
}

export interface Account {
    id: number;
    merchant?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        merchantEstablishedDate: string;
        merchantType: string;
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
    buyer?: any;
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