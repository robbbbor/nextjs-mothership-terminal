// Configuration for text distortion effects
interface DistortionConfig {
  enabled: boolean;
  targets: {
    selector: string;
    originalText: string;
    replacementText: string;
    preserveContext?: boolean; // If true, only replace the target text within larger text
    noGlitch?: boolean; // If true, only do clean replacements without character glitches
  }[];
}

// Default configuration
const distortionConfig: DistortionConfig = {
  enabled: true, // Set to false to disable all distortion effects
  targets: [
    {
      selector: '.dialog-title',
      originalText: 'ADMIN LOGIN',
      replacementText: 'ASHLI LOGIN',
      noGlitch: true // Clean replacement without character glitches
    },
    {
      selector: '.menu-item',
      originalText: 'ADMIN',
      replacementText: 'ASHLI',
      preserveContext: true, // Only replace ADMIN within LOGIN AS ADMIN
      noGlitch: true // Clean replacement without character glitches
    },
    {
      selector: '.input-field label',
      originalText: 'USERNAME:',
      replacementText: 'IDENTITY:'
    }
  ]
};

export default distortionConfig; 