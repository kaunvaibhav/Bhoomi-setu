"use client";

import { useEffect, useRef, useCallback } from "react";

interface YouTubeWalkthroughPlayerProps {
  videoId?: string;
  className?: string;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId?: string;
          playerVars?: Record<string, any>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { target: any; data: number }) => void;
            onError?: (event: any) => void;
          };
        }
      ) => any;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
    __ytReadyCallbacks?: Array<() => void>;
    __ytApiLoading?: boolean;
  }
}

export default function YouTubeWalkthroughPlayer({
  videoId = "CEYkEoCGXN4",
  className = "",
}: YouTubeWalkthroughPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef(false);

  // Interaction & Visibility State
  const isInViewRef = useRef(false);
  const isHoveredRef = useRef(false);
  const userPausedRef = useRef(false);
  const isProgrammaticPauseRef = useRef(false);

  // Play video with sound muted (compliant with browser autoplay policy)
  const playVideoMuted = useCallback(() => {
    // 1. Try window.YT player instance
    if (playerRef.current && isPlayerReadyRef.current) {
      try {
        if (typeof playerRef.current.mute === "function") {
          playerRef.current.mute();
        }
        if (typeof playerRef.current.playVideo === "function") {
          playerRef.current.playVideo();
          return;
        }
      } catch {
        // Fall back to postMessage
      }
    }

    // 2. Fallback via iframe postMessage
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "mute", args: [] }),
          "*"
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*"
        );
      } catch {
        // Ignore cross-origin error
      }
    }
  }, []);

  // Pause video
  const pauseVideo = useCallback(() => {
    // 1. Try window.YT player instance
    if (playerRef.current && isPlayerReadyRef.current) {
      try {
        if (typeof playerRef.current.pauseVideo === "function") {
          playerRef.current.pauseVideo();
          return;
        }
      } catch {
        // Fall back to postMessage
      }
    }

    // 2. Fallback via iframe postMessage
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*"
        );
      } catch {
        // Ignore cross-origin error
      }
    }
  }, []);

  // Initialize YouTube Iframe Player API & listen for state changes
  useEffect(() => {
    let isMounted = true;

    const setupPlayer = () => {
      if (!isMounted || !iframeRef.current || playerRef.current) return;

      try {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onReady: (event: { target: any }) => {
                if (!isMounted) return;
                isPlayerReadyRef.current = true;
                // If already visible in viewport or hovered when ready, start playing muted
                if (isInViewRef.current || isHoveredRef.current) {
                  try {
                    event.target.mute();
                    event.target.playVideo();
                  } catch {
                    // Ignore
                  }
                }
              },
              onStateChange: (event: { target: any; data: number }) => {
                if (!isMounted) return;
                // 1: PLAYING, 2: PAUSED
                if (event.data === 1) {
                  userPausedRef.current = false;
                } else if (event.data === 2) {
                  // If video was paused while in view and NOT by our programmatic scroll away,
                  // mark as user-paused to respect their action.
                  if (!isProgrammaticPauseRef.current && isInViewRef.current) {
                    userPausedRef.current = true;
                  }
                }
              },
            },
          });
        }
      } catch (err) {
        console.warn("YouTube Iframe API setup note:", err);
      }
    };

    // Load YouTube API script if not loaded
    if (typeof window !== "undefined") {
      if (window.YT && window.YT.Player) {
        setupPlayer();
      } else {
        window.__ytReadyCallbacks = window.__ytReadyCallbacks || [];
        window.__ytReadyCallbacks.push(setupPlayer);

        if (!window.__ytApiLoading) {
          window.__ytApiLoading = true;
          const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
          if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.head.appendChild(script);
          }

          const prevCallback = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if (prevCallback) prevCallback();
            const callbacks = window.__ytReadyCallbacks || [];
            window.__ytReadyCallbacks = [];
            callbacks.forEach((cb) => {
              try {
                cb();
              } catch (e) {
                console.error(e);
              }
            });
          };
        }
      }
    }

    // Global postMessage listener as fallback / extra event channel
    const handleWindowMessage = (e: MessageEvent) => {
      if (!isMounted) return;
      try {
        if (typeof e.data === "string") {
          const parsed = JSON.parse(e.data);
          // YouTube postMessage event structure
          if (
            parsed.event === "onStateChange" ||
            (parsed.event === "infoDelivery" && parsed.info?.playerState !== undefined)
          ) {
            const state = parsed.info?.playerState ?? parsed.info;
            if (state === 1) {
              userPausedRef.current = false;
            } else if (state === 2) {
              if (!isProgrammaticPauseRef.current && isInViewRef.current) {
                userPausedRef.current = true;
              }
            }
          }
        }
      } catch {
        // Not a JSON message or not from YouTube
      }
    };

    window.addEventListener("message", handleWindowMessage);

    return () => {
      isMounted = false;
      window.removeEventListener("message", handleWindowMessage);

      // Clean up callback queue
      if (window.__ytReadyCallbacks) {
        window.__ytReadyCallbacks = window.__ytReadyCallbacks.filter((cb) => cb !== setupPlayer);
      }

      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore destruction errors on unmount
        }
      }
      playerRef.current = null;
      isPlayerReadyRef.current = false;
    };
  }, []);

  // IntersectionObserver for auto-play when entering view & auto-pause when leaving
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    // Threshold of ~50-60% visibility
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const isSufficientlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;

        if (isSufficientlyVisible) {
          isInViewRef.current = true;
          // When scrolling into view, reset manual pause and autoplay muted
          userPausedRef.current = false;
          playVideoMuted();
        } else {
          isInViewRef.current = false;
          // Mark programmatic pause so onStateChange doesn't treat it as user manual pause
          isProgrammaticPauseRef.current = true;
          pauseVideo();
          // Reset userPaused flag when scrolled away so when returned, autoplay resumes
          userPausedRef.current = false;
          const timer = setTimeout(() => {
            isProgrammaticPauseRef.current = false;
          }, 600);
          return () => clearTimeout(timer);
        }
      },
      {
        threshold: [0, 0.25, 0.55, 0.75, 1.0],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [playVideoMuted, pauseVideo]);

  // Autoplay on hover (if not manually paused by the user)
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!userPausedRef.current) {
      playVideoMuted();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // If not visible in the viewport threshold, pause
    if (!isInViewRef.current) {
      isProgrammaticPauseRef.current = true;
      pauseVideo();
      setTimeout(() => {
        isProgrammaticPauseRef.current = false;
      }, 600);
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1`;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`aspect-video bg-[#0F1D38] rounded-2xl relative overflow-hidden shadow-card border border-gray-200/80 group ${className}`}
      style={{ transform: "translateZ(0)" }}
    >
      <iframe
        id="bhoomisetu-walkthrough-player"
        ref={iframeRef}
        src={embedUrl}
        title="BhoomiSetu Prototype Walkthrough - Smart India Hackathon 2026"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full absolute inset-0 border-0 rounded-2xl"
      />
    </div>
  );
}
