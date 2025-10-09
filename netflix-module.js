/**
 * Netflix Speed Boost - Netflix Module
 * 
 * Netflix-specific functionality for the speed boost extension.
 * Handles Netflix's unique video player structure and control elements.
 * 
 * @version 1.1.5
 * @author Varun Sapre
 */

(() => {
  'use strict';
  
  // ============================================================================
  // NETFLIX-SPECIFIC CONFIGURATION
  // ============================================================================
  
  /**
   * Netflix-specific control selectors
   * Used to prevent speed boost activation when clicking on Netflix controls
   */
  const NETFLIX_CONTROL_SELECTOR = [
    // Netflix-specific controls
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
    // Netflix control containers and bottom bar
    '.PlayerControlsNeo__core-controls',
    '.watch-video--controls-container',
    '.controls',
    '.PlayerControlsNeo__bottom-controls',
    '.PlayerControlsNeo__bottom-controls-container',
    '.PlayerControlsNeo__control-bar',
    '.PlayerControlsNeo__control-bar-container',
    // Netflix bottom control bar elements
    '[data-uia*="control-bar"]',
    '[data-uia*="bottom-controls"]',
    '[data-uia*="player-controls"]',
    // Netflix control-related data attributes
    '[data-uia*="control"]',
    '[data-uia*="button"]',
    '[data-uia*="slider"]',
    '[data-uia*="bar"]',
    '.control-bar'
  ].join(',');
  
  // ============================================================================
  // NETFLIX-SPECIFIC FUNCTIONS
  // ============================================================================
  
  /**
   * Check if we're on a Netflix watch page
   * @returns {boolean} True if on a Netflix watch page
   */
  function isNetflixWatchPage() {
    return window.location.hostname === 'www.netflix.com' && 
           window.location.pathname.startsWith('/watch/');
  }
  
  /**
   * Check if a target element is a Netflix control or within a Netflix control element
   * @param {EventTarget} target - Target element from event
   * @returns {boolean} True if target is a Netflix control element
   */
  function isOverNetflixControls(target) {
    if (!target || !(target instanceof Element)) return false;
    return target.closest(NETFLIX_CONTROL_SELECTOR) !== null;
  }
  
  /**
   * Try to access Netflix's internal player API for advanced features
   * This is experimental and may not work with all Netflix versions
   */
  function tryNetflixPlayerAPI() {
    try {
      // Check if Netflix's global objects are available
      if (typeof netflix !== 'undefined' && 
          netflix.appContext && 
          netflix.appContext.state && 
          netflix.appContext.state.playerApp) {
        
        const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        if (videoPlayer && videoPlayer.getAllPlayerSessionIds) {
          const sessionIds = videoPlayer.getAllPlayerSessionIds();
          if (sessionIds && sessionIds.length > 0) {
            const player = videoPlayer.getVideoPlayerBySessionId(sessionIds[0]);
            if (player) {
              return player;
            }
          }
        }
      }
    } catch (error) {
      // Silently handle errors
    }
    return null;
  }
  
  // ============================================================================
  // EXPORT NETFLIX MODULE
  // ============================================================================
  
  // Export Netflix-specific functions to the global scope
  window.NetflixModule = {
    isWatchPage: isNetflixWatchPage,
    isOverControls: isOverNetflixControls,
    tryPlayerAPI: tryNetflixPlayerAPI,
    controlSelector: NETFLIX_CONTROL_SELECTOR
  };
  
  // Netflix module loaded (no log needed - main loader will confirm)
  
})();
