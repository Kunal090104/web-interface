// Initialize Particle Background
particlesJS("particles-js", {
  particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#8a2be2" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#8a2be2", opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1, direction: "none", random: true }
  }
});

// DOM Elements
const toast = document.getElementById('notification-toast');
const settingsModal = document.getElementById('settings-modal');
const applianceModal = document.getElementById('appliance-modal');
const settingsBtn = document.getElementById('settings-btn');
const connectBtn = document.getElementById('connect-btn');
const closeModals = document.querySelectorAll('.close-modal');
const saveSettingsBtn = document.getElementById('save-settings');
const saveApplianceSettingsBtn = document.getElementById('save-appliance-settings');
const applianceSettingsBtns = document.querySelectorAll('.settings-btn');

// Arduino Communication System
let serialPort;
let writer;
let reader;
let keepReading = false;
const appliances = {
  light: { 
      toggle: document.getElementById('light-toggle'), 
      status: document.getElementById('light-status'), 
      card: document.getElementById('light-card') 
  },
  fan: { 
      toggle: document.getElementById('fan-toggle'), 
      status: document.getElementById('fan-status'), 
      card: document.getElementById('fan-card') 
  },
  ac: { 
      toggle: document.getElementById('ac-toggle'), 
      status: document.getElementById('ac-status'), 
      card: document.getElementById('ac-card') 
  },
  tv: { 
      toggle: document.getElementById('tv-toggle'), 
      status: document.getElementById('tv-status'), 
      card: document.getElementById('tv-card') 
  },
  curtains: { 
      toggle: document.getElementById('curtains-toggle'), 
      status: document.getElementById('curtains-status'), 
      card: document.getElementById('curtains-card') 
  },
  security: { 
      toggle: document.getElementById('security-toggle'), 
      status: document.getElementById('security-status'), 
      card: document.getElementById('security-card') 
  }
};

// Show notification toast
function showToast(message, isSuccess = true) {
  const toastContent = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-content i');
  
  toastContent.textContent = message;
  toastIcon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  toastIcon.style.color = isSuccess ? '#00ff88' : '#ff4757';
  toast.style.borderLeftColor = isSuccess ? '#00ff88' : '#ff4757';
  
  toast.classList.add('show');
  
  setTimeout(() => {
      toast.classList.remove('show');
  }, 3000);
}

// Close toast when X is clicked
toast.querySelector('.toast-close').addEventListener('click', () => {
  toast.classList.remove('show');
});

// Modal Controls
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeModals.forEach(btn => {
  btn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
      applianceModal.style.display = 'none';
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
  }
  if (e.target === applianceModal) {
      applianceModal.style.display = 'none';
  }
});

// Appliance Settings
applianceSettingsBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const appliance = btn.getAttribute('data-appliance');
      openApplianceSettings(appliance);
  });
});

function openApplianceSettings(appliance) {
  const title = document.getElementById('appliance-modal-title');
  const body = document.getElementById('appliance-settings-body');
  
  title.textContent = `${appliance.charAt(0).toUpperCase() + appliance.slice(1)} Settings`;
  
  // Generate dynamic settings based on appliance
  let settingsHTML = '';
  
  switch(appliance) {
      case 'light':
          settingsHTML = `
              <div class="setting-item">
                  <label>Brightness</label>
                  <input type="range" min="0" max="100" value="100" class="slider" id="light-brightness">
              </div>
              <div class="setting-item">
                  <label>Color Temperature</label>
                  <select id="light-temperature">
                      <option value="warm">Warm (2700K)</option>
                      <option value="neutral" selected>Neutral (4000K)</option>
                      <option value="cool">Cool (6500K)</option>
                  </select>
              </div>
          `;
          break;
      case 'fan':
          settingsHTML = `
              <div class="setting-item">
                  <label>Speed</label>
                  <input type="range" min="1" max="5" value="3" class="slider" id="fan-speed">
              </div>
          `;
          break;
      case 'ac':
          settingsHTML = `
              <div class="setting-item">
                  <label>Temperature</label>
                  <input type="range" min="16" max="30" value="22" class="slider" id="ac-temp">
              </div>
              <div class="setting-item">
                  <label>Mode</label>
                  <select id="ac-mode">
                      <option value="cool">Cool</option>
                      <option value="heat">Heat</option>
                      <option value="dry">Dry</option>
                      <option value="fan">Fan</option>
                  </select>
              </div>
          `;
          break;
      default:
          settingsHTML = `<p>No additional settings available for this appliance.</p>`;
  }
  
  body.innerHTML = settingsHTML;
  applianceModal.style.display = 'flex';
}

// Save appliance settings
saveApplianceSettingsBtn.addEventListener('click', () => {
  // Here you would send the settings to Arduino
  showToast('Appliance settings saved!');
  applianceModal.style.display = 'none';
});

// Save system settings
saveSettingsBtn.addEventListener('click', () => {
  showToast('System settings saved!');
  settingsModal.style.display = 'none';
});

// Connect to Arduino
connectBtn.addEventListener('click', async () => {
  try {
      if (serialPort && serialPort.readable) {
          // Disconnect if already connected
          keepReading = false;
          if (reader) {
              await reader.cancel();
          }
          if (writer) {
              await writer.close();
          }
          await serialPort.close();
          connectBtn.innerHTML = '<i class="fas fa-plug"></i> Connect';
          showToast('Disconnected from Arduino', false);
          return;
      }
      
      connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting';
      
      // Request and open serial port
      serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 9600 });
      
      writer = serialPort.writable.getWriter();
      reader = serialPort.readable.getReader();
      keepReading = true;
      
      connectBtn.innerHTML = '<i class="fas fa-plug"></i> Disconnect';
      showToast('Arduino Connected Successfully!');
      
      // Start reading from serial port
      readSerialData();
      
      // Initialize all appliances to OFF
      Object.keys(appliances).forEach(appliance => {
          appliances[appliance].toggle.checked = false;
          updateApplianceUI(appliance, false);
      });
      
  } catch (error) {
      console.error("Connection error:", error);
      connectBtn.innerHTML = '<i class="fas fa-plug"></i> Connect';
      showToast(`Connection failed: ${error.message}`, false);
  }
});

// Read data from serial port
async function readSerialData() {
  try {
      while (keepReading && reader) {
          const { value, done } = await reader.read();
          if (done) {
              reader.releaseLock();
              break;
          }
          
          if (value) {
              const data = new TextDecoder().decode(value);
              console.log("Received:", data);
              processIncomingData(data);
          }
      }
  } catch (error) {
      console.error("Serial read error:", error);
      showToast("Serial connection error", false);
      if (writer) {
          writer.releaseLock();
          writer = null;
      }
      if (reader) {
          reader.releaseLock();
          reader = null;
      }
      connectBtn.innerHTML = '<i class="fas fa-plug"></i> Connect';
  }
}

// Process incoming data from Arduino
function processIncomingData(data) {
  // Example data format: "light_on", "fan_off", etc.
  const parts = data.trim().split('_');
  if (parts.length === 2) {
      const appliance = parts[0];
      const state = parts[1];
      
      if (appliances[appliance]) {
          const isOn = state === 'on';
          appliances[appliance].toggle.checked = isOn;
          updateApplianceUI(appliance, isOn);
      }
  }
}

// Send commands to Arduino
async function sendCommand(command) {
  if (!writer) {
      showToast("Please connect to Arduino first!", false);
      return;
  }
  
  try {
      await writer.write(new TextEncoder().encode(command + '\n'));
      console.log("Sent:", command);
  } catch (error) {
      console.error("Send error:", error);
      showToast("Failed to send command", false);
      writer = null;
  }
}

// Update appliance UI state
function updateApplianceUI(applianceName, isOn) {
  const appliance = appliances[applianceName];
  appliance.status.textContent = isOn ? "ON" : "OFF";
  appliance.status.className = isOn ? "status on" : "status off";
  
  if (isOn) {
      appliance.card.classList.add('active');
  } else {
      appliance.card.classList.remove('active');
  }
}

// Add event listeners for all appliances
Object.entries(appliances).forEach(([name, { toggle, card }]) => {
  toggle.addEventListener('change', () => {
      const cmd = `${name}_${toggle.checked ? 'on' : 'off'}`;
      sendCommand(cmd);
      updateApplianceUI(name, toggle.checked);
  });
  
  // Allow clicking anywhere on card to toggle
  card.addEventListener('click', (e) => {
      if (e.target !== toggle && !e.target.classList.contains('slider') && 
          !e.target.classList.contains('settings-btn') && 
          !e.target.closest('.settings-btn')) {
          toggle.checked = !toggle.checked;
          toggle.dispatchEvent(new Event('change'));
      }
  });
});

// Theme selector
document.getElementById('theme-selector').addEventListener('change', (e) => {
  const theme = e.target.value;
  let primaryColor;
  
  switch(theme) {
      case 'blue':
          primaryColor = '#2b73e2';
          break;
      case 'green':
          primaryColor = '#2be272';
          break;
      case 'red':
          primaryColor = '#e22b2b';
          break;
      default:
          primaryColor = '#8a2be2';
  }
  
  document.documentElement.style.setProperty('--primary', primaryColor);
  document.documentElement.style.setProperty('--primary-light', `${primaryColor}99`);
});