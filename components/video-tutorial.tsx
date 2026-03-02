'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoTutorialProps {
  onClose: () => void;
}

const TUTORIAL_VIDEOS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    duration: 45,
    description: 'Learn the basics of Decision Companion in under a minute',
    frames: [
      { time: 0, label: 'Welcome Screen', action: 'Click a template or create custom' },
      { time: 10, label: 'Choose Template', action: 'Select from popular decision types' },
      { time: 20, label: 'Customize Options', action: 'Add your specific options and criteria' },
      { time: 30, label: 'Ready to Score', action: 'Next step: rate each option' },
      { time: 45, label: 'Complete!', action: 'See your analysis results' }
    ]
  },
  {
    id: 'scoring-tutorial',
    title: 'How to Score Options',
    duration: 60,
    description: 'Understand how to properly score your options 0-10',
    frames: [
      { time: 0, label: 'Scoring Matrix', action: 'See all options and criteria' },
      { time: 15, label: 'Score 0-3', action: 'Option barely meets criterion' },
      { time: 30, label: 'Score 4-6', action: 'Option partially meets criterion' },
      { time: 45, label: 'Score 7-10', action: 'Option excellently meets criterion' },
      { time: 60, label: 'Complete!', action: 'All scores entered' }
    ]
  },
  {
    id: 'analysis-tutorial',
    title: 'Understanding Results',
    duration: 90,
    description: 'Interpret the analysis, risk assessment, and sensitivity tabs',
    frames: [
      { time: 0, label: 'Analysis Results', action: 'See weighted scores' },
      { time: 20, label: 'Risk Assessment', action: 'Identify potential problems' },
      { time: 40, label: 'Sensitivity Analysis', action: 'See impact of weight changes' },
      { time: 60, label: 'Comparison View', action: 'Compare options side-by-side' },
      { time: 90, label: 'Save & Share', action: 'Keep your decision for reference' }
    ]
  },
  {
    id: 'tips-tricks',
    title: 'Tips & Tricks',
    duration: 75,
    description: 'Pro tips for making better decisions with Decision Companion',
    frames: [
      { time: 0, label: 'Tip 1: Objective Scoring', action: 'Avoid bias in your scores' },
      { time: 15, label: 'Tip 2: Test Weights', action: 'Explore different priorities' },
      { time: 30, label: 'Tip 3: Sensitivity Check', action: 'Understand trade-offs' },
      { time: 45, label: 'Tip 4: Save Decisions', action: 'Build a decision history' },
      { time: 60, label: 'Tip 5: Iterate', action: 'Refine and re-analyze' },
      { time: 75, label: 'Success!', action: 'Make confident decisions' }
    ]
  }
];

export function VideoTutorial({ onClose }: VideoTutorialProps) {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const video = TUTORIAL_VIDEOS[selectedVideo];
  const currentFrame = video.frames.find(f => f.time <= currentTime) || video.frames[0];
  const nextFrame = video.frames[video.frames.indexOf(currentFrame) + 1];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= video.duration) {
          setIsPlaying(false);
          return video.duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, video.duration]);

  const handleTimeChange = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, video.duration)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / video.duration) * 100;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Close button */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white z-60 bg-black/50 hover:bg-black/70 p-2 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video player area */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎬</div>
            <h2 className="text-3xl font-bold text-white">{video.title}</h2>
            <div className="text-white text-lg">{currentFrame.label}</div>
            <p className="text-gray-300">{currentFrame.action}</p>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>

        {/* Controls at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
          <div className="space-y-3">
            <div className="w-full bg-gray-700 rounded-full h-2 cursor-pointer">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(video.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-black border-blue-600/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-60 bg-black/50 hover:bg-black/70 p-2 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Video player */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video display */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden group">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-600 opacity-50" />
              <div className="absolute inset-0 animate-gradient opacity-30" />

              {/* Content */}
              <div className="relative z-10 text-center space-y-4">
                <div className="text-6xl animate-bounce">🎬</div>
                <h2 className="text-2xl font-bold text-white">{video.title}</h2>
                <div className="text-white text-lg font-semibold">{currentFrame.label}</div>
                <p className="text-blue-100">{currentFrame.action}</p>

                {/* Play button overlay */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mx-auto mt-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all backdrop-blur-sm group-hover:bg-white/40"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>
              </div>

              {/* Time indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div
                className="w-full bg-gray-700 rounded-full h-1.5 cursor-pointer hover:h-2 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  handleTimeChange(percent * video.duration);
                }}
              >
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-1">{video.title}</h3>
              <p className="text-white/80 text-sm">{video.description}</p>
            </div>
          </div>

          {/* Playlist */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Tutorials</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {TUTORIAL_VIDEOS.map((vid, i) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideo(i);
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedVideo === i
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className="font-semibold text-sm">{vid.title}</div>
                  <div className="text-xs opacity-75 mt-1">{vid.duration}s • {vid.frames.length} steps</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
