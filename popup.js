/**
 * Netflix Speed Boost - Popup Settings UI
 * 
 * This script manages the settings popup interface where users can customize
 * their speed boost preferences and visual options.
 * 
 * @version 1.0.0
 * @author Varun Sapre
 */

'use strict';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Default settings for the extension
 */
const DEFAULT_SETTINGS = {
  speedBoost: 1.5,
  enableAnimation: true,
  enableText: false
};

/**
 * Speed options that the slider snaps to
 * Provides preset values for common use cases
 */
const SPEED_OPTIONS = [1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 5];

/**
 * Current speed value being edited
 */
let currentSpeed = 1.5;

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

/**
 * Load saved settings from Chrome storage and update UI
 * Syncs the UI state with stored preferences
 */
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    currentSpeed = settings.speedBoost;
    updateSlider(settings.speedBoost);
    
    // Update checkboxes
    document.getElementById('enable-animation').checked = settings.enableAnimation;
    document.getElementById('enable-text').checked = settings.enableText;
    
    // Update toggle buttons
    if (settings.enableAnimation) {
      document.getElementById('toggle-animation').classList.add('active');
    } else {
      document.getElementById('toggle-animation').classList.remove('active');
    }
    
    if (settings.enableText) {
      document.getElementById('toggle-text').classList.add('active');
    } else {
      document.getElementById('toggle-text').classList.remove('active');
    }
  });
}

/**
 * Update slider position and display to match a given speed
 * @param {number} speed - Speed multiplier to display
 */
function updateSlider(speed) {
  const index = SPEED_OPTIONS.indexOf(speed);
  if (index !== -1) {
    document.getElementById('speed-slider').value = index;
    document.getElementById('speed-value-display').textContent = `${speed}×`;
  }
}

/**
 * Find the nearest speed option index from slider value
 * Used for snapping behavior
 * @param {string|number} sliderValue - Raw slider value
 * @returns {number} Index in SPEED_OPTIONS array
 */
function getNearestSpeedIndex(sliderValue) {
  return Math.round(parseFloat(sliderValue));
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle slider input event (fires while dragging)
 * Updates display in real-time without saving
 * @param {Event} e - Input event from slider
 */
function handleSliderInput(e) {
  const sliderValue = parseFloat(e.target.value);
  const index = getNearestSpeedIndex(sliderValue);
  currentSpeed = SPEED_OPTIONS[index];
  document.getElementById('speed-value-display').textContent = `${currentSpeed}×`;
}

/**
 * Handle slider change event (fires when user releases)
 * Snaps to nearest preset value and saves setting
 * @param {Event} e - Change event from slider
 */
function handleSliderChange(e) {
  const sliderValue = parseFloat(e.target.value);
  const index = getNearestSpeedIndex(sliderValue);
  currentSpeed = SPEED_OPTIONS[index];
  
  // Smooth snap animation to nearest point
  const slider = e.target;
  slider.style.transition = 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
  
  // Snap to exact index position
  requestAnimationFrame(() => {
    slider.value = index;
  });
  
  // Reset transition after animation
  setTimeout(() => {
    slider.style.transition = '';
  }, 200);
  
  document.getElementById('speed-value-display').textContent = `${currentSpeed}×`;
  saveCurrentSettings(e.target);
}

/**
 * Save current settings to Chrome sync storage
 * Settings will sync across all Chrome browsers
 * @param {HTMLElement} sourceElement - Element that triggered the save (unused but kept for potential animations)
 */
function saveCurrentSettings(sourceElement) {
  const settings = {
    speedBoost: currentSpeed,
    enableAnimation: document.getElementById('enable-animation').checked,
    enableText: document.getElementById('enable-text').checked
  };

  chrome.storage.sync.set(settings);
}

/**
 * Reset all settings to default values
 * @param {Event} e - Click event from reset button
 */
function resetSettings(e) {
  chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
    loadSettings();
  });
}

/**
 * Handle toggle button clicks for visual options
 * Toggles between enabled/disabled state with visual feedback
 * @param {Event} e - Click event from toggle button
 */
function handleToggleClick(e) {
  const button = e.currentTarget;
  const isAnimation = button.id === 'toggle-animation';
  const checkbox = document.getElementById(isAnimation ? 'enable-animation' : 'enable-text');
  
  // Toggle state
  checkbox.checked = !checkbox.checked;
  button.classList.toggle('active');
  
  // Save with pulse animation
  saveCurrentSettings(button);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the popup when DOM is ready
 * Sets up event listeners and loads saved settings
 */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  const slider = document.getElementById('speed-slider');
  
  // Update display while dragging
  slider.addEventListener('input', handleSliderInput);
  
  // Snap and save when released
  slider.addEventListener('change', handleSliderChange);
  
  document.getElementById('reset-btn').addEventListener('click', resetSettings);
  
  // Toggle button clicks
  document.getElementById('toggle-animation').addEventListener('click', handleToggleClick);
  document.getElementById('toggle-text').addEventListener('click', handleToggleClick);
});

