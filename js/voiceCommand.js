/* ===================================================================
   VOICE COMMAND SYSTEM
   Speech recognition for navigation and interactions
   =================================================================== */

(function() {
  'use strict';

  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser');
    return;
  }

  // -------- VOICE COMMAND CONFIG --------
  const voiceConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
  };

  // Timeout settings
  const LISTENING_TIMEOUT = 8000; // Listen for up to 8 seconds
  const INDICATOR_DISPLAY_TIME = 5000; // Show indicator for 5 seconds
  let listeningTimeout = null;
  let indicatorTimeout = null;

  // Command mappings - voice input to section/action mappings
  const commandMap = {
    // Projects section
    'projects': { target: '#helmets', label: 'Projects' },
    'show projects': { target: '#helmets', label: 'Projects' },
    'go to projects': { target: '#helmets', label: 'Projects' },
    'my projects': { target: '#helmets', label: 'Projects' },
    'featured projects': { target: '#helmets', label: 'Projects' },

    // Experience section
    'experience': { target: '#store', label: 'Experience' },
    'show experience': { target: '#store', label: 'Experience' },
    'go to experience': { target: '#store', label: 'Experience' },
    'my experience': { target: '#store', label: 'Experience' },
    'work experience': { target: '#store', label: 'Experience' },

    // Skills section
    'skills': { target: '#partnerships', label: 'Skills' },
    'show skills': { target: '#partnerships', label: 'Skills' },
    'go to skills': { target: '#partnerships', label: 'Skills' },
    'my skills': { target: '#partnerships', label: 'Skills' },

    // Timeline section
    'timeline': { target: '#calendar', label: 'Timeline' },
    'show timeline': { target: '#calendar', label: 'Timeline' },
    'go to timeline': { target: '#calendar', label: 'Timeline' },

    // Contact section
    'contact': { target: '#socials', label: 'Contact' },
    'show contact': { target: '#socials', label: 'Contact' },
    'go to contact': { target: '#socials', label: 'Contact' },
    'reach out': { target: '#socials', label: 'Contact' },
    'get in touch': { target: '#socials', label: 'Contact' },

    // Home section
    'home': { target: '#home', label: 'Home' },
    'go home': { target: '#home', label: 'Home' },
    'go to home': { target: '#home', label: 'Home' },
    'back to home': { target: '#home', label: 'Home' },

    // GitHub
    'github': { url: 'https://github.com/Hunter12371/Hunter12371', label: 'GitHub' },
    'show github': { url: 'https://github.com/Hunter12371/Hunter12371', label: 'GitHub' },
    'open github': { url: 'https://github.com/Hunter12371/Hunter12371', label: 'GitHub' },
    'go to github': { url: 'https://github.com/Hunter12371/Hunter12371', label: 'GitHub' },
    'take me to github': { url: 'https://github.com/Hunter12371/Hunter12371', label: 'GitHub' },
  };

  // -------- DOM ELEMENTS --------
  const body = document.body;
  let voiceBtn = null;
  let voiceIndicator = null;

  // -------- VOICE RECOGNIZER INSTANCE --------
  const recognition = new SpeechRecognition();
  Object.assign(recognition, voiceConfig);

  let isListening = false;
  let currentTranscript = '';

  // -------- CREATE VOICE BUTTON & INDICATOR --------
  function createVoiceUI() {
    // Voice command button
    voiceBtn = document.createElement('button');
    voiceBtn.id = 'voice-command-btn';
    voiceBtn.className = 'voice-command-btn';
    voiceBtn.setAttribute('aria-label', 'Activate voice command');
    voiceBtn.setAttribute('title', 'Click to speak (e.g., "show projects", "go to contact")');
    voiceBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
      <span class="voice-btn-text">Voice</span>
    `;

    // Voice indicator (visual feedback)
    voiceIndicator = document.createElement('div');
    voiceIndicator.id = 'voice-indicator';
    voiceIndicator.className = 'voice-indicator';
    voiceIndicator.innerHTML = `
      <div class="voice-indicator-inner">
        <div class="voice-pulse"></div>
        <div class="voice-text">
          <span class="voice-status">Listening...</span>
          <span class="voice-transcript"></span>
        </div>
        <button class="voice-close-btn" aria-label="Close voice indicator" title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Insert voice button into navbar (before contact button)
    const navbar = document.querySelector('.nav-inner');
    if (navbar) {
      const contactBtn = navbar.querySelector('.nav-store-cta');
      if (contactBtn) {
        contactBtn.parentNode.insertBefore(voiceBtn, contactBtn);
      } else {
        navbar.appendChild(voiceBtn);
      }
    }

    // Add indicator to body
    document.body.appendChild(voiceIndicator);
  }

  // -------- NAVIGATE TO SECTION --------
  function navigateToSection(target) {
    const element = document.querySelector(target);
    if (element) {
      // Trigger scroll animation
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update active nav link
      updateActiveNavLink(target);
      
      return true;
    }
    return false;
  }

  // -------- UPDATE ACTIVE NAV LINK --------
  function updateActiveNavLink(target) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const navId = target.replace('#', 'nav-');
    const activeLink = document.getElementById(navId);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // -------- START LISTENING --------
  function startListening() {
    if (isListening) return;

    isListening = true;
    currentTranscript = '';
    voiceBtn.classList.add('listening');
    voiceIndicator.classList.add('active');

    // Clear any existing timeouts
    clearTimeout(listeningTimeout);
    clearTimeout(indicatorTimeout);

    // Update status
    updateIndicatorStatus('Listening...', 'Speak now');

    // Auto-stop listening after timeout
    listeningTimeout = setTimeout(() => {
      if (isListening) {
        console.log('Listening timeout reached');
        stopListening();
      }
    }, LISTENING_TIMEOUT);

    recognition.start();
  }

  // -------- STOP LISTENING --------
  function stopListening() {
    if (!isListening) return;
    
    isListening = false;
    voiceBtn.classList.remove('listening');
    
    clearTimeout(listeningTimeout);

    recognition.stop();
  }

  // -------- UPDATE INDICATOR STATUS --------
  function updateIndicatorStatus(status, transcript = '') {
    if (!voiceIndicator) return;
    
    const statusEl = voiceIndicator.querySelector('.voice-status');
    const transcriptEl = voiceIndicator.querySelector('.voice-transcript');
    
    if (statusEl) statusEl.textContent = status;
    if (transcriptEl && transcript) transcriptEl.textContent = transcript;
  }

  // -------- PROCESS COMMAND --------
  function processCommand(transcript) {
    // Normalize transcript: lowercase and trim
    const normalized = transcript.toLowerCase().trim();

    // Direct match
    if (commandMap[normalized]) {
      const command = commandMap[normalized];
      showVoiceNotification(`Going to ${command.label}...`);
      if (command.url) {
        window.open(command.url, '_blank', 'noopener,noreferrer');
      } else {
        navigateToSection(command.target);
      }
      return true;
    }

    // Fuzzy match - check if any command word appears in transcript
    for (const [command, action] of Object.entries(commandMap)) {
      const words = command.split(' ');
      if (words.some(word => normalized.includes(word))) {
        // Found a partial match
        showVoiceNotification(`Going to ${action.label}...`);
        if (action.url) {
          window.open(action.url, '_blank', 'noopener,noreferrer');
        } else {
          navigateToSection(action.target);
        }
        return true;
      }
    }

    // No command found
    showVoiceNotification(`Sorry, I didn't understand "${transcript}"`);
    return false;
  }

  // -------- SHOW VOICE NOTIFICATION --------
  function showVoiceNotification(message) {
    updateIndicatorStatus('Command recognized!', message);
    voiceIndicator.classList.add('active');

    // Keep indicator visible for longer
    clearTimeout(indicatorTimeout);
    indicatorTimeout = setTimeout(() => {
      voiceIndicator.classList.remove('active');
    }, INDICATOR_DISPLAY_TIME);
  }

  // -------- SPEECH RECOGNITION EVENTS --------
  recognition.onstart = function() {
    console.log('Voice recognition started');
  };

  recognition.onresult = function(event) {
    // Build transcript from results
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        currentTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    // Update displayed transcript with better feedback
    const fullTranscript = (currentTranscript + interimTranscript).trim();
    const transcriptElement = voiceIndicator.querySelector('.voice-transcript');
    if (transcriptElement && fullTranscript) {
      transcriptElement.textContent = fullTranscript;
      transcriptElement.style.opacity = '1';
    }

    // If we have interim results, show them in real time
    if (interimTranscript) {
      updateIndicatorStatus('Listening...', fullTranscript);
    }
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    
    let errorMessage = 'Error: ';
    switch(event.error) {
      case 'network':
        errorMessage += 'Network error';
        break;
      case 'no-speech':
        errorMessage += 'No speech detected';
        break;
      case 'audio-capture':
        errorMessage += 'No microphone found';
        break;
      default:
        errorMessage += event.error;
    }

    showVoiceNotification(errorMessage);
    stopListening();
  };

  recognition.onend = function() {
    console.log('Voice recognition ended');
    
    // Process final transcript if available
    if (currentTranscript.trim()) {
      const success = processCommand(currentTranscript.trim());
      // Keep indicator showing for longer if command was processed
      clearTimeout(indicatorTimeout);
      indicatorTimeout = setTimeout(() => {
        voiceIndicator.classList.remove('active');
        stopListening();
      }, INDICATOR_DISPLAY_TIME);
    } else {
      // No transcript captured
      updateIndicatorStatus('No speech detected', 'Please try again');
      voiceIndicator.classList.add('active');
      clearTimeout(indicatorTimeout);
      indicatorTimeout = setTimeout(() => {
        voiceIndicator.classList.remove('active');
        stopListening();
      }, 2000);
    }
  };

  // -------- VOICE BUTTON CLICK HANDLER --------
  document.addEventListener('DOMContentLoaded', function() {
    createVoiceUI();

    if (voiceBtn) {
      voiceBtn.addEventListener('click', function() {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      });
    }

    // Close button on indicator
    const closeBtn = document.querySelector('.voice-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        voiceIndicator.classList.remove('active');
        if (isListening) {
          stopListening();
        }
      });
    }

    // Stop listening when escape key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isListening) {
        stopListening();
      }
    });
  });

  // -------- EXPOSE PUBLIC API (optional) --------
  window.VoiceCommand = {
    startListening,
    stopListening,
    processCommand,
  };

})();
