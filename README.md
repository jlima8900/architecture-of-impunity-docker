# Architecture of Impunity

**An academic research compilation documenting Portugal's political accountability systems**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./Dockerfile)
[![Languages](https://img.shields.io/badge/Languages-24%20EU-green)](#translations)
[![Sources](https://img.shields.io/badge/Sources-150%2B%20Public-orange)](#sources)

---

## ⚠️ Important Legal Notice

**Please read [LEGAL.md](./LEGAL.md) before using this project.**

This is an academic research compilation based exclusively on publicly available sources. All claims are attributed to official government records, court documents, international organization reports, and established news media.

---

## Overview

This project aggregates publicly available information about:

- GRECO (Council of Europe) compliance evaluations
- Constitutional Court rulings on anti-corruption legislation
- Parliamentary voting records on accountability reforms
- Public court proceedings and their outcomes
- EU and international comparative data

---

## Installation

### Step 1: Install Docker

#### 🍎 macOS

**Option A: Docker Desktop (Recommended)**
1. Download from https://www.docker.com/products/docker-desktop/
2. Double-click the `.dmg` file
3. Drag Docker to Applications
4. Open Docker from Applications
5. Wait for Docker to start (whale icon in menu bar)

**Option B: Homebrew**
```bash
brew install --cask docker
open -a Docker
```

#### 🪟 Windows

**Requirements:** Windows 10/11 (64-bit) with WSL2

1. **Enable WSL2** (if not already):
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart your computer

2. **Install Docker Desktop:**
   - Download from https://www.docker.com/products/docker-desktop/
   - Run the installer
   - Follow the setup wizard
   - Restart if prompted

3. **Verify installation:**
   - Open PowerShell or Command Prompt
   - Run: `docker --version`

#### 🐧 Linux

**Ubuntu/Debian:**
```bash
# Update packages
sudo apt update

# Install Docker
sudo apt install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

**Fedora/RHEL:**
```bash
sudo dnf install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**Arch Linux:**
```bash
sudo pacman -S docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

---

### Step 2: Download This Project

#### Option A: Git Clone
```bash
git clone https://github.com/jlima8900/architecture-of-impunity-docker.git
cd architecture-of-impunity-docker
```

#### Option B: Download ZIP
1. Click the green "Code" button above
2. Select "Download ZIP"
3. Extract the ZIP file
4. Open terminal/command prompt in extracted folder

---

### Step 3: Run the Container

#### 🍎 macOS / 🐧 Linux

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or manually
docker build -t architecture-of-impunity .
docker run -d -p 8080:80 --name aoi architecture-of-impunity
```

#### 🪟 Windows (PowerShell or Command Prompt)

```powershell
# Using docker-compose (recommended)
docker-compose up -d

# Or manually
docker build -t architecture-of-impunity .
docker run -d -p 8080:80 --name aoi architecture-of-impunity
```

---

### Step 4: View the Project

Open your browser and visit: **http://localhost:8080**

---

## Common Commands

| Action | Command |
|--------|---------|
| Start | `docker-compose up -d` |
| Stop | `docker-compose down` |
| View logs | `docker logs aoi` |
| Rebuild | `docker-compose build --no-cache` |
| Remove container | `docker rm -f aoi` |

---

## Troubleshooting

### Docker not starting (macOS)
```bash
open -a Docker
# Wait 30 seconds for it to initialize
```

### Docker not starting (Windows)
1. Open Docker Desktop from Start Menu
2. Wait for "Docker is running" status
3. If WSL error: Run `wsl --update` in PowerShell (Admin)

### Port 8080 already in use
```bash
# Use a different port
docker run -d -p 9090:80 --name aoi architecture-of-impunity
# Then visit http://localhost:9090
```

### Permission denied (Linux)
```bash
sudo docker-compose up -d
# Or add yourself to docker group (see Linux install above)
```

---

## Sources

All information is derived from publicly available sources:

### Official Sources
- Portuguese Parliament (Assembleia da República)
- Constitutional Court of Portugal
- Diário da República (Official Gazette)
- DCIAP Public Statements

### International Organizations
- [GRECO Evaluation Reports](https://www.coe.int/en/web/greco/evaluations/portugal)
- [EU Rule of Law Reports](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/upholding-rule-law_en)
- [Transparency International CPI](https://www.transparency.org/en/cpi)
- [Eurobarometer Surveys](https://europa.eu/eurobarometer/)

### News Media
- Público, Observador, Expresso, RTP (Portugal)
- BBC, Financial Times, Reuters, Bloomberg (International)
- ICIJ, OCCRP (Investigative Consortiums)

**150+ source URLs are embedded throughout the project with direct links to original sources.**

---

## Translations

Available in all 24 EU official languages:

| | | | | |
|--|--|--|--|--|
| 🇧🇬 Bulgarian | 🇨🇿 Czech | 🇩🇰 Danish | 🇩🇪 German | 🇬🇷 Greek |
| 🇬🇧 English | 🇪🇸 Spanish | 🇪🇪 Estonian | 🇫🇮 Finnish | 🇫🇷 French |
| 🇮🇪 Irish | 🇭🇷 Croatian | 🇭🇺 Hungarian | 🇮🇹 Italian | 🇱🇹 Lithuanian |
| 🇱🇻 Latvian | 🇲🇹 Maltese | 🇳🇱 Dutch | 🇵🇱 Polish | 🇵🇹 Portuguese |
| 🇷🇴 Romanian | 🇸🇰 Slovak | 🇸🇮 Slovenian | 🇸🇪 Swedish | |

---

## Research Methodology

1. Systematic collection from official government databases
2. Cross-referencing across multiple independent sources
3. Temporal verification using archived sources
4. Legal document analysis of court rulings
5. Statistical validation against EU datasets

---

## Contributing

- **Corrections:** Submit via GitHub Issues with supporting documentation
- **Translations:** Improvements to machine translations welcome
- **Sources:** Additional public sources can be submitted for inclusion

---

## Disclaimer

This project is:
- **Non-commercial** - No advertising or revenue
- **Open source** - Freely available
- **Academic** - For research and public education
- **Good faith** - No malicious intent

See [LEGAL.md](./LEGAL.md) for full legal disclaimer.

---

*"Sunlight is said to be the best of disinfectants"* - Justice Louis Brandeis
