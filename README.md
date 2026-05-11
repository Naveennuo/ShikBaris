
  # React Tailwind CSS Development

  This is a code bundle for React Tailwind CSS Development. The original project is available at https://www.figma.com/design/ZYkOicND0smGdRwI4BMrF2/React-Tailwind-CSS-Development.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Downloading place images

  This project includes a Google Custom Search JSON API downloader.

  1. Create a Programmable Search Engine and API key in Google Cloud.
  2. Create `scripts/places.txt` with one place per line. You can copy `scripts/places.example.txt`.
  3. Set the credentials in PowerShell:

  ```powershell
  $env:GOOGLE_API_KEY="your-api-key"
  $env:GOOGLE_CSE_ID="your-search-engine-id"
  ```

  4. Download images:

  ```powershell
  node scripts/download-google-images.mjs --places scripts/places.txt --out src/assets/downloaded --per-place 3
  ```

  Each place gets its own folder with downloaded images and `metadata.json` containing the original image URLs and source pages.
  
