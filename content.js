/**
 * Netflix Speed Boost - Content Script
 * 
 * This script enables temporary playback speed boosting on Netflix videos.
 * Users hold on the right third of the video area to activate speed boost,
 * and release to restore normal playback speed.
 * 
 * @version 1.0.0
 * @author Varun Sapre
 */

(() => {
  'use strict';
  
  // ============================================================================
  // SETTINGS & STATE
  // ============================================================================
  
  // User settings with defaults
  let settings = {
    speedBoost: 1.5,        // Speed multiplier when holding
    enableAnimation: true,   // Show wave animation
    enableText: false        // Show speed text indicator
  };
  
  // State management
  let settingsLoaded = false;
  
  // ============================================================================
  // SETTINGS MANAGEMENT
  // ============================================================================
  
  /**
   * Load user settings from Chrome sync storage
   * @param {Function} callback - Function to call after settings are loaded
   */
  function loadSettings(callback) {
    chrome.storage.sync.get(settings, (loadedSettings) => {
      settings = { ...settings, ...loadedSettings };
      settingsLoaded = true;
      if (callback) callback();
    });
  }
  
  /**
   * Listen for settings changes from the popup
   * Updates settings in real-time without page reload
   */
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      if (changes.speedBoost) {
        settings.speedBoost = changes.speedBoost.newValue;
      }
      if (changes.enableAnimation !== undefined) {
        settings.enableAnimation = changes.enableAnimation.newValue;
      }
      if (changes.enableText !== undefined) {
        settings.enableText = changes.enableText.newValue;
      }
    }
  });
  
  let restoreRate = null;      // Playback rate to restore when releasing
  let activeVideo = null;      // Currently active video element
  let holdTimer = null;        // Timer for detecting hold vs click
  let isHold = false;          // Whether speed boost is currently active
  let blockNextClick = false;  // Flag to prevent pause/play after boost
  
  // Constants
  const HOLD_THRESHOLD = 150;  // Milliseconds to distinguish hold from click
  
  // ============================================================================
  // VISUAL FEEDBACK
  // ============================================================================
  
  /**
   * Create the speed indicator element (legacy - currently unused)
   * Kept for potential future enhancements
   */
  function createSpeedIndicator() {
    // Add CSS animation styles
    if (!document.getElementById('netflix-speed-styles')) {
      const style = document.createElement('style');
      style.id = 'netflix-speed-styles';
      style.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(0); opacity: 1; }
          to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
        #netflix-speed-indicator {
          position: fixed !important;
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 12px 24px !important;
          border-radius: 25px !important;
          font-family: 'Netflix Sans', Arial, sans-serif !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          z-index: 2147483647 !important;
          display: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
          border: 2px solid rgba(255, 255, 255, 0.4) !important;
          backdrop-filter: blur(10px) !important;
          pointer-events: none !important;
          visibility: visible !important;
          animation: indicatorPulse 1.5s ease-in-out infinite !important;
        }
        @keyframes indicatorPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        /* Ensure it works in fullscreen */
        :fullscreen #netflix-speed-indicator,
        :-webkit-full-screen #netflix-speed-indicator,
        :-moz-full-screen #netflix-speed-indicator,
        :-ms-fullscreen #netflix-speed-indicator {
          position: fixed !important;
          z-index: 2147483647 !important;
          visibility: visible !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'netflix-speed-indicator';
    indicator.textContent = `${BOOST}×`;
    document.body.appendChild(indicator);
    return indicator;
  }
  
  function showSpeedIndicator(clickX, clickY) {
    // Show animation if enabled
    if (settings.enableAnimation) {
      createClickOverlay(clickX, clickY);
    }
    
    // Show text indicator if enabled
    if (settings.enableText) {
      createTextIndicator(clickY);
    }
  }
  
  function createTextIndicator(clickY) {
    // Remove any existing text indicator
    const existingText = document.getElementById('netflix-speed-text-indicator');
    if (existingText) {
      existingText.remove();
    }
    
    const textIndicator = document.createElement('div');
    textIndicator.id = 'netflix-speed-text-indicator';
    textIndicator.textContent = `${settings.speedBoost}×`;
    textIndicator.style.cssText = `
      position: fixed !important;
      right: 30px !important;
      top: ${clickY}px !important;
      transform: translateY(-50%) !important;
      color: rgba(255, 255, 255, 0.9) !important;
      font-family: 'Netflix Sans', Arial, sans-serif !important;
      font-size: 24px !important;
      font-weight: 700 !important;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8) !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      animation: textPulse 1.5s ease-in-out infinite !important;
    `;
    
    // Add animation style if not exists
    if (!document.getElementById('netflix-text-indicator-styles')) {
      const style = document.createElement('style');
      style.id = 'netflix-text-indicator-styles';
      style.textContent = `
        @keyframes textPulse {
          0%, 100% { opacity: 0.7; transform: translateY(-50%) scale(1); }
          50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Append to fullscreen element if in fullscreen, otherwise to body
    const fullscreenElement = document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement;
    
    if (fullscreenElement) {
      fullscreenElement.appendChild(textIndicator);
    } else {
      document.body.appendChild(textIndicator);
    }
  }
  
  function removeTextIndicator() {
    const textIndicator = document.getElementById('netflix-speed-text-indicator');
    if (textIndicator) {
      textIndicator.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        textIndicator.remove();
      }, 300);
    }
  }
  
  function createClickOverlay(clickX, clickY) {
    // Remove any existing overlays
    const existingContainer = document.getElementById('netflix-speed-overlay-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    // Create container
    const container = document.createElement('div');
    container.id = 'netflix-speed-overlay-container';
    container.style.cssText = `
      position: fixed !important;
      right: 0 !important;
      top: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483646 !important;
    `;
    
    // Create 3 staggered vertical waves with smooth fade-in/out
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'netflix-speed-wave';
      const maxOpacity = 0.1 + (i * 0.1); // 0.1, 0.2, 0.3
      const delay = i * 0.25; // Stagger delays: 0s, 0.25s, 0.5s
      const leftPosition = 60 + (i * 40); // 60px, 100px, 140px from right edge
      
      wave.style.cssText = `
        position: absolute !important;
        right: -200px !important;
        top: 0 !important;
        width: ${leftPosition + 300}px !important;
        height: 100% !important;
        background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, ${maxOpacity}) 80%, rgba(255, 255, 255, ${maxOpacity}) 100%) !important;
        animation: waveSmoothSlide 2s ease-in-out infinite !important;
        animation-delay: ${delay}s !important;
        animation-fill-mode: both !important;
      `;
      
      container.appendChild(wave);
    }
    
    // Add animation styles with smooth fade-in and fade-out
    if (!document.getElementById('netflix-speed-overlay-styles')) {
      const style = document.createElement('style');
      style.id = 'netflix-speed-overlay-styles';
      style.textContent = `
        @keyframes waveSmoothSlide {
          0% { 
            transform: translateX(-50px);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% { 
            transform: translateX(50px);
            opacity: 0;
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Append to fullscreen element if in fullscreen, otherwise to body
    const fullscreenElement = document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement;
    
    if (fullscreenElement) {
      fullscreenElement.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
  }
  
  function removeClickOverlay() {
    const container = document.getElementById('netflix-speed-overlay-container');
    if (container) {
      // Add fade-out animation before removing
      container.style.animation = 'fadeOut 0.3s ease-out forwards';
      
      // Remove after animation completes
      setTimeout(() => {
        container.remove();
      }, 300);
    }
  }
  
  function hideSpeedIndicator() {
    // Remove the click overlay and text indicator
    removeClickOverlay();
    removeTextIndicator();
  }

  // ============================================================================
  // VIDEO & CONTROL DETECTION
  // ============================================================================
  
  /**
   * Selectors for Netflix's control elements
   * Used to prevent speed boost activation when clicking on controls
   */
  const CONTROL_SELECTOR = [
    // Only actual interactive controls
    'button[data-uia*="play"]',
    'button[data-uia*="pause"]', 
    'button[data-uia*="volume"]',
    'button[data-uia*="fullscreen"]',
    'button[data-uia*="seek"]',
    'button[data-uia*="settings"]',
    'button[data-uia*="audio"]',
    'button[data-uia*="subtitle"]',
    '[data-uia*="play-pause-button"]',
    '[data-uia*="volume-button"]',
    '[data-uia*="fullscreen-button"]',
    '[data-uia*="seek-bar"]',
    '[data-uia*="scrubber-bar"]',
    '[role="slider"]',
    // Netflix control containers
    '.PlayerControlsNeo__core-controls',
    '.watch-video--controls-container',
    '.controls',
    '.control-bar'
  ].join(',');

  /**
   * Check if an element is visible in the viewport
   * @param {HTMLElement} el - Element to check
   * @returns {boolean} True if element is visible
   */
  const inViewport = el => {
    const r = el.getBoundingClientRect();
    return r.width>0 && r.height>0 && r.bottom>0 && r.right>0 &&
           r.left < innerWidth && r.top < innerHeight;
  };

  /**
   * Find the currently active video element on the page
   * Prioritizes videos that are in viewport, ready, and playing
   * @returns {HTMLVideoElement|null} The active video element or null
   */
  function getActiveVideo() {
    const vids = Array.from(document.querySelectorAll('video'));
    const good = vids.filter(inViewport)
      .sort((a,b)=> (b.readyState - a.readyState) + ((+!b.paused) - (+!a.paused)));
    const selected = good[0] || vids[0] || null;
    return selected;
  }

  /**
   * Check if a target element is a control or within a control element
   * @param {EventTarget} t - Target element from event
   * @returns {boolean} True if target is a control element
   */
  const isOverControls = t => {
    if (!t || !(t instanceof Element)) return false;
    // Only check for actual control elements, not all elements with data-uia
    return t.closest(CONTROL_SELECTOR) !== null;
  };

  // ============================================================================
  // HOLD & RELEASE HANDLERS
  // ============================================================================
  
  /**
   * Handle pointer down event to start speed boost timer
   * Only activates on right third of screen, not on controls
   * @param {PointerEvent} e - Pointer down event
   */
  function startHold(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    
    // Check if clicking on video element, its children, or video overlays
    const isVideoElement = e.target.tagName === 'VIDEO';
    const isVideoChild = e.target.closest('video') !== null;
    const isVideoOverlay = e.target.closest('.watch-video--player-container') !== null;
    const isVideoFlag = e.target.closest('.watch-video--flag-container') !== null;
    const isSubtitles = e.target.closest('.player-timedtext') !== null;
    
    if (!isVideoElement && !isVideoChild && !isVideoOverlay && !isVideoFlag && !isSubtitles) {
      return;
    }
    
    if (isOverControls(e.target)) {
      return;
    }
    
    // Check if click is in the right 1/3 of the screen
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    const rightThirdStart = (screenWidth * 2) / 3;
    
    if (clickX < rightThirdStart) {
      return; // Only allow clicks in the right 1/3
    }

    const v = getActiveVideo();
    if (!v) {
      return;
    }
    activeVideo = v;

    // Don't start new timer if already holding
    if (isHold) {
      return;
    }

    // Clear any existing timer
    if (holdTimer) {
      clearTimeout(holdTimer);
    }

    // Reset hold state and start timer
    isHold = false;
    
    // Store click coordinates for animation (clickX already declared above)
    const clickY = e.clientY;
    
    holdTimer = setTimeout(() => {
      isHold = true;
      restoreRate = v.playbackRate ?? 1.0;
      try { 
        v.playbackRate = settings.speedBoost; 
        showSpeedIndicator(clickX, clickY);
      } catch (err) {
        // Silently fail - video element may not support playback rate changes
      }
    }, HOLD_THRESHOLD);
  }

  /**
   * Handle pointer release to end speed boost
   * Restores original playback rate and prevents click event
   * @param {PointerEvent} e - Pointer up/cancel event
   */
  function endHold(e) {
    // Clear the timer
    clearTimeout(holdTimer);
    holdTimer = null;
    
    if (isHold) {
      // Set flag to block the subsequent click event
      blockNextClick = true;
      
      // Prevent the event from triggering Netflix controls
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      
      try { 
        const currentVideo = getActiveVideo();
        if (currentVideo && Number.isFinite(restoreRate)) {
          currentVideo.playbackRate = restoreRate; 
          hideSpeedIndicator();
        } else if (currentVideo) {
          currentVideo.playbackRate = 1.0;
        }
      } catch (err) {
        // Attempt to force reset on error
        try {
          const currentVideo = getActiveVideo();
          if (currentVideo) {
            currentVideo.playbackRate = 1.0;
          }
        } catch (resetErr) {
          // Silently fail - video element may have been removed
        }
      }
      restoreRate = null; 
      activeVideo = null; 
      isHold = false;
      
      // Reset the flag after a short delay to catch the click event
      setTimeout(() => {
        blockNextClick = false;
      }, 300);
    }
  }

  /**
   * Block click events that immediately follow a speed boost release
   * Prevents unintended pause/play when releasing hold
   * @param {MouseEvent} e - Click event
   */
  function blockClick(e) {
    if (blockNextClick) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  // ============================================================================
  // EVENT BINDING
  // ============================================================================
  
  const pressOpts = { capture: true, passive: true };
  
  /**
   * Bind/unbind pointer down event listener
   * @param {boolean} on - True to bind, false to unbind
   */
  function bindPress(on){ 
    (on ? addEventListener : removeEventListener)('pointerdown', startHold, pressOpts); 
  }
  
  /**
   * Bind/unbind pointer release event listeners
   * @param {boolean} on - True to bind, false to unbind
   */
  function bindRelease(on){
    const fn = on? addEventListener : removeEventListener;
    // Non-passive for pointerup so we can preventDefault to block Netflix pause
    const opts = { capture: true, passive: false };
    fn('pointerup', endHold, opts);
    fn('pointercancel', endHold, opts);
    // These can stay passive since they don't need preventDefault
    const passiveOpts = { capture: true, passive: true };
    fn('mouseleave', endHold, passiveOpts);
    fn('blur', endHold, passiveOpts);
  }
  
  /**
   * Bind/unbind click blocking event listener
   * @param {boolean} on - True to bind, false to unbind
   */
  function bindClickBlocker(on){
    const fn = on ? addEventListener : removeEventListener;
    // Capture phase and non-passive to intercept before Netflix handlers
    fn('click', blockClick, { capture: true, passive: false });
  }

  // ============================================================================
  // SPA NAVIGATION HANDLING
  // ============================================================================
  
  /**
   * Handle route changes in Netflix's single-page app
   * Resets state and re-detects video element
   */
  function onRouteChange(){ 
    endHold(); 
    setTimeout(() => { 
      activeVideo = getActiveVideo(); 
    }, 500); 
  }
  
  /**
   * Patch History API to detect SPA navigation
   * Netflix uses pushState/replaceState for navigation without page reload
   */
  function patchHistory(){
    ['pushState','replaceState'].forEach(k=>{
      const o = history[k];
      if (typeof o === 'function') {
        history[k] = function(...a){ const r = o.apply(this,a); dispatchEvent(new Event('nfh-route')); return r; };
      }
    });
    addEventListener('popstate', ()=>dispatchEvent(new Event('nfh-route')), {passive:true});
    addEventListener('nfh-route', onRouteChange, {passive:true});
  }

  /**
   * Observe DOM changes to detect new video elements
   * Netflix dynamically creates/destroys video elements
   */
  function observe(){
    const mo = new MutationObserver(()=>{ 
      const v = getActiveVideo(); 
      if (v && v!==activeVideo) {
        activeVideo = v;
      }
    });
    mo.observe(document.documentElement||document.body, {childList:true, subtree:true});
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  /**
   * Initialize the extension
   * Loads settings, binds events, and sets up observers
   */
  function init(){
    // Load settings first, then initialize
    loadSettings(() => {
      bindPress(true); 
      bindRelease(true); 
      bindClickBlocker(true); 
      patchHistory(); 
      observe();
      activeVideo = getActiveVideo();
      addEventListener('beforeunload', endHold, {passive:true});
    });
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();