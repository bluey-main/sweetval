/**
 * Video processing utilities for trimming videos to 30 seconds
 */

/**
 * Trim a video file to 30 seconds using HTML5 video element and canvas
 * @param file - The video file to trim
 * @returns Promise<Blob> - The trimmed video as a Blob
 */
export const trimVideoTo30Seconds = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = async () => {
      URL.revokeObjectURL(video.src);
      
      const duration = video.duration;
      
      // If video is already 30 seconds or less, return original file
      if (duration <= 30) {
        resolve(file);
        return;
      }

      // Use MediaRecorder to trim video
      try {
        const stream = (video as any).captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
        });

        const chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const trimmedBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(trimmedBlob);
        };

        mediaRecorder.onerror = (error) => {
          reject(error);
        };

        // Start recording
        mediaRecorder.start();
        video.currentTime = 0;
        video.play();

        // Stop after 30 seconds
        setTimeout(() => {
          video.pause();
          mediaRecorder.stop();
        }, 30000);

      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Get video duration in seconds
 * @param file - The video file
 * @returns Promise<number> - Duration in seconds
 */
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Convert Blob to base64 string
 * @param blob - The blob to convert
 * @returns Promise<string> - Base64 encoded string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
