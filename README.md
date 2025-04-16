# Plantique

A full‑stack IoT prototype for automated greenhouse irrigation and real‑time environmental monitoring.

⚠️ **Prototype Notice**  
This codebase is a proof‑of‑concept for a university senior project.

- No authentication/authorization
- No rate limiting or input sanitization
- Intended as a prototype only

## Table of Contents

1. [Project Highlights](#project-highlights)
2. [Prototype Scope](#prototype-scope)
3. [Expected Impact](#expected-impact)
4. [Project Architecture](#project-architecture)
5. [Deployment & Hosting](#deployment--hosting)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)

## Project Highlights

- Smart Farming System for Melon Cultivation (University Senior Project, Oct 2024 – May 2025)

- Designed a prototype Smart Farming System that automates greenhouse operations, reducing manual labor and increasing crop yield.

- Integrated Arduino‑based IoT sensors with a full‑stack React/Node.js web application to collect real‑time greenhouse data (temperature, humidity) and trigger irrigation automatically or manually.

- Implemented and validated the system in a small‑scale greenhouse at the Faculty of Engineering, Chulalongkorn University.

## Prototype Scope

- Real‑time monitoring of greenhouse conditions (temperature, humidity, soil moisture) via the web interface.

- Manual on‑demand watering control through the web interface.

- Automated irrigation based on configurable environmental thresholds.

## Deployment & Hosting

- Containerized web services running on a Raspberry Pi using Kubernetes (MicroK8s), secured and exposed via a Cloudflare Tunnel.

## Expected Impact

- Reduce manual watering interventions by automating irrigation based on real‑time sensor data.

- Improve water efficiency through configurable environmental thresholds.

- Enhance operational reliability with continuous monitoring and remote control.

## Project Architecture

```plaintext
   +----------+          +----------+          +--------------+
   | Frontend | ←────→   | Backend  | ←────→   | IoT Sensor   |
   |  React   |          |  NodeJS  |          |   Arduino    |
   +----------+          +----------+          +--------------+
                              ↓
                              │
                         +----------+
                         | Database |
                         |  MongoDB |
                         +----------+
```

- **Full‑Stack + IoT:**

  - React Frontend ↔ Node.js Backend ↔ MongoDB, plus Arduino‑based sensors.

- **Sensor Data Ingestion**

  - Arduino devices send environmental readings (temperature, humidity, soil moisture) to the Node.js backend via REST API at configurable intervals.
  - The backend broadcasts these readings to the React frontend in real time over WebSockets.

- **Remote Actuation & Control**
  - The React frontend sends watering interval configuration commands to the Node.js backend via REST API.
  - Arduino devices poll the backend for pending commands via REST API, retrieve them, and execute the actions on the hardware.

**Why not use MQTT with IoT sensors?**

- Public MQTT brokers proved unreliable in our experiments, which could compromise prototype stability.

- For a small‑scale senior project, REST API polling removes the need to manage a separate message broker.

## Project Structure

```plaintext
PLANTIQUE-PUBLIC
├── arduino/
├── backend
│   ├── routes/
│   ├── services/
│   ├── .dockerignore
│   ├── .env
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── websocket.js
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .dockerignore
│   ├── .env
│   ├── .prettierrc.json
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── favicon.ico
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── production/
├── .gitignore
├── commands.md
├── docker‑compose.yaml
├── jsconfig.json
├── README.md
└── update‑production.sh
```

## Getting Started

### Prerequisites

- Git
- Docker & Docker Compose

1. Clone the repo

   ```bash
   git clone https://github.com/veeraprachx/plantique-public.git
   cd plantique‑public
   ```

2. **Populate your credentials**  
   Search for all `__PLACEHOLDER__` tokens and replace them with your actual values.  
   _(If you skip this step, the app will still load but won’t fully run.)_

3. Launch the stack

   ```bash
   docker-compose up --build
   ```

4. Visit http://localhost:3000 in your browser.
