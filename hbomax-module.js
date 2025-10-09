/**
 * Netflix Speed Boost - HBO Max Module
 * 
 * HBO Max-specific functionality for the speed boost extension.
 * Handles HBO Max's unique video player structure and control elements.
 * 
 * @version 1.1.4
 * @author Varun Sapre
 */

(() => {
  'use strict';
  
  // ============================================================================
  // HBO MAX-SPECIFIC CONFIGURATION
  // ============================================================================
  
  /**
   * HBO Max-specific control selectors
   * Used to prevent speed boost activation when clicking on HBO Max controls
   * NOTE: We exclude protection layers and non-interactive elements
   */
  const HBOMAX_CONTROL_SELECTOR = [
    // HBO Max actual interactive controls using data-testid attributes
    '[data-testid*="player-ux-play-pause-button"]',
    '[data-testid*="player-ux-volume-button"]',
    '[data-testid*="player-ux-fullscreen-button"]',
    '[data-testid*="player-ux-skip-back-button"]',
    '[data-testid*="player-ux-skip-forward-button"]',
    '[data-testid*="player-ux-text-track-button"]',
    '[data-testid*="player-ux-audio-track-button"]',
    '[data-testid*="player-ux-chromecast-button"]',
    '[data-testid*="control_footer"]',
    '[data-testid*="playback_controls"]',
    // HBO Max control containers (but not protection layers)
    '.ControlsContainer-Fuse-Web-Play',
    '.ControlsHeader-Fuse-Web-Play',
    '.ControlsFooter-Fuse-Web-Play',
    // Generic control selectors that work for HBO Max
    'button[aria-label*="play"]',
    'button[aria-label*="pause"]',
    'button[aria-label*="volume"]',
    'button[aria-label*="fullscreen"]',
    'button[aria-label*="settings"]',
    'button[aria-label*="audio"]',
    'button[aria-label*="subtitle"]',
    'button[aria-label*="Exit Playback"]',
    'button[aria-label*="Back"]',
    // Additional HBO Max selectors (to be discovered through testing)
    '.hbo-player-controls',
    '.max-player-controls'
  ].join(',');
  
  // ============================================================================
  // HBO MAX-SPECIFIC FUNCTIONS
  // ============================================================================
  
  /**
   * Check if we're on an HBO Max watch page
   * @returns {boolean} True if on an HBO Max watch page
   */
  function isHBOMaxWatchPage() {
    return window.location.hostname === 'play.hbomax.com' && 
           window.location.pathname.startsWith('/video/watch/');
  }
  
  /**
   * Check if a target element is an HBO Max control or within an HBO Max control element
   * @param {EventTarget} target - Target element from event
   * @returns {boolean} True if target is an HBO Max control element
   */
  function isOverHBOMaxControls(target) {
    if (!target || !(target instanceof Element)) return false;
    
    // First check if it's a protection layer - these should NOT block speed boost
    if (target.classList.contains('ProtectionLayerContainer-Fuse-Web-Play__sc-xdp0fw-0') ||
        target.closest('.ProtectionLayerContainer-Fuse-Web-Play__sc-xdp0fw-0') ||
        target.classList.contains('TopGradient-Fuse-Web-Play__sc-xdp0fw-1') ||
        target.classList.contains('BottomGradient-Fuse-Web-Play__sc-xdp0fw-2') ||
        target.closest('[data-testid="protection_layer"]')) {
      return false;
    }
    
    // Check for actual interactive controls
    return target.closest(HBOMAX_CONTROL_SELECTOR) !== null;
  }
  
  /**
   * Try to access HBO Max's internal player API (if available)
   * HBO Max may have different internal APIs than Netflix
   */
  function tryHBOMaxPlayerAPI() {
    try {
      // HBO Max might use different global objects
      // This is experimental and will be refined based on testing
      // Check for common HBO Max global objects
      if (typeof window.hboPlayer !== 'undefined') {
        return window.hboPlayer;
      }
      
      // Check for other possible HBO Max player objects
      if (typeof window.maxPlayer !== 'undefined') {
        return window.maxPlayer;
      }
    } catch (error) {
      // Silently handle errors
    }
    return null;
  }
  
  /**
   * HBO Max-specific video detection
   * HBO Max might have different video element structures
   */
  function getHBOMaxVideo() {
    // Try standard video elements first
    const videos = Array.from(document.querySelectorAll('video'));
    
    // HBO Max might use specific video containers or classes
    const hboVideos = Array.from(document.querySelectorAll('.hbo-video video, .max-video video, [class*="player"] video'));
    
    // Combine and deduplicate
    const allVideos = [...new Set([...videos, ...hboVideos])];
    
    // Track video count changes without logging
    if (allVideos.length !== getHBOMaxVideo.lastCount) {
      getHBOMaxVideo.lastCount = allVideos.length;
    }
    
    return allVideos;
  }
  
  // ============================================================================
  // EXPORT HBO MAX MODULE
  // ============================================================================
  
  // Export HBO Max-specific functions to the global scope
  window.HBOMaxModule = {
    isWatchPage: isHBOMaxWatchPage,
    isOverControls: isOverHBOMaxControls,
    tryPlayerAPI: tryHBOMaxPlayerAPI,
    getVideos: getHBOMaxVideo,
    controlSelector: HBOMAX_CONTROL_SELECTOR
  };
  
  // HBO Max module loaded (no log needed - main loader will confirm)
  
})();
