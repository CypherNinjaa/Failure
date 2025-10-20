# Festival Sound Assets

## Required Sound Files

Please add the following sound files to this directory:

### 1. `firework.mp3`

- **Purpose:** Firework burst sound effect
- **Duration:** 1-2 seconds
- **Format:** MP3
- **Volume:** Should be moderate, will be adjusted to 0.3 in code
- **Recommended:** Firework explosion sound with sparkle

### 2. `welcome-bell.mp3`

- **Purpose:** Welcome modal opening sound
- **Duration:** 2-3 seconds
- **Format:** MP3
- **Volume:** Should be soft and pleasant
- **Recommended:** Temple bell or chime sound

### 3. `festive-bgm.mp3` (Optional)

- **Purpose:** Background festive music loop
- **Duration:** 30-60 seconds (loopable)
- **Format:** MP3
- **Volume:** Should be very soft
- **Recommended:** Traditional instrumental music

## Where to Find Free Sounds

1. **Freesound.org** - Free sound effects library
2. **Zapsplat.com** - Free sound effects for creative projects
3. **Mixkit.co** - Free sound effects and music
4. **Pixabay** - Free sound effects and music

## Sound Specifications

- **File format:** MP3
- **Bitrate:** 128kbps or higher
- **Sample rate:** 44.1 kHz
- **Channels:** Stereo or Mono
- **Max file size:** 500KB per file recommended

## Installation

Once you have the sound files:

1. Place them in the `public/sounds/` directory
2. Ensure file names match exactly:
   - `firework.mp3`
   - `welcome-bell.mp3`
   - `festive-bgm.mp3` (optional)
3. Restart the development server

## Testing

After adding sounds:

1. Open browser console
2. Check for audio loading errors
3. Test with sound toggle button
4. Verify volume levels are appropriate

## Notes

- Sounds are optional - the festival animations work without them
- Users can toggle sound on/off via the UI
- Sounds respect browser autoplay policies
- First user interaction may be required before sound plays
