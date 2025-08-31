import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, DownloadIcon, FilmIcon, PauseIcon, PlayIcon, SpinnerIcon, TrashIcon } from './icons';

// Make TypeScript aware of JSZip from the CDN
declare var JSZip: any;

// --- SVG Icon Components ---




// --- Helper Function ---

const formatTime = (timeInSeconds: number): string => {
  const flooredTime = Math.floor(timeInSeconds);
  const minutes = Math.floor(flooredTime / 60);
  const seconds = flooredTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- Main App Component ---

const FrameCapture: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasPlayingBeforeScrub = useRef<boolean>(false);


  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoSrc(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
        video.play().catch(error => {
            console.error("Error attempting to play video:", error);
            setIsPlaying(false); // Reset state if play fails
        });
    } else {
        video.pause();
    }
  }, [isPlaying, videoSrc]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setCapturedFrames([]);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };
  
  const handleTimeUpdate = () => {
    if (!isScrubbing && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimelineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleScrubStart = () => {
    wasPlayingBeforeScrub.current = isPlaying;
    if (isPlaying) {
      setIsPlaying(false);
    }
    setIsScrubbing(true);
  };
  
  const handleScrubEnd = () => {
    if (wasPlayingBeforeScrub.current) {
      setIsPlaying(true);
    }
    setIsScrubbing(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleCaptureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedFrames(prevFrames => [...prevFrames, dataUrl]);
      }
    }
  };

  const handleDeleteFrame = (index: number) => {
    setCapturedFrames(prevFrames => prevFrames.filter((_, i) => i !== index));
  };

  const downloadFrame = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    const fileName = videoFile?.name.replace(/\.[^/.]+$/, "") || "frame";
    link.download = `${fileName}_frame_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExportAll = async () => {
    if (capturedFrames.length === 0 || isExporting) return;
    setIsExporting(true);

    try {
        const zip = new JSZip();
        const fileName = videoFile?.name.replace(/\.[^/.]+$/, "") || "frames";

        capturedFrames.forEach((frame, index) => {
            const base64Data = frame.split(',')[1];
            zip.file(`${fileName}_frame_${index + 1}.jpg`, base64Data, { base64: true });
        });

        const content = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${fileName}_frames.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Failed to create zip file", error);
        // You could add a user-facing error message here
    } finally {
        setIsExporting(false);
    }
  };


  const openFilePicker = () => {
      fileInputRef.current?.click();
  };


  const FileSelector = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FilmIcon className="w-24 h-24 text-indigo-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2 text-gray-100">Video Frame Extractor</h1>
      <p className="text-lg text-gray-400 mb-8 max-w-xl">
        Select a local video file to begin. You can then scrub through the timeline, capture frames at any point, and export them as JPEG images.
      </p>
      <button 
        onClick={openFilePicker}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
      >
        Select Video
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4 md:p-8">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
      
      {!videoSrc ? (
        <div className="flex-grow flex items-center justify-center">
            <FileSelector />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
          {/* Header and Video Info */}
          <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                  <h1 className="text-2xl font-bold truncate max-w-md" title={videoFile?.name}>{videoFile?.name}</h1>
                  <p className="text-sm text-gray-400">{videoDimensions.width} x {videoDimensions.height}</p>
              </div>
              <button 
                onClick={openFilePicker}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Change Video
              </button>
          </div>
          
          {/* Video Player */}
          <div className="w-full bg-black rounded-lg shadow-2xl overflow-hidden mb-4 aspect-video">
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlayPause}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
            />
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
            <div className="flex items-center gap-4 mb-2">
               <button onClick={togglePlayPause} className="p-1 text-white rounded-full hover:bg-gray-700 transition-colors focus:outline-none">
                 {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
               </button>
              <span className="text-sm font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onMouseDown={handleScrubStart}
                onMouseUp={handleScrubEnd}
                onInput={handleTimelineChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-mono">{formatTime(duration)}</span>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCaptureFrame}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg text-lg"
              >
                <CameraIcon className="w-6 h-6" />
                Capture Frame
              </button>
            </div>
          </div>
          
          {/* Captured Frames Gallery */}
          {capturedFrames.length > 0 && (
            <div className="flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Captured Frames ({capturedFrames.length})</h2>
                <button
                  onClick={handleExportAll}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-green-800 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <SpinnerIcon className="animate-spin w-5 h-5" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="w-5 h-5" />
                      <span>Export All as ZIP</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex-grow overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {capturedFrames.map((frame, index) => (
                    <div key={index} className="relative group aspect-video">
                      <img src={frame} alt={`Frame ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 rounded-md">
                        <button onClick={() => downloadFrame(frame, index)} className="p-2 bg-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600" title="Download">
                            <DownloadIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDeleteFrame(index)} className="p-2 bg-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Delete">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrameCapture;
