
export interface ValentineData {
  code: string;
  recipientName: string;
  photos: string[]; // Base64 strings
  video?: string; // Base64 string
  favoriteColor: string;
  musicEnabled: boolean;
  specialDate?: {
    date: string;
    context: string;
  };
  memories?: string;
  reasons: string[];
  creatorName?: string;
  createdAt: string;
}

export enum AppMode {
  CODE_ENTRY = 'CODE_ENTRY',
  CREATOR = 'CREATOR',
  RECIPIENT_EXPERIENCE = 'RECIPIENT_EXPERIENCE',
  SUCCESS = 'SUCCESS'
}
