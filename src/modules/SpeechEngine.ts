export class SpeechEngine {
  private static synth: SpeechSynthesis | null = null;

  private static getSynth(): SpeechSynthesis | null {
    if (typeof window === 'undefined') return null;
    if (!SpeechEngine.synth && 'speechSynthesis' in window) {
      SpeechEngine.synth = window.speechSynthesis;
    }
    return SpeechEngine.synth;
  }

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static speak(text: string, rate: number = 0.9): void {
    const synth = SpeechEngine.getSynth();
    if (!synth) return;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW'; // Taiwan Mandarin pronunciation
    utterance.rate = rate; // Slightly slower for elementary students

    // Try to find a Mandarin voice
    const voices = synth.getVoices();
    const zhVoice = voices.find(v => v.lang === 'zh-TW' || v.lang === 'zh-CN' || v.lang.startsWith('zh'));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    synth.speak(utterance);
  }

  static stop(): void {
    const synth = SpeechEngine.getSynth();
    if (synth) {
      synth.cancel();
    }
  }
}
