# 小小國語學習家 v3.0 - 完整部署與發布指南 (Deployment Guide)

本文件詳細說明如何在 AI Studio 開發測試後，將前端部署至 **GitHub Pages**，並將共享資料庫與後端部署至 **Cloudflare Workers 與 D1**。

---

## 一、AI Studio 開發階段說明

在 AI Studio 開發時：
1. **前端檢索**：預設使用 L1 個人瀏覽器快取 (LocalStorage) 與公開 API（如萌典 API），在 AI Studio 預覽畫面中即可直接進行完整查詢、發音與收藏。
2. **本地模擬**：若需要測試後端 API 邏輯，可利用 Next.js API 路由 (`app/api/*`) 或在本機執行 `wrangler dev --local`。

---

## 二、正式發布與部署步驟 (Step-by-Step)

### 步驟一：建立 GitHub Repository
1. 在 GitHub 建立一個新的公開 Repository（例如 `little-mandarin`）。
2. 將專案程式碼推送至 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Little Mandarin v3.0"
   git branch -M main
   git remote add origin https://github.com/您的帳號/little-mandarin.git
   git push -u origin main
   ```

---

### 步驟二：建立與部署 Cloudflare D1 資料庫及 Workers

1. **安裝 Cloudflare Wrangler CLI**：
   ```bash
   npm install -g wrangler
   ```

2. **登入 Cloudflare 帳號**：
   ```bash
   wrangler login
   ```

3. **建立 Cloudflare D1 資料庫**：
   ```bash
   wrangler d1 create little-mandarin-db
   ```
   建立後終端機會輸出一個 `database_id`，請將其複製。

4. **更新 `cloudflare/wrangler.toml`**：
   打開 `/cloudflare/wrangler.toml`，將 `database_id = "YOUR_D1_DATABASE_ID_HERE"` 替換為您的真實 ID：
   ```toml
   name = "little-mandarin-worker"
   main = "worker/index.ts"
   compatibility_date = "2026-03-01"

   [d1_databases]
   binding = "DB"
   database_name = "little-mandarin-db"
   database_id = "您的實際D1資料庫ID"
   ```

5. **執行資料庫 Migration (建立資料表)**：
   - 遠端生產環境執行：
     ```bash
     wrangler d1 execute little-mandarin-db --remote --file=./cloudflare/migrations/0001_initial_schema.sql
     ```
   - 本地測試執行：
     ```bash
     wrangler d1 execute little-mandarin-db --local --file=./cloudflare/migrations/0001_initial_schema.sql
     ```

6. **部署 Cloudflare Worker**：
   ```bash
   cd cloudflare
   wrangler deploy
   ```
   部署成功後，Cloudflare 會提供一個 Worker 網址（例如 `https://little-mandarin-worker.您的子帳號.workers.dev`）。

---

### 步驟三：部署前端至 GitHub Pages

1. **設定靜態匯出**：
   確保 `next.config.ts` 設定為靜態匯出或配合 GitHub Pages 的 basePath（若部署在子路徑）。
2. **設定環境變數**：
   在 GitHub Repository 的 **Settings > Secrets and variables > Actions** 中，加入環境變數：
   - `NEXT_PUBLIC_API_BASE_URL` = `https://little-mandarin-worker.您的子帳號.workers.dev`
3. **設定 GitHub Actions 自動部署**：
   建立 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: 18
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: .next
   ```

---

### 步驟四：整合測試

1. 開啟您的 GitHub Pages 網址。
2. 進行字詞查詢與強制重新查詢。
3. 確認前端可順利透過 Worker 讀寫 Cloudflare D1 共享知識庫。
