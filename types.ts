

export interface ValentineData {
  code: string;
  recipientName: string;
  photos: string[]; // Base64 strings or URLs
  video?: string; // Base64 string or URL
  voiceNote?: string; // Base64 string or URL
  favoriteColor: string;
  musicEnabled: boolean;
  specialDate?: {
    date: string;
    context: string;
  };
  memories?: string;
  reasons: string[];
  proposalType: 'asking' | 'wishing';
  creatorName?: string;
  createdAt: string;
}

export enum AppMode {
  CODE_ENTRY = 'CODE_ENTRY',
  CREATOR = 'CREATOR',
  RECIPIENT_EXPERIENCE = 'RECIPIENT_EXPERIENCE',
  SUCCESS = 'SUCCESS'
}
