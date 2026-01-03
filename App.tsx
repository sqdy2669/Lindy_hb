
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Cake from './components/Cake';
import FireworkCanvas, { FireworkHandle } from './components/FireworkCanvas';
import { generateBirthdayWish } from './services/geminiService';
import { GestureState } from './types';

// Declaration for MediaPipe which is loaded via script tag
declare const Hands: any;
declare const Camera: any;

const App: React.FC = () => {
  const [isLit, setIsLit] = useState(false);
  const [wish, setWish] = useState<string | null>(null);
  const [gesture, setGesture] = useState<GestureState>(GestureState.NONE);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fireworkRef = useRef<FireworkHandle>(null);
  const lastGestureRef = useRef<GestureState>(GestureState.NONE);
  const lastPalmXRef = useRef<number | null>(null);
  const waveCooldownRef = useRef<number>(0);

  const initTracking = useCallback(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        const isFist = [8, 12, 16, 20].every(tip => landmarks[tip].y > landmarks[tip - 2].y);
        const isPalm = [8, 12, 16, 20].every(tip => landmarks[tip].y < landmarks[tip - 2].y);

        let currentGesture = GestureState.NONE;
        if (isFist) currentGesture = GestureState.FIST;
        else if (isPalm) currentGesture = GestureState.PALM;

        setGesture(currentGesture);

        // 1. Light candles: Fist -> Palm
        if (lastGestureRef.current === GestureState.FIST && currentGesture === GestureState.PALM) {
          setIsLit(true);
        }

        // 2. Waving Palm -> Fireworks
        if (currentGesture === GestureState.PALM) {
          const currentX = landmarks[9].x;
          if (lastPalmXRef.current !== null) {
            const delta = Math.abs(currentX - lastPalmXRef.current);
            if (delta > 0.08 && Date.now() > waveCooldownRef.current) {
              fireworkRef.current?.launch(window.innerWidth * (1 - currentX));
              waveCooldownRef.current = Date.now() + 600;
            }
          }
          lastPalmXRef.current = currentX;
        } else {
          lastPalmXRef.current = null;
        }

        lastGestureRef.current = currentGesture;
      } else {
        setGesture(GestureState.NONE);
        lastPalmXRef.current = null;
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });
    camera.start().then(() => setCameraActive(true));
  }, []);

  useEffect(() => {
    const startApp = async () => {
      initTracking();
      const generatedWish = await generateBirthdayWish("朋友");
      setWish(generatedWish);
    };
    startApp();
  }, [initTracking]);

  const getGestureText = (g: GestureState) => {
    switch(g) {
      case GestureState.FIST: return '握拳';
      case GestureState.PALM: return '手掌';
      default: return '识别中...';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-black -z-20" />
      <div className="fixed inset-0 opacity-10 pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <>
        {/* Header */}
        <div className="absolute top-12 text-center animate-in slide-in-from-top duration-1000 px-4 w-full">
           <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-200 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl mb-4">
             生日快乐！
           </h2>
           {wish ? (
             <p className="text-pink-100 italic text-lg md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-pulse">
               「 {wish} 」
             </p>
           ) : (
             <div className="h-8 flex items-center justify-center space-x-2">
               <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
               <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100" />
               <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
             </div>
           )}
        </div>

        {/* Main Display */}
        <div className="mt-24 z-10">
          <Cake isLit={isLit} />
        </div>

        {/* Instructions Overlay */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/10 flex items-center space-x-8 z-40 shadow-2xl">
          <div className={`flex flex-col items-center transition-all duration-500 ${isLit ? 'opacity-40 blur-[0.5px]' : 'opacity-100'}`}>
            <span className="text-[10px] tracking-widest uppercase text-pink-400 font-bold mb-1">步骤 1</span>
            <span className="text-sm md:text-base font-medium text-white flex items-center">
              <span className="text-xl mr-2">✊→✋</span> 握拳变掌点燃蜡烛
            </span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className={`flex flex-col items-center transition-all duration-500 ${!isLit ? 'opacity-40 blur-[0.5px]' : 'opacity-100'}`}>
            <span className="text-[10px] tracking-widest uppercase text-indigo-400 font-bold mb-1">步骤 2</span>
            <span className="text-sm md:text-base font-medium text-white flex items-center">
              <span className="text-xl mr-2">👋</span> 左右挥动手掌发射烟花
            </span>
          </div>
        </div>

        {/* Camera Feed Container */}
        <div className="fixed bottom-6 right-6 group">
          <div className="w-44 h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative transition-transform duration-300 group-hover:scale-105">
            <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay playsInline muted />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-bold text-white drop-shadow-md">
                {getGestureText(gesture)}
              </span>
            </div>
          </div>
        </div>

        <FireworkCanvas ref={fireworkRef} />
      </>
    </div>
  );
};

export default App;
