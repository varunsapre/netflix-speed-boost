/**
 * Netflix Speed Boost - Main Loader
 * 
 * This script detects the current streaming service and loads the appropriate module.
 * It provides the core functionality that works across all supported services.
 * 
 * @version 1.1.4
 * @author Varun Sapre
 */

(() => {
  'use strict';
  
  // ============================================================================
  // CORE SETTINGS & STATE
  // ============================================================================
  
  // User settings with defaults
  let settings = {
    speedBoost: 1.5,        // Speed multiplier when holding
    customKey: 'KeyL',      // Custom key binding for speed boost
    enableAnimation: false,  // Show wave animation
    enableText: true         // Show speed text indicator
  };
  
  // State management
  let settingsLoaded = false;
  let isActive = false;
  let currentModule = null;
  
  // ============================================================================
  // SETTINGS MANAGEMENT
  // ============================================================================
  
  /**
   * Load user settings from Chrome sync storage
   * Automatically saves default settings on first install
   * @param {Function} callback - Function to call after settings are loaded
   */
  function loadSettings(callback) {
    chrome.storage.sync.get(settings, (loadedSettings) => {
      // Check if this is the first time (no settings exist)
      const hasExistingSettings = Object.keys(loadedSettings).length > 0;
      
      if (!hasExistingSettings) {
        // First install - save default settings to storage
        chrome.storage.sync.set(settings, () => {
          settingsLoaded = true;
          if (callback) callback();
        });
      } else {
        // Settings exist - use loaded values
        settings = { ...settings, ...loadedSettings };
        settingsLoaded = true;
        if (callback) callback();
      }
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
      if (changes.customKey) {
        settings.customKey = changes.customKey.newValue;
        // Rebind custom key events when setting changes
        bindCustomKeyEvents();
      }
      if (changes.enableAnimation !== undefined) {
        settings.enableAnimation = changes.enableAnimation.newValue;
      }
      if (changes.enableText !== undefined) {
        settings.enableText = changes.enableText.newValue;
      }
    }
  });
  
  // ============================================================================
  // MODULE DETECTION & LOADING
  // ============================================================================
  
  /**
   * Detect which streaming service module to load based on current URL
   * @returns {string|null} Module name or null if unsupported
   */
  function detectStreamingService() {
    const hostname = window.location.hostname;
    
    if (hostname === 'www.netflix.com') {
      return 'netflix';
    } else if (hostname === 'play.hbomax.com') {
      return 'hbomax';
    }
    
    return null;
  }
  
  /**
   * Load the appropriate module based on the detected streaming service
   * @param {string} service - The streaming service name
   */
  function loadModule(service) {
    // Check if we're already using the correct module
    const currentService = getCurrentService();
    if (currentService === service && currentModule) {
      // Module already loaded (no log needed)
      return;
    }
    
    switch (service) {
      case 'netflix':
        if (window.NetflixModule) {
          currentModule = window.NetflixModule;
          console.log('Netflix Speed Boost: Netflix module loaded successfully');
        } else {
          console.error('Netflix Speed Boost: Netflix module not found');
        }
        break;
        
      case 'hbomax':
        if (window.HBOMaxModule) {
          currentModule = window.HBOMaxModule;
          console.log('Netflix Speed Boost: HBO Max module loaded successfully');
          // Initialize HBO Max speed controls
          if (currentModule.initializeSpeedControls) {
            currentModule.initializeSpeedControls();
          }
        } else {
          console.error('Netflix Speed Boost: HBO Max module not found');
        }
        break;
        
      default:
        console.log('Netflix Speed Boost: Unsupported streaming service');
        currentModule = null;
    }
  }
  
  /**
   * Get the current streaming service based on the loaded module
   * @returns {string|null} Current service name or null
   */
  function getCurrentService() {
    if (currentModule === window.NetflixModule) {
      return 'netflix';
    } else if (currentModule === window.HBOMaxModule) {
      return 'hbomax';
    }
    return null;
  }
  
  // ============================================================================
  // CORE FUNCTIONALITY (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  let restoreRate = null;      // Playback rate to restore when releasing
  let activeVideo = null;      // Currently active video element
  let holdTimer = null;        // Timer for detecting hold vs click
  let isHold = false;          // Whether speed boost is currently active
  let blockNextClick = false;  // Flag to prevent pause/play after boost
  
  // Constants
  const HOLD_THRESHOLD = 150;  // Milliseconds to distinguish hold from click
  
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
   * Uses module-specific video detection if available
   * @returns {HTMLVideoElement|null} The active video element or null
   */
  function getActiveVideo() {
    let videos = [];
    
    // Use module-specific video detection if available
    if (currentModule && currentModule.getVideos) {
      videos = currentModule.getVideos();
    } else {
      // Fallback to standard video detection
      videos = Array.from(document.querySelectorAll('video'));
    }
    
    const good = videos.filter(inViewport)
      .sort((a,b)=> (b.readyState - a.readyState) + ((+!b.paused) - (+!a.paused)));
    const selected = good[0] || videos[0] || null;
    
    // Track video changes without logging
    if (selected && selected !== getActiveVideo.lastVideo) {
      getActiveVideo.lastVideo = selected;
    }
    
    return selected;
  }
  
  /**
   * Check if a target element is a control or within a control element
   * Uses module-specific control detection
   * @param {EventTarget} target - Target element from event
   * @returns {boolean} True if target is a control element
   */
  function isOverControls(target) {
    if (!target || !(target instanceof Element)) return false;
    
    // Use module-specific control detection if available
    if (currentModule && currentModule.isOverControls) {
      return currentModule.isOverControls(target);
    }
    
    // Fallback to generic control detection
    return false;
  }
  
  /**
   * Check if we're on a supported streaming service watch page
   * Uses module-specific page detection
   * @returns {boolean} True if on a watch page
   */
  function isWatchPage() {
    if (currentModule && currentModule.isWatchPage) {
      return currentModule.isWatchPage();
    }
    return false;
  }
  
  // ============================================================================
  // VISUAL FEEDBACK (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  function showSpeedIndicator(clickX, clickY) {
    // Show animation if enabled
    if (settings.enableAnimation) {
      createClickOverlay(clickX, clickY);
    }
    
    // Show text indicator if enabled
    if (settings.enableText) {
      createTextIndicator();
    }
  }
  
  function createTextIndicator() {
    // Remove any existing text indicator
    const existingText = document.getElementById('netflix-speed-text-indicator');
    if (existingText) {
      existingText.remove();
    }
    
    const textIndicator = document.createElement('div');
    textIndicator.id = 'netflix-speed-text-indicator';
    textIndicator.textContent = `${settings.speedBoost}× ▶▶`;
    textIndicator.style.cssText = `
      position: fixed !important;
      right: 30px !important;
      top: 50% !important;
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
      const maxOpacity = 0.05 + (i * 0.05); // 0.05, 0.1, 0.15
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
  // HOLD & RELEASE HANDLERS (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  /**
   * Handle pointer down event to start speed boost timer
   * Activates anywhere on screen except streaming service controls
   * @param {PointerEvent} e - Pointer down event
   */
  function startHold(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    
    // Check if clicking on streaming service controls - if so, don't activate speed boost
    if (isOverControls(e.target)) {
      return;
    }

    const v = getActiveVideo();
    
    if (!v) {
      return;
    }
    
    // Don't allow speed boost if video is paused
    if (v.paused) {
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
    
    // Store click coordinates for animation
    const clickX = e.clientX;
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
      
      // Prevent the event from triggering streaming service controls
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
  // KEYBOARD HANDLING (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  /**
   * Handle custom key keydown event to start speed boost
   * Only activates if the custom key is pressed and not over input elements
   * @param {KeyboardEvent} e - Keydown event
   */
  function handleCustomKeyDown(e) {
    if (e.code !== settings.customKey) {
      return;
    }
    
    // Don't activate if extension is not active
    if (!isActive) {
      return;
    }
    
    // Don't activate if user is typing in input fields
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }
    
    // Prevent default key behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    const v = getActiveVideo();
    if (!v) {
      return;
    }
    
    // Don't allow speed boost if video is paused
    if (v.paused) {
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
    
    // Get center of screen for animation
    const clickX = window.innerWidth / 2;
    const clickY = window.innerHeight / 2;
    
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
   * Handle custom key keyup event to end speed boost
   * @param {KeyboardEvent} e - Keyup event
   */
  function handleCustomKeyUp(e) {
    if (e.code !== settings.customKey) {
      return;
    }
    
    // Don't activate if extension is not active
    if (!isActive) {
      return;
    }
    
    // Prevent default key behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the timer
    clearTimeout(holdTimer);
    holdTimer = null;
    
    if (isHold) {
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
    }
  }

  /**
   * Bind/unbind custom key event listeners
   * Removes old listeners and adds new ones based on current customKey setting
   */
  function bindCustomKeyEvents() {
    // Remove any existing key listeners
    document.removeEventListener('keydown', handleCustomKeyDown, { capture: true, passive: false });
    document.removeEventListener('keyup', handleCustomKeyUp, { capture: true, passive: false });
    
    // Add new listeners for the current custom key
    document.addEventListener('keydown', handleCustomKeyDown, { capture: true, passive: false });
    document.addEventListener('keyup', handleCustomKeyUp, { capture: true, passive: false });
  }

  // ============================================================================
  // EVENT BINDING (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  const pressOpts = { capture: true, passive: false };
  
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
    // Non-passive for pointerup so we can preventDefault to block streaming service pause
    const opts = { capture: true, passive: false };
    fn('pointerup', endHold, opts);
    fn('pointercancel', endHold, opts);
    // These need to be non-passive since endHold calls preventDefault
    const nonPassiveOpts = { capture: true, passive: false };
    fn('mouseleave', endHold, nonPassiveOpts);
    fn('blur', endHold, nonPassiveOpts);
  }
  
  /**
   * Bind/unbind click blocking event listener
   * @param {boolean} on - True to bind, false to unbind
   */
  function bindClickBlocker(on){
    const fn = on ? addEventListener : removeEventListener;
    // Capture phase and non-passive to intercept before streaming service handlers
    fn('click', blockClick, { capture: true, passive: false });
  }

  // ============================================================================
  // SPA NAVIGATION HANDLING (WORKS ACROSS ALL SERVICES)
  // ============================================================================
  
  /**
   * Handle route changes in streaming service single-page apps
   */
  function onRouteChange(){ 
    handleNavigation();
  }
  
  /**
   * Patch History API to detect SPA navigation
   * Streaming services use pushState/replaceState for navigation without page reload
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
   * Streaming services dynamically create/destroy video elements
   * Only runs when extension is active
   */
  function observe(){
    const mo = new MutationObserver((mutations) => { 
      // Only update active video if extension is active
      if (!isActive) {
        return;
      }
      
      // Check if any mutations actually affect video elements
      const hasVideoChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.tagName === 'VIDEO' || node.querySelector('video'))
        ) || Array.from(mutation.removedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.tagName === 'VIDEO' || node.querySelector('video'))
        );
      });
      
      // Only check for video changes if there were actual video-related mutations
      if (hasVideoChanges) {
        const v = getActiveVideo(); 
        if (v && v !== activeVideo) {
          activeVideo = v;
        }
      }
    });
    mo.observe(document.documentElement||document.body, {childList:true, subtree:true});
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  /**
   * Activate the extension on watch pages
   */
  function activateExtension() {
    if (isActive) return;
    
    // Activating extension (no log needed)
    isActive = true;
    bindPress(true); 
    bindRelease(true); 
    bindClickBlocker(true); 
    bindCustomKeyEvents();
    observe();
    activeVideo = getActiveVideo();
  }

  /**
   * Deactivate the extension on non-watch pages
   */
  function deactivateExtension() {
    if (!isActive) return;
    
    // Deactivating extension (no log needed)
    isActive = false;
    endHold(); // Stop any active speed boost
    bindPress(false); 
    bindRelease(false); 
    bindClickBlocker(false); 
    // Note: We don't unbind custom key events here as they're global
    activeVideo = null;
  }

  /**
   * Set up navigation detection using multiple event listeners
   * No loops, pure event-driven
   */
  function setupNavigationDetection() {
    // 1. Listen for all possible navigation events
    window.addEventListener('popstate', () => {
      setTimeout(handleNavigation, 100);
    });
    
    // 2. Listen for hash changes
    window.addEventListener('hashchange', () => {
      setTimeout(handleNavigation, 100);
    });
    
    // 3. Listen for streaming service custom events
    window.addEventListener('nfh-route', () => {
      setTimeout(handleNavigation, 100);
    });
    
    // 4. Listen for DOM mutations that might indicate navigation
    const observer = new MutationObserver((mutations) => {
      // Check if URL changed during mutations
      const currentUrl = window.location.href;
      if (currentUrl !== setupNavigationDetection.lastUrl) {
        setupNavigationDetection.lastUrl = currentUrl;
        setTimeout(handleNavigation, 100);
      }
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    // Store initial URL
    setupNavigationDetection.lastUrl = window.location.href;
  }

  /**
   * Handle navigation events with debouncing to prevent multiple rapid calls
   */
  function handleNavigation() {
    // Debounce navigation handling to prevent multiple rapid calls
    if (handleNavigation.timeout) {
      clearTimeout(handleNavigation.timeout);
    }
    
    handleNavigation.timeout = setTimeout(() => {
      // Detect streaming service and load appropriate module
      const service = detectStreamingService();
      if (service) {
        loadModule(service);
      }
      
      if (isWatchPage() && !isActive) {
        // Small delay to let streaming service load the video
        setTimeout(() => {
          activateExtension();
        }, 500);
      } else if (!isWatchPage() && isActive) {
        deactivateExtension();
      }
    }, 100); // 100ms debounce
  }

  /**
   * Initialize the extension
   * Loads settings, detects streaming service, and sets up observers
   */
  function init(){
    // Load settings first, then check if we should activate
    loadSettings(() => {
      // Detect streaming service and load appropriate module
      const service = detectStreamingService();
      if (service) {
        loadModule(service);
      }
      
      patchHistory(); // Always set up SPA navigation detection
      addEventListener('beforeunload', endHold, {passive:false});
      
      // Set up efficient navigation detection
      setupNavigationDetection();
      
      // Check if we should activate on current page
      if (isWatchPage()) {
        activateExtension();
      }
    });
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
