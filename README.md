EliteHome Control Pro is a modern web-based dashboard for controlling smart home appliances connected to an Arduino microcontroller.
This responsive interface allows users to toggle devices, adjust settings, and monitor the status of their smart home ecosystem.

Features

Interactive UI: Sleek, animated interface with particle background
Appliance Control: Toggle lights, fans, AC, TV, curtains, and security system
Real-time Status: Visual indicators for device states
Appliance Settings: Customize settings for each connected device
Arduino Integration: Web Serial API communication with Arduino
Responsive Design: Works on desktop, tablet, and mobile devices
Theme Customization: Multiple color themes available
Technologies Used

HTML5, CSS3, JavaScript (ES6+)
Particles.js for animated background
Font Awesome for icons
Web Serial API for Arduino communication
Setup Instructions

Prerequisites

Arduino board with serial communication capability
Modern browser that supports Web Serial API (Chrome/Edge 89+, Opera 76+)

Installation

Clone this repository:
bash
Copy
git clone https://github.com/yourusername/elitehome-control-pro.git
Navigate to the project directory:
bash
Copy
cd elitehome-control-pro
Open index.html in your browser.
Arduino Setup

Upload the corresponding Arduino sketch to your board (see arduino/ directory for examples)
Connect your Arduino via USB
Click "Connect" in the web interface and select your Arduino device
Usage

Toggle Appliances: Click on any appliance card or toggle switch to turn devices on/off
Adjust Settings: Click the gear icon on any appliance card to access advanced settings
System Settings: Click the cog icon in the top-right to change theme and preferences
File Structure

Copy
elitehome-control-pro/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # Main JavaScript
├── README.md           # This file
└── assets/             # Additional assets (images, etc.)
Contributing

Contributions are welcome! Please follow these steps:

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

Inspired by modern smart home interfaces
Uses Particles.js for beautiful background effects
Font Awesome for high-quality icons
Support


