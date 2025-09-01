'use client';

import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

interface QRCodeScannerProps {
  onScan: (result: string) => void;
  onError: (error: Error | string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          scannerRef.current?.stop();
        },
        {
          onDecodeError: (error) => {
            // This can fire frequently, so we might not want to show UI for every error.
            // console.error(error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      scannerRef.current.start().catch(err => {
          onError(err);
      });
    }

    return () => {
      scannerRef.current?.destroy();
    };
  }, [onScan, onError]);

  return (
      <div className="relative w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden shadow-lg">
        <video ref={videoRef} className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-8 border-white/50 rounded-xl pointer-events-none" />
      </div>
  );
};

export default QRCodeScanner;
