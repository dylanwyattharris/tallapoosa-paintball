# Tallapoosa Paintball Website

Multi-page site built for deployment on Vercel via GitHub.

## Structure

```
/                     → Home
/about                → About
/hco                  → Hate City Open
/hco/recap            → HCO Official Recap
/birthday             → Birthday Parties
/membership           → Pricing & Perks
/membership/signup    → Coming Soon Sign Up
/faq                  → FAQ
/weather              → Field Weather (live + 14-day forecast)
/contact              → Contact
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import repo at vercel.com
3. Deploy — no build config needed (static HTML)
4. Add custom domain in Vercel project settings

## Forms

All forms submit to Formspree endpoint in `/js/main.js`.
Update `FORMSPREE` constant to change the endpoint.

## Weather

Weather data pulls from Open-Meteo (free, no API key).
Coordinates: lat 33.7448, lon -85.2911 (Tallapoosa, GA)
