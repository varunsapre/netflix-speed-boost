/**
 * Netflix Speed Boost - HBO Max Module
 * 
 * HBO Max-specific functionality for the speed boost extension.
 * Handles HBO Max's unique video player structure and control elements.
 * 
 * @version 1.1.5
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
  // HBO MAX SPEED CONTROLS
  // ============================================================================
  
  let speedControlButton = null;
  let speedMenu = null;
  let currentSpeed = 1.0;
  
  /**
   * Create the speed control button for HBO Max
   */
  function createSpeedControlButton() {
    if (speedControlButton) return;
    
    // Create the speed control button
    speedControlButton = document.createElement('button');
    speedControlButton.setAttribute('data-testid', 'player-ux-speed-button');
    speedControlButton.setAttribute('aria-label', 'Playback Speed');
    speedControlButton.setAttribute('title', 'Playback Speed');
    speedControlButton.className = 'PlayerButton-Fuse-Web-Play__sc-1mvfp60-0 cqPsco';
    speedControlButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
        <text x="12" y="16" text-anchor="middle" font-size="7" font-weight="bold" fill="white">${currentSpeed}×</text>
      </svg>
    `;
    
    // Minimal styling - HBO Max's CSS classes will handle most styling
    speedControlButton.style.cssText = `
      margin-right: 8px !important;
    `;
    
    // Add hover effect
    speedControlButton.addEventListener('mouseenter', () => {
      speedControlButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      speedControlButton.style.color = 'white';
    });
    
    speedControlButton.addEventListener('mouseleave', () => {
      speedControlButton.style.backgroundColor = 'transparent';
      speedControlButton.style.color = 'rgba(255, 255, 255, 0.9)';
    });
    
    // Add click handler
    speedControlButton.addEventListener('click', toggleSpeedMenu);
    
    return speedControlButton;
  }
  
  /**
   * Create the speed menu dropdown
   */
  function createSpeedMenu() {
    if (speedMenu) return speedMenu;
    
    speedMenu = document.createElement('div');
    speedMenu.className = 'SpeedMenu-Fuse-Web-Play';
    speedMenu.style.cssText = `
      position: absolute !important;
      background: rgba(0, 0, 0, 0.9) !important;
      border-radius: 8px !important;
      padding: 8px 0 !important;
      min-width: 120px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
      z-index: 2147483647 !important;
      display: none !important;
      backdrop-filter: blur(10px) !important;
    `;
    
    // Load speed options from settings and populate menu
    chrome.storage.sync.get({ enabledSpeeds: [0.5, 0.75, 1, 1.25, 1.5, 2, 3] }, (result) => {
      const speeds = result.enabledSpeeds;
      
      speeds.forEach(speed => {
      const speedOption = document.createElement('button');
      speedOption.className = 'SpeedOption-Fuse-Web-Play';
      speedOption.textContent = `${speed}×`;
      speedOption.style.cssText = `
        display: block !important;
        width: 100% !important;
        padding: 12px 16px !important;
        background: transparent !important;
        border: none !important;
        color: rgba(255, 255, 255, 0.9) !important;
        text-align: left !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      `;
      
      if (speed === currentSpeed) {
        speedOption.style.color = 'white';
        speedOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }
      
      speedOption.addEventListener('mouseenter', () => {
        speedOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        speedOption.style.color = 'white';
      });
      
      speedOption.addEventListener('mouseleave', () => {
        if (speed === currentSpeed) {
          speedOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          speedOption.style.color = 'white';
        } else {
          speedOption.style.backgroundColor = 'transparent';
          speedOption.style.color = 'rgba(255, 255, 255, 0.9)';
        }
      });
      
      speedOption.addEventListener('click', () => {
        setPlaybackSpeed(speed);
        hideSpeedMenu();
      });
      
      speedMenu.appendChild(speedOption);
      });
    });
    
    return speedMenu;
  }
  
  /**
   * Toggle the speed menu visibility
   */
  function toggleSpeedMenu(e) {
    e.stopPropagation();
    
    if (!speedMenu) {
      createSpeedMenu();
      document.body.appendChild(speedMenu);
    }
    
    if (speedMenu.style.display === 'none' || !speedMenu.style.display) {
      showSpeedMenu();
    } else {
      hideSpeedMenu();
    }
  }
  
  /**
   * Show the speed menu
   */
  function showSpeedMenu() {
    if (!speedMenu) return;
    
    speedMenu.style.display = 'block';
    
    // Position the menu relative to the button
    if (speedControlButton) {
      const rect = speedControlButton.getBoundingClientRect();
      
      // Check if we're in fullscreen mode
      const isFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement || 
                          document.msFullscreenElement;
      
      if (isFullscreen) {
        // In fullscreen, position relative to the fullscreen element
        const fullscreenElement = isFullscreen;
        const fullscreenRect = fullscreenElement.getBoundingClientRect();
        
        // Position relative to the fullscreen container
        speedMenu.style.position = 'fixed';
        speedMenu.style.bottom = `${fullscreenRect.height - (rect.top - fullscreenRect.top) + 10}px`;
        speedMenu.style.right = `${fullscreenRect.width - (rect.right - fullscreenRect.left)}px`;
        speedMenu.style.zIndex = '2147483647';
        
        // Append to fullscreen element instead of body
        if (speedMenu.parentElement !== fullscreenElement) {
          fullscreenElement.appendChild(speedMenu);
        }
      } else {
        // Normal positioning for non-fullscreen
        speedMenu.style.position = 'absolute';
        speedMenu.style.bottom = `${window.innerHeight - rect.top + 10}px`;
        speedMenu.style.right = `${window.innerWidth - rect.right}px`;
        
        // Append to body if not already there
        if (speedMenu.parentElement !== document.body) {
          document.body.appendChild(speedMenu);
        }
      }
    }
    
    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', hideSpeedMenu);
    }, 100);
  }
  
  /**
   * Hide the speed menu
   */
  function hideSpeedMenu() {
    if (speedMenu) {
      speedMenu.style.display = 'none';
    }
    document.removeEventListener('click', hideSpeedMenu);
  }
  
  /**
   * Set the playback speed
   */
  function setPlaybackSpeed(speed) {
    const videos = getHBOMaxVideo();
    if (videos && videos.length > 0) {
      videos.forEach(video => {
        video.playbackRate = speed;
      });
      currentSpeed = speed;
      
      // Update button display
      if (speedControlButton) {
        speedControlButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
            <text x="12" y="16" text-anchor="middle" font-size="7" font-weight="bold" fill="white">${speed}×</text>
          </svg>
        `;
      }
      
      // Update menu selection
      if (speedMenu) {
        const options = speedMenu.querySelectorAll('.SpeedOption-Fuse-Web-Play');
        options.forEach(option => {
          const optionSpeed = parseFloat(option.textContent.replace('×', ''));
          if (optionSpeed === speed) {
            option.style.color = 'white';
            option.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          } else {
            option.style.color = 'rgba(255, 255, 255, 0.9)';
            option.style.backgroundColor = 'transparent';
          }
        });
      }
    }
  }
  
  /**
   * Add the speed control button to HBO Max player controls
   */
  function addSpeedControlToPlayer() {
    // Wait for HBO Max controls to be available
    const checkForControls = () => {
      // Look for the right-side control container specifically
      const rightControlsContainer = document.querySelector('.ControlsFooterBottomRight-Fuse-Web-Play__sc-1la552d-14');
      
      if (rightControlsContainer && !speedControlButton) {
        createSpeedControlButton();
        
        // Insert the speed control button at the beginning of the right controls
        // This will place it before volume, audio/subtitle, and fullscreen buttons
        rightControlsContainer.insertBefore(speedControlButton, rightControlsContainer.firstChild);
      }
    };
    
    // Check immediately and then periodically
    checkForControls();
    const interval = setInterval(() => {
      if (speedControlButton) {
        clearInterval(interval);
      } else {
        checkForControls();
      }
    }, 1000);
    
    // Clean up interval after 30 seconds
    setTimeout(() => clearInterval(interval), 30000);
  }
  
  /**
   * Initialize HBO Max speed controls
   */
  function initializeHBOMaxSpeedControls() {
    // Add speed controls when the page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addSpeedControlToPlayer);
    } else {
      addSpeedControlToPlayer();
    }
    
    // Also try to add controls when navigation happens
    const observer = new MutationObserver(() => {
      if (!speedControlButton) {
        addSpeedControlToPlayer();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  }
  
  /**
   * Handle fullscreen mode changes
   */
  function handleFullscreenChange() {
    // If menu is open and we're changing fullscreen state, reposition it
    if (speedMenu && speedMenu.style.display === 'block') {
      showSpeedMenu();
    }
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
    controlSelector: HBOMAX_CONTROL_SELECTOR,
    initializeSpeedControls: initializeHBOMaxSpeedControls
  };
  
  // HBO Max module loaded (no log needed - main loader will confirm)
  
})();
