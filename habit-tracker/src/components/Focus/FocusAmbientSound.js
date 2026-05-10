let audioContext = null;
let currentNodes = {};

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

const createWhiteNoise = (ctx) => {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = buffer;
  whiteNoise.loop = true;
  
  return whiteNoise;
};

export const rain = () => {
  let ctx = null;
  let noiseSource = null;
  let filter = null;
  let gainNode = null;
  let isPlaying = false;
  
  const start = async (volume = 0.5) => {
    if (isPlaying) return;
    
    ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    noiseSource = createWhiteNoise(ctx);
    noiseSource.loop = true;
    
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    
    gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.connect(filter);
    noiseSource.start();
    
    isPlaying = true;
  };
  
  const stop = () => {
    if (!isPlaying) return;
    
    if (noiseSource) {
      noiseSource.stop();
      noiseSource.disconnect();
    }
    if (filter) filter.disconnect();
    if (gainNode) gainNode.disconnect();
    
    isPlaying = false;
  };
  
  const setVolume = (vol) => {
    if (gainNode && isPlaying) {
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    }
  };
  
  return { start, stop, setVolume };
};

export const ocean = () => {
  let ctx = null;
  let noiseSource = null;
  let filter = null;
  let gainNode = null;
  let lfo = null;
  let lfoGain = null;
  let isPlaying = false;
  
  const start = async (volume = 0.4) => {
    if (isPlaying) return;
    
    ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    noiseSource = createWhiteNoise(ctx);
    noiseSource.loop = true;
    
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 1;
    
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.connect(filter);
    
    noiseSource.start();
    lfo.start();
    
    isPlaying = true;
  };
  
  const stop = () => {
    if (!isPlaying) return;
    
    if (noiseSource) {
      noiseSource.stop();
      noiseSource.disconnect();
    }
    if (lfo) {
      lfo.stop();
      lfo.disconnect();
    }
    if (filter) filter.disconnect();
    if (gainNode) gainNode.disconnect();
    if (lfoGain) lfoGain.disconnect();
    
    isPlaying = false;
  };
  
  const setVolume = (vol) => {
    if (gainNode && isPlaying) {
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    }
  };
  
  return { start, stop, setVolume };
};

export const cafe = () => {
  let ctx = null;
  let noiseSource = null;
  let filter = null;
  let gainNode = null;
  let isPlaying = false;
  let intervalId = null;
  
  const createSpike = () => {
    if (!isPlaying || !filter) return;
    
    const spikeFreq = 500 + Math.random() * 1000;
    const spikeGain = 0.1 + Math.random() * 0.15;
    
    filter.frequency.setValueAtTime(spikeFreq, ctx.currentTime);
    filter.Q.value = 2 + Math.random() * 3;
    
    if (gainNode) {
      gainNode.gain.setValueAtTime(gainNode.gain.value + spikeGain, ctx.currentTime);
      setTimeout(() => {
        if (gainNode && isPlaying) {
          gainNode.gain.setValueAtTime(gainNode.gain.value - spikeGain, ctx.currentTime);
        }
      }, 100 + Math.random() * 200);
    }
  };
  
  const start = async (volume = 0.35) => {
    if (isPlaying) return;
    
    ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    noiseSource = createWhiteNoise(ctx);
    noiseSource.loop = true;
    
    filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    
    gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.connect(filter);
    noiseSource.start();
    
    intervalId = setInterval(createSpike, 2000 + Math.random() * 3000);
    
    isPlaying = true;
  };
  
  const stop = () => {
    if (!isPlaying) return;
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (noiseSource) {
      noiseSource.stop();
      noiseSource.disconnect();
    }
    if (filter) filter.disconnect();
    if (gainNode) gainNode.disconnect();
    
    isPlaying = false;
  };
  
  const setVolume = (vol) => {
    if (gainNode && isPlaying) {
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    }
  };
  
  return { start, stop, setVolume };
};

export const forest = () => {
  let ctx = null;
  let noiseSource = null;
  let filter = null;
  let gainNode = null;
  let isPlaying = false;
  let intervalId = null;
  
  const createChirp = () => {
    if (!isPlaying || !ctx) return;
    
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 2000 + Math.random() * 2000;
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(2000 + Math.random() * 1000, now);
    osc.frequency.exponentialRampToValueAtTime(3000 + Math.random() * 1500, now + 0.1);
    
    oscGain.gain.value = 0;
    oscGain.gain.setValueAtTime(0.05, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
  };
  
  const start = async (volume = 0.3) => {
    if (isPlaying) return;
    
    ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    noiseSource = createWhiteNoise(ctx);
    noiseSource.loop = true;
    
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.5;
    
    gainNode = ctx.createGain();
    gainNode.gain.value = volume * 0.3;
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.connect(filter);
    noiseSource.start();
    
    intervalId = setInterval(() => {
      if (Math.random() > 0.5) createChirp();
    }, 1500 + Math.random() * 2500);
    
    isPlaying = true;
  };
  
  const stop = () => {
    if (!isPlaying) return;
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (noiseSource) {
      noiseSource.stop();
      noiseSource.disconnect();
    }
    if (filter) filter.disconnect();
    if (gainNode) gainNode.disconnect();
    
    isPlaying = false;
  };
  
  const setVolume = (vol) => {
    if (gainNode && isPlaying) {
      gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    }
  };
  
  return { start, stop, setVolume };
};

export default { rain, ocean, cafe, forest };