/**
 * Voice Command Utility
 * Logic for parsing natural language commands after the wake word "Hey Chef"
 */

export type VoiceCommandAction = 
  | 'PLAY' 
  | 'PAUSE' 
  | 'MUTE' 
  | 'UNMUTE' 
  | 'FORWARD' 
  | 'BACKWARD' 
  | 'SPEED_1_5' 
  | 'SPEED_2' 
  | 'SPEED_NORMAL';

export const parseVoiceCommand = (text: string): VoiceCommandAction | null => {
  const cmd = text.toLowerCase().trim();

  // Play commands
  if (cmd.includes('play') || cmd.includes('start')) {
    return 'PLAY';
  }

  // Pause commands
  if (cmd.includes('pause') || cmd.includes('stop')) {
    return 'PAUSE';
  }

  // Mute commands
  if (cmd.includes('unmute')) {
    return 'UNMUTE';
  }
  if (cmd.includes('mute')) {
    return 'MUTE';
  }

  // Seeking commands
  if (cmd.includes('forward')) {
    return 'FORWARD';
  }
  if (cmd.includes('backward') || cmd.includes('rewind')) {
    return 'BACKWARD';
  }

  // Speed commands
  if (cmd.includes('speed 2') || cmd.includes('2x')) {
    return 'SPEED_2';
  }
  if (cmd.includes('speed 1.5') || cmd.includes('1.5x')) {
    return 'SPEED_1_5';
  }
  if (cmd.includes('normal speed') || cmd.includes('speed 1')) {
    return 'SPEED_NORMAL';
  }

  return null;
};
