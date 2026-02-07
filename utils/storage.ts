
import { ValentineData } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_BUCKET = 'valentine-media';

/**
 * Save a valentine to Supabase database and upload media files
 */
export const saveValentine = async (data: ValentineData): Promise<void> => {
  try {
    // 1. Insert valentine record
    const { data: valentine, error: valentineError } = await supabase
      .from('valentines')
      .insert({
        code: data.code.toUpperCase(),
        recipient_name: data.recipientName,
        creator_name: data.creatorName || null,
        favorite_color: data.favoriteColor,
        music_enabled: data.musicEnabled,
        special_date: data.specialDate || null,
        memories: data.memories || null,
        reasons: data.reasons,
      })
      .select()
      .single();

    if (valentineError) throw valentineError;
    if (!valentine) throw new Error('Failed to create valentine');

    // 2. Upload photos to storage
    const photoUploads = data.photos.map(async (base64Photo, index) => {
      const blob = base64ToBlob(base64Photo);
      const fileName = `${valentine.id}/photo-${index}-${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      // Insert media record
      const { error: mediaError } = await supabase
        .from('valentine_media')
        .insert({
          valentine_id: valentine.id,
          media_type: 'photo',
          file_path: fileName,
          file_url: urlData.publicUrl,
          display_order: index,
        });

      if (mediaError) throw mediaError;
    });

    await Promise.all(photoUploads);

    // 3. Upload video if exists
    if (data.video) {
      const blob = base64ToBlob(data.video);
      const fileName = `${valentine.id}/video-${Date.now()}.mp4`;
      
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, blob, {
          contentType: 'video/mp4',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      // Insert media record
      const { error: mediaError } = await supabase
        .from('valentine_media')
        .insert({
          valentine_id: valentine.id,
          media_type: 'video',
          file_path: fileName,
          file_url: urlData.publicUrl,
          display_order: 0,
        });

      if (mediaError) throw mediaError;
    }
  } catch (error) {
    console.error('Error saving valentine:', error);
    throw error;
  }
};

/**
 * Get a valentine by code from Supabase
 */
export const getValentine = async (code: string): Promise<ValentineData | null> => {
  try {
    // 1. Fetch valentine record
    const { data: valentine, error: valentineError } = await supabase
      .from('valentines')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (valentineError || !valentine) return null;

    // 2. Fetch associated media
    const { data: media, error: mediaError } = await supabase
      .from('valentine_media')
      .select('*')
      .eq('valentine_id', valentine.id)
      .order('display_order', { ascending: true });

    if (mediaError) throw mediaError;

    // 3. Separate photos and video
    const photos = media
      ?.filter(m => m.media_type === 'photo')
      .map(m => m.file_url || '')
      .filter(Boolean) || [];

    const videoMedia = media?.find(m => m.media_type === 'video');
    const video = videoMedia?.file_url || undefined;

    // 4. Construct ValentineData object
    return {
      code: valentine.code,
      recipientName: valentine.recipient_name,
      photos,
      video,
      favoriteColor: valentine.favorite_color,
      musicEnabled: valentine.music_enabled,
      specialDate: valentine.special_date as ValentineData['specialDate'],
      memories: valentine.memories || undefined,
      reasons: valentine.reasons,
      creatorName: valentine.creator_name || undefined,
      createdAt: valentine.created_at,
    };
  } catch (error) {
    console.error('Error fetching valentine:', error);
    return null;
  }
};

/**
 * Generate a unique 6-character code
 */
export const generateUniqueCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if code already exists
    const existing = await getValentine(code);
    isUnique = !existing;
  }

  return code;
};

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Helper: Convert base64 to Blob for upload
 */
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
