# Architecture of Impunity

**Portugal's accountability crisis, documented by a regular citizen who knows how to access public information**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./Dockerfile)
[![Languages](https://img.shields.io/badge/Languages-24%20EU-green)](#translations)
[![Sources](https://img.shields.io/badge/Sources-150%2B%20Public-orange)](#sources)

---

## ⚠️ Important Legal Notice

**Please read [LEGAL.md](./LEGAL.md) before using or redistributing this project.**

### Independent Research
This is an **independent academic research project** with:
- **No affiliation** with any political party, government, or media organization
- **No funding** from any entity with interests in the subject matter
- All claims attributed to official records, court documents, and established media

### Third-Party Distribution
If you choose to host, redistribute, or republish this content:
- **You assume full legal responsibility** for your publication decisions
- You must independently verify information before republication
- The original author(s) bear no responsibility for third-party use

**See [LEGAL.md](./LEGAL.md) for complete terms.**

---

## Table of Contents

1. [What This Project Documents](#what-this-project-documents)
2. [Glossary of Terms](#glossary-of-terms)
3. [Installation](#installation)
4. [Sources](#sources)
5. [Translations](#translations)

---

## What This Project Documents

This project aggregates publicly available information organized into the following sections:

### 📊 GRECO Compliance Analysis
Analysis of Portugal's compliance with the Council of Europe's anti-corruption body (GRECO):
- **Fourth Evaluation Round (2015):** Corruption prevention - MPs, judges, prosecutors
- **Fifth Evaluation Round (2024):** Central government and law enforcement
- Compliance rates compared to EU averages
- Implementation timelines and gaps

### ⚖️ Constitutional Court Rulings
Documentation of Constitutional Court decisions on anti-corruption legislation:
- **Acórdão 179/2012:** Ruling on illicit enrichment laws
- **Acórdão 377/2015:** Ruling on public officials' asset declarations
- Analysis of constitutional barriers to accountability reforms

### 🗳️ Parliamentary Voting Records
Historical voting data on anti-corruption legislation:
- Proposed reforms and their outcomes (2007-2025)
- Cross-party voting patterns
- International comparisons of legislative frameworks

### 👤 Case Studies
Public court proceedings and their outcomes involving:
- **Banking Sector:** BES collapse, CGD lending practices, Novo Banco resolution
- **Political Figures:** Cases involving former ministers and officials
- **Prescription Patterns:** Statistical analysis of case timelines

### 📈 EU Comparative Data
Portugal's position relative to other EU member states:
- Transparency International Corruption Perception Index
- Eurobarometer public trust surveys
- EU Rule of Law Report findings
- FATF evaluations

### 🔔 Whistleblower Protections
Comparison of whistleblower frameworks:
- Portuguese legislation vs EU Directive requirements
- Case studies of whistleblower outcomes
- International best practices

---

## Glossary of Terms

### Portuguese Legal Terms

| Term | English | Definition |
|------|---------|------------|
| **Segredo de Justiça** | Judicial Secrecy | Legal provision keeping investigations confidential |
| **Prescrição** | Prescription/Statute of Limitations | Time limit after which crimes cannot be prosecuted |
| **Arguido** | Formal Suspect | Person formally under investigation |
| **Acórdão** | Court Ruling | Official decision by a court |
| **Inquérito** | Investigation | Formal criminal investigation phase |
| **Ministério Público** | Public Prosecution | State prosecution service |
| **DCIAP** | Central Dept. of Investigation | Specialized anti-corruption prosecution unit |
| **Tribunal Constitucional** | Constitutional Court | Court reviewing constitutionality of laws |
| **Assembleia da República** | Parliament | Portuguese national legislature |
| **Diário da República** | Official Gazette | Official government publication |

### Institutions

| Acronym | Full Name | Role |
|---------|-----------|------|
| **GRECO** | Group of States Against Corruption | Council of Europe anti-corruption monitoring body |
| **CGD** | Caixa Geral de Depósitos | Portuguese state-owned bank |
| **BES** | Banco Espírito Santo | Former private bank (collapsed 2014) |
| **EDP** | Energias de Portugal | Major energy company |
| **PGR** | Procuradoria-Geral da República | Office of the Prosecutor General |
| **TI** | Transparency International | Global anti-corruption NGO |
| **MENAC** | National Anti-Corruption Mechanism | Portuguese anti-corruption agency (est. 2022) |

### Case Names (Operações)

| Name | Translation | Focus |
|------|-------------|-------|
| **Operação Marquês** | Operation Marquis | Investigation involving former PM José Sócrates |
| **Operação Influencer** | Operation Influencer | Investigation into government contracts (2023) |
| **Operação Face Oculta** | Operation Hidden Face | Corruption network involving state companies |
| **Operação Lex** | Operation Lex | Investigation involving prosecutors |
| **Operação Fizz** | Operation Fizz | Tax authority investigation |

### Political Parties

| Acronym | Name | Position |
|---------|------|----------|
| **PS** | Partido Socialista | Centre-left (governing 2015-2024) |
| **PSD** | Partido Social Democrata | Centre-right |
| **BE** | Bloco de Esquerda | Left |
| **PCP** | Partido Comunista Português | Communist |
| **CDS-PP** | CDS - Partido Popular | Conservative |
| **CH** | Chega | Right-wing populist |

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
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**Fedora/RHEL:**
```bash
sudo dnf install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 2: Download and Run

```bash
# Clone repository
git clone https://github.com/jlima8900/architecture-of-impunity-docker.git
cd architecture-of-impunity-docker

# Run with docker-compose
docker-compose up -d

# Visit http://localhost:8080
```

### Common Commands

| Action | Command |
|--------|---------|
| Start | `docker-compose up -d` |
| Stop | `docker-compose down` |
| View logs | `docker logs aoi` |
| Rebuild | `docker-compose build --no-cache` |

---

## Sources

All information is derived from publicly available sources:

### Official Government Sources
- [Portuguese Parliament](https://www.parlamento.pt/) - Voting records, legislation
- [Constitutional Court](https://www.tribunalconstitucional.pt/) - Rulings database
- [Diário da República](https://dre.pt/) - Official gazette
- [DCIAP](https://www.ministeriopublico.pt/) - Prosecution statements

### International Organizations
- [GRECO Evaluation Reports](https://www.coe.int/en/web/greco/evaluations/portugal) - Council of Europe
- [EU Rule of Law Reports](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/upholding-rule-law_en)
- [Transparency International CPI](https://www.transparency.org/en/cpi)
- [Eurobarometer](https://europa.eu/eurobarometer/) - Public surveys
- [FATF Evaluations](https://www.fatf-gafi.org/)

### News Media (Portuguese)
- [Público](https://www.publico.pt/)
- [Observador](https://observador.pt/)
- [Expresso](https://expresso.pt/)
- [RTP](https://www.rtp.pt/)
- [SIC Notícias](https://sicnoticias.pt/)
- [Sábado](https://www.sabado.pt/)

### News Media (International)
- [BBC](https://www.bbc.com/)
- [Financial Times](https://www.ft.com/)
- [Reuters](https://www.reuters.com/)
- [Bloomberg](https://www.bloomberg.com/)

### Investigative Journalism
- [ICIJ](https://www.icij.org/) - International Consortium of Investigative Journalists
- [OCCRP](https://www.occrp.org/) - Organized Crime and Corruption Reporting Project

**150+ source URLs are embedded throughout the project with direct links.**

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

## Contributing

- **Corrections:** Submit via GitHub Issues with supporting documentation
- **Translations:** Improvements welcome
- **Sources:** Additional public sources can be submitted

---

## Disclaimer

This project is **non-commercial**, **open source**, and published in **good faith** for academic research and public education. See [LEGAL.md](./LEGAL.md) for full legal disclaimer.

---

*"Sunlight is said to be the best of disinfectants"* - Justice Louis Brandeis
