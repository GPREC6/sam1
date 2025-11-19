import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FaceCaptureProps {
  mode: "enroll" | "verify";
  expectedDescriptor?: number[] | null;
  onCapture?: (photoDataUrl: string, descriptor: number[]) => void;
  onVerify?: (match: boolean, distance: number, photoDataUrl: string) => void;
  className?: string;
}

const MODEL_URL = "/models";
const THRESHOLD = 0.5; // lower = stricter

const FaceCapture: React.FC<FaceCaptureProps> = ({
  mode,
  expectedDescriptor,
  onCapture,
  onVerify,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [captured, setCaptured] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        // Load models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        if (!mounted) return;
        setLoadingModels(false);

        // Request camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if (!mounted) return;
        setReady(true);
      } catch (err: any) {
        console.error("Camera/Models error:", err);
        setPermissionError(
          err?.message || "Unable to access camera. Please allow permission and try again."
        );
        setLoadingModels(false);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const detect = async (input: HTMLVideoElement | HTMLImageElement) => {
    const result = await faceapi
      .detectSingleFace(input as any, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    return result;
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Draw current frame to canvas
    const vw = videoRef.current.videoWidth || 640;
    const vh = videoRef.current.videoHeight || 480;
    canvasRef.current.width = vw;
    canvasRef.current.height = vh;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, vw, vh);

    // Run detection
    const detection = await detect(canvasRef.current as unknown as HTMLImageElement);
    if (!detection || !detection.descriptor) {
      toast({
        title: "No face detected",
        description: "Please ensure your face is clearly visible and try again.",
        variant: "destructive",
      });
      return;
    }

    const photoDataUrl = canvasRef.current.toDataURL("image/png");
    setCaptured(photoDataUrl);

    const descriptorArray = Array.from(detection.descriptor) as number[];

    if (mode === "enroll") {
      onCapture?.(photoDataUrl, descriptorArray);
      toast({ title: "Face captured", description: "Enrollment data generated." });
    } else if (mode === "verify") {
      if (!expectedDescriptor || expectedDescriptor.length === 0) {
        toast({
          title: "No reference found",
          description: "No stored face data for this user.",
          variant: "destructive",
        });
        onVerify?.(false, 1, photoDataUrl);
        return;
      }
      const distance = faceapi.euclideanDistance(expectedDescriptor, descriptorArray);
      const match = distance < THRESHOLD;
      onVerify?.(match, distance, photoDataUrl);
      toast({
        title: match ? "Face verified" : "Face mismatch",
        description: match
          ? "Welcome back!"
          : "We couldn't confirm it's you. Please retry in good lighting.",
        variant: match ? "default" : "destructive",
      });
    }
  };

  const handleRetake = () => setCaptured(null);

  return (
    <div className={className}>
      {loadingModels && (
        <div className="text-sm text-muted-foreground mb-3">Loading face models...</div>
      )}
      {permissionError && (
        <div className="text-sm text-destructive mb-3">{permissionError}</div>
      )}

      <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-identity-primary shadow-neon flex items-center justify-center bg-gradient-card backdrop-blur-sm">
        {!captured ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <img src={captured} alt="Captured" className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        {!captured ? (
          <Button onClick={handleCapture} variant="identity" size="lg" disabled={!ready}>
            {mode === "enroll" ? "Capture Photo" : "Verify Face"}
          </Button>
        ) : (
          <Button onClick={handleRetake} variant="outline" size="lg" className="border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10">
            Retake
          </Button>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
