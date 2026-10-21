import math, random, struct, wave, hashlib
from pathlib import Path
from config.config import Config

STYLES = {
    'Telugu': (261.63, [0,2,4,5,7,9,11], 96),
    'Tamil': (293.66, [0,2,3,5,7,9,10], 100),
    'Hindi': (261.63, [0,2,4,7,9], 92),
    'Indian Classical': (261.63, [0,2,4,5,7,9,11], 80),
    'Japanese': (293.66, [0,2,3,7,9], 88),
    'Korean': (261.63, [0,2,4,7,9], 96),
    'Cinematic': (220.00, [0,2,3,5,7,8,10], 84),
    'Ambient': (196.00, [0,2,4,7,9], 72),
    'Latin': (261.63, [0,2,4,5,7,9,10], 112),
    'African': (220.00, [0,3,5,7,10], 118),
    'Electronic': (220.00, [0,2,4,7,9,11], 124),
    'Classical': (261.63, [0,2,4,5,7,9,11], 76),
}

def _tone(freq, seconds, sr, amp=0.18):
    n = max(1, int(seconds * sr)); out=[]
    for i in range(n):
        t=i/sr; env=min(1,t*10, max(0, (seconds-t)*5))
        sample=math.sin(2*math.pi*freq*t)*0.72 + math.sin(2*math.pi*freq*2*t)*0.18 + math.sin(2*math.pi*freq*3*t)*0.10
        out.append(sample*amp*env)
    return out

def _write_wav(path, samples, sr=22050):
    with wave.open(str(path),'wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(sr)
        frames=b''.join(struct.pack('<h', max(-32767,min(32767,int(s*32767)))) for s in samples)
        wf.writeframes(frames)

def generate_music(style='Telugu', mood='Epic', bpm=None, duration=30, seed_text='CodeAlpha'):
    style = style if style in STYLES else 'Cinematic'; root, scale, default_bpm = STYLES[style]
    bpm = int(bpm or default_bpm); duration=max(10,min(90,int(duration))); beat=60/bpm
    seed=int(hashlib.sha256(f'{style}|{mood}|{seed_text}'.encode()).hexdigest()[:8],16); rng=random.Random(seed)
    sr=22050; samples=[]; melody=[]
    steps=max(1,int(duration/beat))
    mood_bias={'Happy':2,'Calm':-1,'Epic':1,'Dark':-2,'Emotional':-1,'Energetic':2}.get(mood,0)
    for step in range(steps):
        degree=(step*2 + rng.choice([-1,0,0,1,2]) + mood_bias) % len(scale)
        octave=1 if step%8 in (0,4) else 2
        freq=root*(2**octave)*2**(scale[degree]/12)
        melody.append(freq)
    for i,freq in enumerate(melody):
        dur=beat*(1 if i%4 else 1.5); samples.extend(_tone(freq,dur,sr,0.16))
        if i%4==0:
            bass=freq/2; samples.extend(_tone(bass, min(beat,dur), sr, 0.10))
        if len(samples)>=duration*sr: break
    samples=samples[:duration*sr]
    name=f'{style.lower().replace(" ","_")}_{mood.lower()}_{seed}.wav'; path=Path(Config.GENERATED_MUSIC_FOLDER)/name
    _write_wav(path,samples,sr)
    return {'ok':True,'file':f'/generated_music/{name}','title':f'Original {style} {mood} Composition','style':style,'mood':mood,'bpm':bpm,'duration':duration}
