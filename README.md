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

## Quick Start

```bash
# Clone and run
git clone https://github.com/jlima8900/architecture-of-impunity-docker.git
cd architecture-of-impunity-docker
docker-compose up -d

# Visit http://localhost:8080
```

## Manual Docker Commands

```bash
# Build
docker build -t architecture-of-impunity .

# Run
docker run -d -p 8080:80 --name aoi architecture-of-impunity

# Stop
docker stop aoi && docker rm aoi
```

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

## Translations

Available in all 24 EU official languages:
bg, cs, da, de, el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl, pl, pt, ro, sk, sl, sv

## Research Methodology

1. Systematic collection from official government databases
2. Cross-referencing across multiple independent sources
3. Temporal verification using archived sources
4. Legal document analysis of court rulings
5. Statistical validation against EU datasets

## Contributing

- **Corrections:** Submit via GitHub Issues with supporting documentation
- **Translations:** Improvements to machine translations welcome
- **Sources:** Additional public sources can be submitted for inclusion

## Disclaimer

This project is:
- **Non-commercial** - No advertising or revenue
- **Open source** - Freely available
- **Academic** - For research and public education
- **Good faith** - No malicious intent

See [LEGAL.md](./LEGAL.md) for full legal disclaimer.

---

*"Sunlight is said to be the best of disinfectants"* - Justice Louis Brandeis
