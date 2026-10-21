# SONORA — Worldwide Music + Taste Agent + MiniMax AI Studio

A responsive music-streaming-style prototype with in-page search and playback, movie-song discovery, a personal Taste Agent, local library, prototype account sign-in/sign-up, and MiniMax original-song generation.

## What works in this prototype

- Search for songs, artists, regional-language music and film soundtracks through Apple/iTunes Search and Deezer where their preview catalog APIs are available.
- Search results are normalized on the SONORA server. Track cards and play buttons both start available short previews in the bottom player; users do not get redirected to Spotify or another music website.
- Short preview audio is proxied through SONORA's own `/api/catalog/audio` route so the site can handle playback in one page.
- Taste Agent can save preferred language, genre, mood, listening situation and favourite artists. It builds a search, ranks results using the user's preferences plus browser-local listening history, then plays the best available preview.
- Sign up / sign in / sign out uses server-side session cookies (HttpOnly) and salted scrypt password hashes. Do not use this prototype auth for production without a durable database, rate monitoring, email verification and password recovery.
- MiniMax Music Generation requests run on the server. Generated audio is downloaded promptly from MiniMax and served by SONORA at `/api/music/jobs/:jobId/audio`, so the player stays on the same site. Audio/job data is held in server memory and expires after about two hours.
- Saved preferences, saved catalog tracks and created-song metadata persist in browser localStorage. Catalog preview URLs are provider-owned and may change. Generated audio itself is transient and must be generated again after the server restarts or its job expires.

## Important music rights and playback limits

Searchable catalogue previews are short previews (often around 30 seconds), not guaranteed full songs. Catalog coverage depends on the provider, region and the availability of a preview. This prototype does not scrape Spotify or bypass subscriptions. Full-length commercial tracks inside a third-party website require an appropriately licensed playback integration/service. MiniMax generation creates original music and does not unlock full playback rights for existing movie songs.

## Requirements

- Node.js 20+ recommended (Node 18.18+ supported)
- A MiniMax standard Open Platform API key with Music Generation access. Access may be restricted by account entitlement; verify your account before expecting music generation requests to succeed.

## Run locally on Windows

1. Extract this folder.
2. Open the extracted `SONORA_MiniMax_Integrated` folder.
3. Double-click `START-SONORA.bat`. It uses the standard Windows Node.js install path (if present) and installs dependencies if needed.
4. On the first run, it creates `.env` and opens it in Notepad. Replace `your_minimax_api_key_here` with your real key after `MINIMAX_API_KEY=`, save and close Notepad.
5. Double-click `START-SONORA.bat` again to launch the website. Never paste API keys into chat or frontend files, and do not commit `.env`.
6. If you prefer the terminal, open Command Prompt in this folder and run:

   ```cmd
   npm install
   npm start
   ```

6. Open `http://localhost:3000`.
7. Test **Movie Music** with a query like `RRR Telugu songs`; click anywhere on a returned track card or its play button. Try **Taste Agent** to configure preferences and launch a personalized mix. Use **Sign in / Join** to test account flows. Use **AI Song Studio** for MiniMax generation.

## Deploy on Render

1. Push this complete project folder to a GitHub repository.
2. Create a Node Web Service for that repository.
3. Set Build Command: `npm install`.
4. Set Start Command: `npm start`.
5. In Render → service → Environment, add `MINIMAX_API_KEY` with your secret key. Optionally set `MINIMAX_MUSIC_MODEL=music-3.0` and `MINIMAX_MUSIC_ENDPOINT=https://api.minimax.io/v1/music_generation`.
6. Save and deploy. Check `https://YOUR-SERVICE.onrender.com/api/health`; it returns safe configuration status and never returns your key.
7. After deployment is Live, test catalog search and playback first; then test sign-up and song generation.

## Prototype-auth note for Render

The account list is stored in `data/users.json` and sessions are held in memory. Render's free instance uses an ephemeral filesystem and memory, so user records/sessions may be lost when the service is restarted or redeployed. Use a durable hosted database and production auth provider before allowing real users or storing meaningful personal data.

## Troubleshooting

- **Catalog shows no playable tracks:** try an exact film title/song name, try a different spelling, or try another language/artist. Some songs do not have a preview in the source catalogs.
- **Track card does not play:** inspect browser DevTools Console and the Render Logs; the server audio proxy returns a status message if the provider preview is unavailable.
- **MiniMax generation fails:** check `/api/health`, confirm `MINIMAX_API_KEY` is set in Render Environment, confirm your account has Music Generation access and inspect Render runtime logs. Do not send your key to anyone.
- **User account does not persist on Render:** this is expected for the JSON-file prototype on ephemeral storage; configure a durable database before production.
