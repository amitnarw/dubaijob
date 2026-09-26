import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
  BackHandler,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Colors, Radii } from '@/constants/theme';
import { AnimatedPressableScale } from '@/constants/animations';

interface CustomVideoPlayerProps {
  videoId: string;
  thumbnailUri?: string;
  title?: string;
  stepNumber?: number;
  totalSteps?: number;
  durationString?: string;
  locked?: boolean;
  onEnded?: () => void;
  onUnlockPress?: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  onBack?: () => void;
}

const SPEEDS = [1.0, 1.25, 1.5, 2.0];
const DOUBLE_TAP_WINDOW = 320;
const SCRIM_TOP = 64;
const SCRIM_BOTTOM = 56;

// Stream/embed layer scale: cover the visible box and hide all sides where YouTube chrome can leak
const CROP_SCALE = 1.45;

function formatTime(seconds: number): string {
  const sec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function parseDurationString(str?: string): number {
  if (!str) return 0;
  const parts = str.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Hard-blank YouTube embed UI: hide EVERY block YouTube renders at any moment (play, pause, end, hover)
const INJECTED_CLEANER_JS = `
(function() {
  var css = \`
    html, body {
      background-color: #000000 !important;
      margin: 0 !important; padding: 0 !important;
      width: 100% !important; height: 100% !important;
      overflow: hidden !important;
      user-select: none !important; -webkit-user-select: none !important;
    }
    video, #player video {
      width: 100% !important; height: 100% !important;
      object-fit: cover !important;
      background-color: #000 !important;
    }
    .ytp-chrome-top, .ytp-chrome-bottom, .ytp-watermark, .ytp-pause-overlay,
    .ytp-gradient-top, .ytp-gradient-bottom, .ytp-large-play-button,
    .ytp-contextmenu, .ytp-show-cards-title, .ytp-title-channel,
    .ytp-share-button, .ytp-expand-pause-overlay, .ytp-button,
    .ytp-paid-content-overlay, .ytp-endscreen-content, .ytp-ce-element,
    .ytp-endscreen-previous, .ytp-endscreen-next, .ytp-endscreen-playlist,
    .ytp-suggestion-set, .ytp-endscreen-video, .ytp-featured-bar,
    .ytp-videowall-still, .ytp-spinner, .ytp-bezel, .ytp-tooltip,
    .ytp-popup, .ytp-fullerscreen-edu, .ytp-fullscreen-button,
    .ytp-right-controls, .ytp-left-controls, .ytp-progress-bar,
    .ytp-iv-video-content, .ytp-iv-player-content, .iv-branding,
    .ytp-notice-content, .ytp-notice-image, .ytp-notice-text,
    .ytp-cards-teaser, .ytp-cards-button, .ytp-impression-link,
    a.ytp-title-link, .ytp-title, .ytp-title-text, .ytp-title-channel-logo,
    .ytp-chrome-controls, .ytp-time-display, .ytp-duration, .ytp-time-current,
    .ytp-clear-pic, .ytp-mute-button {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      width: 0 !important; height: 0 !important;
    }
  \`;
  var s = document.createElement('style');
  s.id = '__yt_block__';
  if (!document.getElementById('__yt_block__')) document.head.appendChild(s).innerHTML = css;

  // Continually strip any YouTube chrome that re-appears on pause/end/hover
  var badSelectors = [
    '.ytp-chrome-top','.ytp-chrome-bottom','.ytp-watermark','.ytp-pause-overlay',
    '.ytp-gradient-top','.ytp-gradient-bottom','.ytp-large-play-button',
    '.ytp-contextmenu','.ytp-share-button','.ytp-title','.ytp-title-text',
    '.ytp-title-channel-logo','.ytp-endscreen-content','.ytp-ce-element',
    '.ytp-videowall-still','.ytp-cards-teaser','.ytp-cards-button',
    '.ytp-fullerscreen-edu','.ytp-fullscreen-button','.ytp-progress-bar',
    '.ytp-right-controls','.ytp-left-controls','.ytp-time-display',
    '.iv-branding','.ytp-notice-content','.ytp-featured-bar','.ytp-bezel',
    '.ytp-tooltip','.ytp-popup','.ytp-button'
  ].join(',');
  setInterval(function() {
    try {
      var nodes = document.querySelectorAll(badSelectors);
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] && nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
      }
      var v = document.querySelector('video');
      if (v && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'timeUpdate',
          currentTime: v.currentTime || 0,
          duration: v.duration || 0,
          paused: v.paused,
          ended: v.ended,
          readyState: v.readyState || 0
        }));
      }
    } catch(e) {}
  }, 250);
  true;
})();
`;

interface RippleProps {
  side: 'left' | 'right';
  label: string;
  show: boolean;
}

const Ripple: React.FC<RippleProps> = ({ side, label, show }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (show) {
      opacity.value = 1;
      scale.value = 0.6;
      opacity.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(1.6, { duration: 700, easing: Easing.out(Easing.quad) });
    }
  }, [show, opacity, scale]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!show) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.rippleWrap,
        side === 'left' ? styles.rippleLeft : styles.rippleRight,
        wrapStyle,
      ]}
    >
      <View style={styles.rippleCircle} />
      <Text style={styles.rippleText}>{label}</Text>
    </Animated.View>
  );
};

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoId,
  thumbnailUri,
  title,
  stepNumber,
  totalSteps = 25,
  durationString,
  locked = false,
  onEnded,
  onUnlockPress,
  onNextLesson,
  onPrevLesson,
  onBack,
}) => {
  const webViewRef = useRef<WebView>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  const initialDuration = useMemo(() => parseDurationString(durationString), [durationString]);

  const [boxWidth, setBoxWidth] = useState(Dimensions.get('window').width);
  const inlinePlayerHeight = Math.round((boxWidth * 9) / 16);
  const cropW = Math.round(boxWidth * CROP_SCALE);
  const cropH = Math.round(inlinePlayerHeight * CROP_SCALE);
  const cropTop = -Math.round((cropH - inlinePlayerHeight) * 0.5);
  const cropLeft = -Math.round((cropW - boxWidth) * 0.5);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const [rippleLeft, setRippleLeft] = useState(false);
  const [rippleRight, setRippleRight] = useState(false);

  const embedUri = useMemo(
    () =>
      `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1`,
    [videoId],
  );

  const enterFullscreen = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } catch {}
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch {}
    setIsFullscreen(false);
  }, []);

  // Reset state on lesson change
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setHasStarted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(parseDurationString(durationString));
    setBuffering(false);
    setRippleLeft(false);
    setRippleRight(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [videoId, durationString]);

  // Auto-hide controls after 3.5s of playback
  const resetHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying && !isScrubbing) {
      hideTimer.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  }, [isPlaying, isScrubbing]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  // Android hardware back button: exit fullscreen first
  useEffect(() => {
    if (!isFullscreen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      exitFullscreen();
      return true;
    });
    return () => sub.remove();
  }, [isFullscreen, exitFullscreen]);

  // Reset orientation on unmount
  useEffect(() => {
    return () => {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch {}
    };
  }, []);

  const togglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
      setBuffering(true);
      resetHideTimer();
      return;
    }
    if (isPlaying) {
      webViewRef.current?.injectJavaScript(
        "var v=document.querySelector('video'); if(v){v.pause();} true;",
      );
      setIsPlaying(false);
      setControlsVisible(true);
    } else {
      webViewRef.current?.injectJavaScript(
        "var v=document.querySelector('video'); if(v){v.play();} true;",
      );
      setIsPlaying(true);
      resetHideTimer();
    }
  };

  const toggleControls = () => {
    setControlsVisible((prev) => {
      const next = !prev;
      if (next) resetHideTimer();
      return next;
    });
  };

  const skipSeconds = (sec: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const maxDur = duration || 9999;
    const target = Math.max(0, Math.min(maxDur, currentTime + sec));
    setCurrentTime(target);
    webViewRef.current?.injectJavaScript(
      `var v=document.querySelector('video'); if(v){v.currentTime=${target};} true;`,
    );
    if (sec > 0) {
      setRippleRight(true);
      setTimeout(() => setRippleRight(false), 700);
    } else {
      setRippleLeft(true);
      setTimeout(() => setRippleLeft(false), 700);
    }
    resetHideTimer();
  };

  const cycleSpeed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const nextIdx = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIdx);
    const speed = SPEEDS[nextIdx];
    webViewRef.current?.injectJavaScript(
      `var v=document.querySelector('video'); if(v){v.playbackRate=${speed};} true;`,
    );
    resetHideTimer();
  };

  const handleSeek = (x: number) => {
    if (trackWidth <= 0 || duration <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / trackWidth));
    const target = ratio * duration;
    setScrubTime(target);
  };

  const panResponder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          setIsScrubbing(true);
          if (hideTimer.current) clearTimeout(hideTimer.current);
          handleSeek(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (evt) => {
          handleSeek(evt.nativeEvent.locationX);
        },
        onPanResponderRelease: () => {
          setIsScrubbing(false);
          setCurrentTime(scrubTime);
          webViewRef.current?.injectJavaScript(
            `var v=document.querySelector('video'); if(v){v.currentTime=${scrubTime};} true;`,
          );
          resetHideTimer();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth, duration, scrubTime, isScrubbing],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'timeUpdate') {
        if (!isScrubbing && typeof data.currentTime === 'number') {
          setCurrentTime(data.currentTime);
        }
        if (typeof data.duration === 'number' && data.duration > 0) {
          setDuration(data.duration);
        }
        // Buffering when readyState < 3 and playing
        if (typeof data.readyState === 'number') {
          if (data.readyState >= 3 && hasStarted) setBuffering(false);
        }
        if (data.ended) {
          setIsPlaying(false);
          setControlsVisible(true);
          if (onEnded) onEnded();
        }
      }
    } catch {}
  };

  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));

  const playerHeight = isFullscreen ? Dimensions.get('window').height : inlinePlayerHeight;
  const playerWidth = isFullscreen ? Dimensions.get('window').width : boxWidth;
  const cw = isFullscreen ? playerWidth : boxWidth;

  return (
    <View
      style={[
        styles.container,
        isFullscreen ? styles.containerFullscreen : { height: inlinePlayerHeight },
      ]}
      onLayout={(e: LayoutChangeEvent) => {
        if (!isFullscreen) setBoxWidth(e.nativeEvent.layout.width);
      }}
    >
      {isFullscreen && (
        <StatusBar hidden translucent backgroundColor="#000000" />
      )}

      {/* STREAM LAYER — embedded video, scaled & cropped to never show margins */}
      {hasStarted && !locked && (
        <View
          style={[
            styles.croppedWrapper,
            isFullscreen
              ? {
                  top: cropTop,
                  left: -Math.round((cropW - playerWidth) * 0.5),
                  width: Math.round(playerWidth * CROP_SCALE),
                  height: Math.round(playerHeight * CROP_SCALE),
                }
              : { top: cropTop, left: cropLeft, width: cropW, height: cropH },
          ]}
          pointerEvents="none"
        >
          <WebView
            ref={webViewRef}
            source={{ uri: embedUri }}
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo={false}
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            style={styles.webView}
            injectedJavaScript={INJECTED_CLEANER_JS}
            onMessage={handleMessage}
            onLoadEnd={() => setBuffering(false)}
          />
        </View>
      )}

      {/* OPAQUE SCRIMS that cover any leaked YouTube chrome (title bar / watermark / pause overlay) */}
      {hasStarted && !locked && (
        <>
          <LinearGradient
            pointerEvents="none"
            colors={['#000000', '#14161B']}
            style={[styles.topScrim, { height: SCRIM_TOP, top: 0 }]}
          />
          <View pointerEvents="none" style={[styles.bottomScrim, { height: SCRIM_BOTTOM, bottom: 0 }]} />
          {/* Hard-edge solid covers right at top/bottom to fully block youTube logo + title */}
          <View pointerEvents="none" style={[styles.hardCover, { top: 0, height: 2 }]} />
          <View pointerEvents="none" style={[styles.hardCover, { bottom: 0, height: 2 }]} />
          <View pointerEvents="none" style={[styles.sideCover, { top: SCRIM_TOP * 0.5, left: 4, width: 24, height: 24 }]} />
          <View pointerEvents="none" style={[styles.sideCover, { top: SCRIM_TOP * 0.5, right: 4, width: 24, height: 24 }]} />
        </>
      )}

      {/* Initial poster thumbnail + first-tap-to-start surface */}
      {!hasStarted && !locked && (
        <Pressable style={StyleSheet.absoluteFill} onPress={togglePlay}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.posterImage} resizeMode="cover" />
          ) : (
            <View style={styles.posterPlaceholder} />
          )}
          <LinearGradient
            colors={['#080808', '#0B0C0E', '#080808']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.playHint}>
            <Ionicons name="play" size={42} color="#000" style={{ marginLeft: 4 }} />
          </View>
        </Pressable>
      )}

      {/* Buffering spinner */}
      {buffering && hasStarted && !locked && (
        <View style={styles.buffering} pointerEvents="none">
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      )}

      {/* Double-tap ripple overlays (also intercept taps for ±10s) */}
      {hasStarted && !locked && (
        <>
          <Pressable
            style={[styles.tapZone, { left: 0, width: cw * 0.33 }]}
            onPress={(e) => {
              const x = e.nativeEvent.locationX;
              const y = e.nativeEvent.locationY;
              const now = Date.now();
              const prev = lastTapRef.current;
              if (now - prev.time < DOUBLE_TAP_WINDOW) {
                skipSeconds(-10);
                lastTapRef.current = { time: 0, x: 0, y: 0 };
              } else {
                lastTapRef.current = { time: now, x, y };
                setTimeout(() => {
                  if (Date.now() - lastTapRef.current.time > DOUBLE_TAP_WINDOW - 30) {
                    toggleControls();
                  }
                }, DOUBLE_TAP_WINDOW);
              }
            }}
          />
          <Pressable
            style={[styles.tapZone, { left: cw * 0.33, width: cw * 0.34 }]}
            onPress={(e) => {
              const x = e.nativeEvent.locationX;
              const y = e.nativeEvent.locationY;
              const now = Date.now();
              const prev = lastTapRef.current;
              if (now - prev.time < DOUBLE_TAP_WINDOW) {
                togglePlay();
                lastTapRef.current = { time: 0, x: 0, y: 0 };
              } else {
                lastTapRef.current = { time: now, x, y };
                setTimeout(() => {
                  if (Date.now() - lastTapRef.current.time > DOUBLE_TAP_WINDOW - 30) {
                    toggleControls();
                  }
                }, DOUBLE_TAP_WINDOW);
              }
            }}
          />
          <Pressable
            style={[styles.tapZone, { right: 0, width: cw * 0.33 }]}
            onPress={(e) => {
              const x = e.nativeEvent.locationX;
              const y = e.nativeEvent.locationY;
              const now = Date.now();
              const prev = lastTapRef.current;
              if (now - prev.time < DOUBLE_TAP_WINDOW) {
                skipSeconds(10);
                lastTapRef.current = { time: 0, x: 0, y: 0 };
              } else {
                lastTapRef.current = { time: now, x, y };
                setTimeout(() => {
                  if (Date.now() - lastTapRef.current.time > DOUBLE_TAP_WINDOW - 30) {
                    toggleControls();
                  }
                }, DOUBLE_TAP_WINDOW);
              }
            }}
          />
        </>
      )}

      <Ripple side="left" label="10s" show={rippleLeft} />
      <Ripple side="right" label="10s" show={rippleRight} />

      {/* Locked paywall overlay */}
      {locked && (
        <View style={styles.lockedOverlay}>
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed" size={32} color={Colors.gold} />
            <Text style={styles.lockedTitle}>Premium Lesson Locked</Text>
            <Text style={styles.lockedSub}>
              Unlock the complete 25-step course to stream this masterclass.
            </Text>
            {onUnlockPress && (
              <Pressable onPress={onUnlockPress} style={styles.unlockBtn}>
                <Text style={styles.unlockBtnText}>Unlock Course</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Proprietary overlay UI (YouTube-app-style) */}
      {!locked && controlsVisible && (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(160)}
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        >
          <LinearGradient
            pointerEvents="none"
            colors={['#0C0C0C', '#15171C', '#050505']}
            style={StyleSheet.absoluteFill}
          />

          {/* Top bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => (isFullscreen ? exitFullscreen() : onBack ? onBack() : null)}
              hitSlop={12}
              style={styles.iconBtn}
            >
              <Ionicons
                name={isFullscreen ? 'contract' : 'chevron-back'}
                size={isFullscreen ? 22 : 24}
                color="#FFFFFF"
              />
            </Pressable>

            <View style={styles.topTitleWrap}>
              {stepNumber !== undefined && (
                <Text style={styles.stepBadgeText} numberOfLines={1}>
                  STEP {stepNumber} OF {totalSteps}
                </Text>
              )}
              <Text style={styles.topTitle} numberOfLines={1}>
                {title || 'Dubai Job Masterclass'}
              </Text>
            </View>

            <AnimatedPressableScale
              scaleTo={0.92}
              onPress={cycleSpeed}
              hitSlop={10}
              style={styles.speedPill}
            >
              <Text style={styles.speedPillText}>{SPEEDS[speedIndex]}x</Text>
            </AnimatedPressableScale>
            <View style={{ width: 8 }} />
            <AnimatedPressableScale
              scaleTo={0.9}
              onPress={isFullscreen ? exitFullscreen : enterFullscreen}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <Ionicons
                name={isFullscreen ? 'contract-outline' : 'expand-outline'}
                size={22}
                color="#FFFFFF"
              />
            </AnimatedPressableScale>
          </View>

          {/* Center controls */}
          <View style={styles.centerControls} pointerEvents="box-none">
            <AnimatedPressableScale
              scaleTo={0.9}
              onPress={() => skipSeconds(-10)}
              hitSlop={12}
              style={styles.secondaryBtn}
            >
              <Ionicons name="play-back" size={20} color="#FFFFFF" />
              <Text style={styles.secondaryBtnText}>10s</Text>
            </AnimatedPressableScale>

            <AnimatedPressableScale
              scaleTo={0.88}
              onPress={togglePlay}
              hitSlop={12}
              style={styles.heroPlayBtn}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={34}
                color="#000"
                style={isPlaying ? {} : { marginLeft: 4 }}
              />
            </AnimatedPressableScale>

            <AnimatedPressableScale
              scaleTo={0.9}
              onPress={() => skipSeconds(10)}
              hitSlop={12}
              style={styles.secondaryBtn}
            >
              <Ionicons name="play-forward" size={20} color="#FFFFFF" />
              <Text style={styles.secondaryBtnText}>10s</Text>
            </AnimatedPressableScale>
          </View>

          {/* Bottom bar */}
          <View style={styles.bottomBar}>
            <Pressable onPress={togglePlay} hitSlop={8} style={styles.iconBtn}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.timeText}>
              {formatTime(displayTime)} / {formatTime(duration)}
            </Text>

            <View
              style={styles.seekContainer}
              onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
              {...panResponder.panHandlers}
            >
              <View style={styles.seekTrack}>
                <View style={[styles.seekFill, { width: `${clampedProgress}%` }]} />
                {duration > 0 && (
                  <View
                    style={[styles.seekThumb, { left: `${Math.max(0, Math.min(96, clampedProgress))}%` }]}
                  />
                )}
              </View>
            </View>

            {onPrevLesson && (
              <Pressable onPress={onPrevLesson} hitSlop={8} style={styles.iconBtn}>
                <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
              </Pressable>
            )}
            {onNextLesson && (
              <Pressable onPress={onNextLesson} hitSlop={8} style={styles.iconBtn}>
                <Ionicons name="chevron-forward" size={18} color={Colors.gold} />
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  containerFullscreen: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  croppedWrapper: {
    position: 'absolute',
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#000000',
  },
  hardCover: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#000000',
  },
  sideCover: {
    position: 'absolute',
    backgroundColor: '#000000',
    borderRadius: 14,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111215',
  },
  playHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -36,
    marginTop: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buffering: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  tapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  rippleWrap: {
    position: 'absolute',
    top: '40%',
    width: 140,
    height: 140,
    marginTop: -70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleLeft: { left: '14%' },
  rippleRight: { right: '14%' },
  rippleCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#000000',
  },
  rippleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitleWrap: {
    flex: 1,
    paddingHorizontal: 4,
  },
  stepBadgeText: {
    color: Colors.gold,
    fontSize: 9.5,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  speedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  speedPillText: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    marginTop: -1,
  },
  heroPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 8,
    gap: 8,
  },
  timeText: {
    color: '#E0E0E0',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    minWidth: 86,
    textAlign: 'center',
  },
  seekContainer: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
  },
  seekTrack: {
    height: 3,
    backgroundColor: '#3A3D45',
    borderRadius: 1.5,
    position: 'relative',
  },
  seekFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 1.5,
  },
  seekThumb: {
    position: 'absolute',
    top: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F1014',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedCard: {
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  lockedTitle: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  lockedSub: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  unlockBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: Radii.sm,
    marginTop: 10,
  },
  unlockBtnText: {
    color: '#000000',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
});
