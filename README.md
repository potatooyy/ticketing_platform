## 1. 簡介
這是一個簡易的演唱會售票系統，是我和成員的前後端分離練習專案：
前端採用 React + Next.js，並使用 node.js + pnpm 管理
後端採用 Django(DRF)，使用 uv 管理
資料庫採用 SQLite

## 2. 演唱會售票系統簡介：
一般使用者可以註冊會員選擇演唱會、座位並購買票券；
平台管理者則可透過後臺查看、新增、刪除、些改所有資料，包括演唱會、訂單、使用者等

![螢幕擷取畫面 2025-08-31 235532_compressed](https://hackmd.io/_uploads/BJGcxxMcge.jpg)
![螢幕擷取畫面 2025-08-31 235722](https://hackmd.io/_uploads/Hy0ZWezcll.png)
![image](https://hackmd.io/_uploads/SyLSblz9lg.png)
![image](https://hackmd.io/_uploads/ByWKbxfcxl.png)
![image](https://hackmd.io/_uploads/Bkk2ZgG9gl.png)

![image](https://hackmd.io/_uploads/BJfXPLGqll.png)
![image](https://hackmd.io/_uploads/Bk8ND8fcgg.png)
![image](https://hackmd.io/_uploads/By2wwIz5xx.png)
![image](https://hackmd.io/_uploads/r1IiLIM5el.png)
![image](https://hackmd.io/_uploads/HkG1PIfceg.png)
![image](https://hackmd.io/_uploads/B1YnDLzclx.png)

## 3. 安裝說明

### 3.1. 安裝 node.js + pnpm + uv + Git
為了順利運行專案，請先在系統上安裝以下開發工具：
1. 安裝 Node.js
https://nodejs.org/en/download
2. 安裝 pnpm
https://pnpm.io/installation
3. 安裝 uv
https://docs.astral.sh/uv/getting-started/installation/#__tabbed_1_1
4. 安裝 Git
https://git-scm.com/downloads

### 3.2. git clone repo

```bash=
# HTTPS
git clone https://github.com/potatooyy/202507-python-DRF.git
# SSH
git clone git@github.com:potatooyy/202507-python-DRF.git
```

### 3.3. 開發環境設置及運行專案

#### 3.3.1. backend
1. 進入 backend 目錄，執行以下指令設置虛擬環境與安裝相依套件：
```bash=
uv venv # 設置虛擬環境
uv sync # 安裝 backend 相關套件及依賴
```
2. 創建 superuser 帳號與密碼，以登入並操作管理後台：
```bash=
uv run python manage.py createsuperuser
```
3. 啟動 Django 開發伺服器：
```bash=
uv run python manage.py runserver
```
#### 3.3.2. frontend
1. 進入 frontend 目錄，安裝相關套件及依賴：
```bash=
pnpm install # 安裝 frontend 相關套件及依賴
```
2. 在 frontend 目錄增加 .env.local 檔案，內容如下：
```env=
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_ADMIN_URL=http://127.0.0.1:8000/admin
```
3. 啟動前端開發伺服器：
```bash=
pnpm run dev
```
#### 3.3.3. 瀏覽器瀏覽
啟動前後端伺服器後，開啟瀏覽器並輸入：
```text=
http://127.0.0.1:3000
```
即可檢視前端畫面。

## 4. 專案目錄結構

```text=
.
├── backend
└── frontend
```
Backend 目錄結構
```text=
backend
├── apps
│   ├── concerts
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── migrations
│   │   ├── models.py
│   │   ├── __pycache__
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── orders
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── migrations
│   │   ├── __pycache__
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── payments
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   ├── urls.py
│   │   └── views.py
│   └── users
│       ├── admin.py
│       ├── apps.py
│       ├── __init__.py
│       ├── migrations
│       ├── models.py
│       ├── __pycache__
│       ├── serializers.py
│       ├── tests.py
│       └── views.py
├── backend
│   ├── asgi.py
│   ├── __init__.py
│   ├── __pycache__
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── config.py
├── db.sqlite3
├── main.py
├── manage.py
├── media
│   └── concert_images
│       ├── A-Lin_當我們談論愛_巡迴演唱會.jpg
│       ├── BLACKPINK_亞洲巡演.jfif
│       ├── 五月天_回到那一天_巡迴演唱會.jpg
│       ├── 周杰倫_2025_世界巡迴演唱會.jfif
│       ├── 張學友_60_巡迴演唱會.jpg
│       ├── 張惠妹_ASMR_演唱會.jpg
│       ├── 林俊傑_JJ20_演唱會.jpg
│       ├── 蔡依林_Ugly_Beauty_2.0_世界巡演.jpg
│       └── 蘇打綠_重返舞台演唱會.jpeg
├── pyment_generator.py
├── pyproject.toml
├── README.md
├── sdk
│   └── ecpay_payment_sdk.py
├── staticfiles
├── test_sdk.py
└── uv.lock
```
Frontend 目錄結構
```text=
frontend
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── public
├── README.md
└── src
    ├── app
    │   ├── (auth)
    │   │   ├── login
    │   │   │   └── page.js
    │   │   └── register
    │   │       └── page.js
    │   ├── booking
    │   │   └── [id]
    │   │       └── page.js
    │   ├── cart
    │   │   └── page.js
    │   ├── concerts
    │   │   └── page.js
    │   ├── globals.css
    │   ├── info
    │   │   └── [id]
    │   │       └── page.js
    │   ├── layout.js
    │   ├── page.js
    │   ├── page.module.css
    │   ├── search
    │   │   ├── page.js
    │   │   └── SearchContent.js
    │   └── tickets
    │       └── page.js
    ├── components
    │   ├── booking
    │   │   ├── PriceTable.js
    │   │   └── SeatMap.js
    │   ├── concerts
    │   │   ├── ConcertCard.js
    │   │   └── ConcertCarousel.js
    │   └── layout
    │       ├── 4.js
    │       ├── Footer.js
    │       └── Header.js
    ├── data
    │   └── concerts.js
    ├── hooks
    │   ├── useAuthHelper.js
    │   ├── useAuth.js
    │   └── useCart.js
    └── utils
        └── api.js

```

## 5. 尚未完善之處

因開發時尚未有HTTPS環境，因此沒有做到綠界金流的Callback改票券結帳狀態

