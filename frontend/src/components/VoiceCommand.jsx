import React, { useState, useEffect, useRef } from 'react';

/**
 * VoiceCommand Component
 * 
 * A React component that enables voice commands for parking operations
 * using Web Speech API (SpeechRecognition)
 * 
 * Features:
 * - Voice input with microphone button
 * - Command recognition and parsing
 * - Visual feedback for listening status
 * - Error handling for microphone permissions
 * - Support for dynamic command parameters
 */

const VoiceCommand = () => {
  // State management for voice recognition
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState('Click microphone to start');
  const [lastAction, setLastAction] = useState('');
  
  // Ref for speech recognition instance
  const recognitionRef = useRef(null);

  /**
   * Initialize Speech Recognition
   * Sets up the Web Speech API with event handlers
   */
  const initializeSpeechRecognition = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setFeedback('Speech recognition not supported in this browser');
      return null;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Event handler for successful recognition
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      processCommand(transcript);
    };

    // Event handler for recognition errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      handleRecognitionError(event.error);
    };

    // Event handler for recognition end
    recognition.onend = () => {
      setIsListening(false);
      setFeedback('Click microphone to start');
    };

    return recognition;
  };

  /**
   * Handle speech recognition errors
   * @param {string} error - The error type from speech recognition
   */
  const handleRecognitionError = (error) => {
    setIsListening(false);
    
    switch (error) {
      case 'not-allowed':
        setFeedback('Microphone permission denied. Please allow microphone access.');
        break;
      case 'no-speech':
        setFeedback('No speech detected. Please try again.');
        break;
      case 'network':
        setFeedback('Network error. Please check your connection.');
        break;
      case 'audio-capture':
        setFeedback('No microphone found. Please check audio devices.');
        break;
      default:
        setFeedback(`Recognition error: ${error}`);
    }
  };

  /**
   * Process recognized voice commands
   * Uses regex and string matching to extract commands and parameters
   * @param {string} text - The recognized speech text
   */
  const processCommand = (text) => {
    const lowerText = text.toLowerCase().trim();
    setFeedback(`Processing: "${text}"`);

    // Command patterns and their corresponding actions
    const commands = [
      {
        pattern: /find me a parking spot near (.+)/i,
        action: (match) => findParking(match[1]),
        description: 'Finding parking spot'
      },
      {
        pattern: /extend my booking by (\d+) hour/i,
        action: (match) => extendBooking(parseInt(match[1])),
        description: 'Extending booking'
      },
      {
        pattern: /extend my booking by (\d+) hours/i,
        action: (match) => extendBooking(parseInt(match[1])),
        description: 'Extending booking'
      },
      {
        pattern: /show my parking history/i,
        action: () => showHistory(),
        description: 'Showing parking history'
      },
      {
        pattern: /show history/i,
        action: () => showHistory(),
        description: 'Showing parking history'
      }
    ];

    // Try to match the recognized text with command patterns
    let commandMatched = false;
    
    for (const command of commands) {
      const match = lowerText.match(command.pattern);
      if (match) {
        command.action(match);
        setLastAction(command.description);
        setFeedback(`✅ ${command.description}`);
        commandMatched = true;
        break;
      }
    }

    // If no command matches
    if (!commandMatched) {
      setFeedback('❌ Command not recognized. Try: "Find me a parking spot near Gate 2"');
      setLastAction('No matching command');
    }
  };

  /**
   * Parking functions that would be called by voice commands
   * These are placeholder functions that would integrate with your parking system
   */

  /**
   * Find parking spot near specified location
   * @param {string} location - The gate/area to find parking near
   */
  const findParking = (location) => {
    console.log(`Finding parking near: ${location}`);
    // Integration with your parking system would go here
    // Example: call your parking API or update state
    alert(`🚗 Finding parking spot near ${location}...`);
    
    // You could call your actual parking function like:
    // yourParkingAPI.findNear(location);
  };

  /**
   * Extend booking by specified hours
   * @param {number} hours - Number of hours to extend
   */
  const extendBooking = (hours) => {
    console.log(`Extending booking by: ${hours} hours`);
    // Integration with your booking system would go here
    // Example: call your booking API or update state
    alert(`⏰ Extending booking by ${hours} hour(s)...`);
    
    // You could call your actual booking function like:
    // yourBookingAPI.extend(hours);
  };

  /**
   * Show parking history
   */
  const showHistory = () => {
    console.log('Showing parking history');
    // Integration with your history system would go here
    // Example: navigate to history page or show modal
    alert('📋 Showing parking history...');
    
    // You could call your actual history function like:
    // yourHistoryAPI.show();
  };

  /**
   * Toggle voice recognition on/off
   * Handles microphone permission and starts/stops listening
   */
  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setFeedback('Listening stopped');
    } else {
      // Start listening
      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setFeedback('🎤 Listening...');
        } catch (error) {
          console.error('Error starting recognition:', error);
          setFeedback('Error starting microphone');
        }
      }
    }
  };

  /**
   * Initialize speech recognition on component mount
   */
  useEffect(() => {
    const recognition = initializeSpeechRecognition();
    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎙️ Voice Commands
        </h2>
        <p className="text-gray-600 text-sm">
          Use your voice to control parking features
        </p>
      </div>

      {/* Microphone Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleListening}
          className={`
            relative w-20 h-20 rounded-full transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            text-white shadow-lg focus:outline-none focus:ring-4
            ${isListening ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
          `}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {/* Microphone Icon */}
          <svg 
            className="w-8 h-8 mx-auto" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            {isListening ? (
              // Stop icon
              <path d="M6 6h12v12H6zm3-6v12h6V6z"/>
            ) : (
              // Microphone icon
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91 3c-.49 0-.9-.36-.98-.85L16 13.87c.04-.28.06-.54.06-.87 0-1.65-1.35-3-3-3s-3 1.35-3 3c0 .33.02.59.06.87l.93 1.28c.08.49.49.85.98.85z"/>
            )}
          </svg>
          
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"/>
          )}
        </button>
      </div>

      {/* Feedback Display */}
      <div className="space-y-4">
        {/* Status Feedback */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`text-sm font-bold ${
              isListening ? 'text-red-600' : 'text-gray-600'
            }`}>
              {feedback}
            </span>
          </div>
        </div>

        {/* Recognized Text */}
        {recognizedText && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-700 mb-1">
              Recognized:
            </div>
            <div className="text-gray-800 font-medium">
              "{recognizedText}"
            </div>
          </div>
        )}

        {/* Last Action */}
        {lastAction && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-700 mb-1">
              Last Action:
            </div>
            <div className="text-gray-800 font-medium">
              {lastAction}
            </div>
          </div>
        )}
      </div>

      {/* Command Examples */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          📝 Try these commands:
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>"Find me a parking spot near Gate 2"</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>"Extend my booking by 1 hour"</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>"Show my parking history"</span>
          </li>
        </ul>
      </div>

      {/* Browser Compatibility Note */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-800">
          ⚠️ Note: Voice commands work best in Chrome, Edge, and Safari browsers
        </p>
      </div>
    </div>
  );
};

export default VoiceCommand;
