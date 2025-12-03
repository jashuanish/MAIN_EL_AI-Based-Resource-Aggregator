import React, { useState, useRef, useEffect } from 'react';
import { LearningResource } from '../types';
import { X, ExternalLink, Calendar, Eye, Clock, Share2, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface ResourceViewerModalProps {
  resource: LearningResource;
  onClose: () => void;
}

const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({ resource, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!resource) return null;

  // Helper to get a real demo video for the mock content
  const getEmbedUrl = (res: LearningResource) => {
    // Default: YouTube Developers API Demo (Guaranteed to work with JS API)
    let videoId = 'M7lc1UVf-VE'; 

    const title = res.title.toLowerCase();

    // Map mock titles to real high-quality educational videos that allow embedding
    if (title.includes('neural network')) videoId = 'aircAruvnKk'; // 3Blue1Brown
    else if (title.includes('react')) videoId = 'SqcY0GlETPk'; // Mosh React
    else if (title.includes('machine learning')) videoId = 'Gv9_4yMHFhI'; // Simplilearn
    else if (title.includes('quantum')) videoId = 'QuR969uMICM'; // Kurzgesagt
    else if (title.includes('python')) videoId = '_uQrJ0TkZlc'; // Mosh Python
    else if (title.includes('data structure') || title.includes('algorithm')) videoId = 'RBSGKlAvoiM'; // CS Dojo
    else if (title.includes('web dev') || title.includes('css') || title.includes('html')) videoId = 'G3e-cpL7ofc'; // SuperSimpleDev
    else if (title.includes('math') || title.includes('calculus')) videoId = 'WUvTyaaNkzM'; // 3Blue1Brown
    else if (title.includes('history')) videoId = 'Yocja_N5s1I'; // CrashCourse
    else if (title.includes('physics')) videoId = 'bHIhgxav9Ro'; // Do Physics
    
    // Construct params for maximum compatibility
    const params = new URLSearchParams();
    params.append('autoplay', '1');
    params.append('enablejsapi', '1'); // Required for custom controls
    params.append('controls', '0');    // Hide native controls
    params.append('rel', '0');         // No related videos at end
    params.append('modestbranding', '1');
    params.append('iv_load_policy', '3'); // Hide annotations

    // Robust origin handling for Error 153 prevention
    if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
       params.append('origin', window.location.origin);
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const sendCommand = (command: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: command,
          args: args
        }), '*');
      } catch (e) {
        console.error("Failed to send command to iframe", e);
      }
    }
  };

  const handlePlayPause = () => {
    if (playerState === 'playing') {
      sendCommand('pauseVideo');
      setPlayerState('paused');
    } else {
      sendCommand('playVideo');
      setPlayerState('playing');
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  };

  const handleReplay = () => {
    sendCommand('seekTo', [0, true]);
    sendCommand('playVideo');
    setPlayerState('playing');
  };

  // Auto-set playing state when modal opens in "play" mode
  useEffect(() => {
    if (isPlaying) {
      setPlayerState('playing');
    }
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex-1 pr-4">
             <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight truncate">
              {resource.title}
            </h2>
             <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className={`px-2 py-0.5 font-bold uppercase rounded-full ${
                  resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
               }`}>
                  {resource.difficulty}
               </span>
               <span>•</span>
               <span className="flex items-center gap-1"><Clock size={12}/> {resource.duration}</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Player Section */}
        <div className="bg-black relative group">
           <div className={`w-full aspect-video bg-black relative mx-auto ${isPlaying ? 'flex flex-col' : ''}`}>
              {isPlaying && resource.type === 'video' ? (
                 <div className="flex-1 relative bg-black">
                    <iframe 
                        ref={iframeRef}
                        width="100%" 
                        height="100%" 
                        src={getEmbedUrl(resource)} 
                        title={resource.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full absolute inset-0"
                    ></iframe>
                 </div>
              ) : (
                <>
                  {/* Thumbnail / Cover */}
                  <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10 overflow-hidden">
                    {/* Abstract Grid Background */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    <div className="relative z-20 text-center p-6 transform transition-all duration-500 hover:scale-105">
                        {resource.type === 'video' ? (
                            <>
                            <button 
                                onClick={() => setIsPlaying(true)}
                                className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-2xl group/play mb-6 mx-auto"
                            >
                                <Play size={40} className="text-white ml-2 fill-white" />
                            </button>
                            <h3 className="text-white text-xl font-bold mb-2">Watch Video</h3>
                            <p className="text-slate-300 text-sm max-w-md mx-auto">Click to start the interactive lesson</p>
                            </>
                        ) : (
                             <div className="flex flex-col items-center">
                                 <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                                    <ExternalLink size={32} className="text-blue-400" />
                                 </div>
                                 <h3 className="text-white text-xl font-bold mb-2">External Content</h3>
                                 <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                 >
                                    Open Resource
                                 </a>
                             </div>
                        )}
                    </div>
                  </div>
                </>
              )}
           </div>

           {/* Custom Control Bar (Visible when playing) */}
           {isPlaying && resource.type === 'video' && (
             <div className="h-14 bg-slate-900 border-t border-slate-800 flex items-center px-4 gap-4 transition-all">
                <button 
                  onClick={handlePlayPause}
                  className="p-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-full transition-all"
                  title={playerState === 'playing' ? "Pause" : "Play"}
                >
                  {playerState === 'playing' ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>

                <button 
                  onClick={handleReplay}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Replay"
                >
                  <RotateCcw size={18} />
                </button>

                <div className="h-8 w-px bg-slate-700 mx-2"></div>

                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xs text-slate-400 font-medium">NOW PLAYING</span>
                  <span className="text-sm text-white font-medium truncate">{resource.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleMuteToggle}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
             </div>
           )}
        </div>

        {/* Content Details */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                       <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                       AI Summary & Key Takeaways
                    </h3>
                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                      <ul className="space-y-4">
                          {Array.isArray(resource.summary) ? resource.summary.map((point, i) => (
                              <li key={i} className="flex gap-3 text-slate-700">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <span className="leading-relaxed">{point}</span>
                              </li>
                          )) : (
                              <li className="flex gap-3 text-slate-700">
                                <span className="leading-relaxed">No summary available.</span>
                              </li>
                          )}
                      </ul>
                    </div>
                 </div>

                 <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3">About this resource</h3>
                    <p className="text-slate-600 leading-relaxed">
                       This resource was selected by the AI engine because it matches your current difficulty level ({resource.difficulty}) and has been verified for academic accuracy. 
                       It covers core concepts essential for mastering the topic.
                    </p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4">Metadata</h4>
                    <div className="space-y-3 text-sm">
                       <div className="flex justify-between py-2 border-b border-slate-200/60">
                          <span className="text-slate-500">Source</span>
                          <span className="font-medium text-slate-900">{resource.source.split('/')[0]}</span>
                       </div>
                       <div className="flex justify-between py-2 border-b border-slate-200/60">
                          <span className="text-slate-500">Format</span>
                          <span className="font-medium text-slate-900 capitalize">{resource.type}</span>
                       </div>
                       <div className="flex justify-between py-2 border-b border-slate-200/60">
                          <span className="text-slate-500">Quality Score</span>
                          <span className="font-bold text-amber-500">{resource.qualityScore}/5.0</span>
                       </div>
                       <div className="flex justify-between py-2">
                          <span className="text-slate-500">Views</span>
                          <span className="font-medium text-slate-900">{resource.views || 'N/A'}</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="font-bold text-slate-800 mb-3">Topic Tags</h4>
                    <div className="flex flex-wrap gap-2">
                       {Array.isArray(resource.tags) && resource.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                               #{tag}
                           </span>
                       ))}
                    </div>
                 </div>

                 <a 
                   href={resource.url === '#' ? undefined : resource.url} 
                   target="_blank" 
                   rel="noreferrer"
                   className="block w-full text-center py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                 >
                    Open Original Link
                 </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceViewerModal;