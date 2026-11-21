import { Suspense, lazy, useEffect, useState } from 'react';

const HeroScene = lazy(() => import('./HeroScene'));

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function Hero3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!reduced && webglAvailable());
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute right-[-14%] top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,27,38,0.12),rgba(242,237,227,0)_62%)] blur-2xl lg:right-[-2%]" />

      {enabled ? (
        <div className="absolute inset-y-0 right-[-4%] w-full opacity-95 lg:w-[46%]">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      ) : (
        <div className="absolute right-[12%] top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full border border-char/20 lg:block" />
      )}

      {/* keeps the headline legible where the sculpture meets the type */}
      <div className="absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-r from-bone via-bone/80 to-transparent lg:block" />
    </div>
  );
}
