// src/data/concerts.js

/**
 * 演唱會資料管理系統
 * 
 * 設計目標：
 * 1. 集中管理所有演唱會資料
 * 2. 提供統一的資料存取介面
 * 3. 支援搜尋、篩選等功能
 * 4. 為未來 API 整合做準備
 * 
 * 資料結構標準化：
 * 每個演唱會物件都包含以下標準欄位：
 * - id: 唯一識別碼（數字）
 * - title: 演唱會名稱（字串）
 * - artist: 藝人名稱（字串）
 * - date: 演出日期（YYYY-MM-DD 格式）
 * - venue: 演出場館（字串）
 * - image: 宣傳圖片路徑（字串）
 * - description: 演唱會描述（字串，可選）
 * - shows: 場次資訊（陣列，可選）
 * - pricing: 票價資訊（物件，可選）
 * - seatMap: 座位圖配置（物件，可選）
 */

/**
 * 演唱會基礎資料集
 * 
 * 資料來源說明：
 * 目前使用靜態資料，包含台灣熱門藝人的演唱會資訊
 * 資料涵蓋不同類型：華語流行、K-pop、本土樂團等
 * 
 * 圖片路徑設計：
 * 所有圖片存放在 /public/img/ 目錄下
 * 使用相對路徑，方便部署到不同環境
 * 
 * 未來擴展：
 * 1. 連接後端 API 動態載入資料
 * 2. 支援資料的即時更新
 * 3. 增加更多演唱會資訊欄位
 */
export const concertsData = [
    {
    id: 1,
    title: "周杰倫 2025 世界巡迴演唱會",
    artist: "周杰倫",
    date: "2025-09-01",
    venue: "桃園國際棒球場",
    image: "/img/周杰倫 2025 世界巡迴演唱會.jfif",
    description: "華語天王周杰倫睽違多年再度登台",
    shows: [
      { id: "20250901", date: "2025-09-01", time: "19:30" }
    ],
    pricing: { A: 1500, B: 1500, C: 1000 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 2,
    title: "BLACKPINK 亞洲巡演",
    artist: "BLACKPINK",
    date: "2025-08-15",
    venue: "台北小巨蛋",
    image: "/img/BLACKPINK 亞洲巡演.jfif",
    description: "韓國女團 BLACKPINK 亞洲巡迴演唱會台北站",
    shows: [{ id: "20250815", date: "2025-08-15", time: "19:00" }],
    pricing: { A: 2000, B: 1800, C: 1500 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 3,
    title: "五月天 [回到那一天] 巡迴演唱會",
    artist: "五月天",
    date: "2025-10-05",
    venue: "台中洲際棒球場",
    image: "/img/五月天 [回到那一天] 巡迴演唱會.jpg",
    description: "五月天全新專輯巡迴演唱會",
    shows: [{ id: "20251005", date: "2025-10-05", time: "19:30" }],
    pricing: { A: 1800, B: 1600, C: 1200 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 4,
    title: "林俊傑 JJ20 演唱會",
    artist: "林俊傑",
    date: "2025-11-20",
    venue: "高雄巨蛋",
    image: "/img/林俊傑 JJ20 演唱會.jpg",
    description: "JJ 出道 20 週年紀念演唱會",
    shows: [{ id: "20251120", date: "2025-11-20", time: "19:30" }],
    pricing: { A: 2200, B: 1800, C: 1400 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 5,
    title: "張惠妹 ASMR 演唱會",
    artist: "張惠妹",
    date: "2025-12-12",
    venue: "台北小巨蛋",
    image: "/img/張惠妹 ASMR 演唱會.jpg",
    description: "阿妹全新概念演唱會",
    shows: [{ id: "20251212", date: "2025-12-12", time: "19:00" }],
    pricing: { A: 2500, B: 2000, C: 1500 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 6,
    title: "A-Lin 當我們談論愛 巡迴演唱會",
    artist: "A-Lin",
    date: "2025-09-18",
    venue: "台中圓滿戶外劇場",
    image: "/img/A-Lin 當我們談論愛 巡迴演唱會.jpg",
    description: "A-Lin 最新專輯巡迴演唱會",
    shows: [{ id: "20250918", date: "2025-09-18", time: "19:30" }],
    pricing: { A: 1800, B: 1500, C: 1200 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 7,
    title: "蔡依林 Ugly Beauty 2.0 世界巡演",
    artist: "蔡依林",
    date: "2025-10-25",
    venue: "台北小巨蛋",
    image: "/img/蔡依林 Ugly Beauty 2.0 世界巡演.jpg",
    description: "Jolin 全新概念演唱會",
    shows: [{ id: "20251025", date: "2025-10-25", time: "19:00" }],
    pricing: { A: 2500, B: 2000, C: 1500 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 8,
    title: "蘇打綠 重返舞台演唱會",
    artist: "蘇打綠",
    date: "2025-08-30",
    venue: "台北流行音樂中心",
    image: "/img/蘇打綠 重返舞台演唱會.jpeg",
    description: "蘇打綠睽違多年重返舞台",
    shows: [{ id: "20250830", date: "2025-08-30", time: "19:30" }],
    pricing: { A: 2000, B: 1700, C: 1400 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  },
  {
    id: 9,
    title: "張學友 60+ 巡迴演唱會",
    artist: "張學友",
    date: "2025-11-10",
    venue: "高雄巨蛋",
    image: "/img/張學友 60+ 巡迴演唱會.jpg",
    description: "歌神張學友 60 歲生日巡演",
    shows: [{ id: "20251110", date: "2025-11-10", time: "19:00" }],
    pricing: { A: 3000, B: 2500, C: 2000 },
    seatMap: {
      A: ["A1", "A2", "A3"],
      B: ["B1", "B2", "B3"],
      C: ["C1", "C2", "C3", "C4"]
    }
  }
]

/**
 * 根據 ID 取得演唱會資料 - 單一資料查詢功能
 * @param {number|string} id - 演唱會 ID
 * @returns {Object|undefined} 演唱會物件或 undefined
 * 
 * 使用場景：
 * 1. 訂票頁面：根據路由參數載入特定演唱會
 * 2. 詳情顯示：展示單一演唱會的完整資訊
 * 3. 資料驗證：檢查演唱會是否存在
 * 
 * 技術實現：
 * - 使用 Array.find() 進行線性搜尋
 * - parseInt() 處理字串 ID，提高相容性
 * - 時間複雜度：O(n)，資料量小時可接受
 * 
 * 為什麼使用 parseInt()：
 * Next.js 動態路由傳遞的參數是字串格式
 * 確保 ID 比較時的型別一致性
 * 
 * 錯誤處理：
 * 找不到資料時回傳 undefined，由呼叫方處理
 * 避免拋出例外，保持函數的純粹性
 */
export const getConcertById = (id) => {
  return concertsData.find(concert => concert.id === parseInt(id))
}

/**
 * 搜尋演唱會 - 多欄位模糊搜尋功能
 * @param {string} query - 搜尋關鍵字
 * @returns {Array} 符合條件的演唱會陣列
 * 
 * 搜尋策略：
 * 1. 空查詢處理：回傳全部資料
 * 2. 多欄位搜尋：標題、藝人、場館
 * 3. 模糊搜尋：使用 includes() 進行部分匹配
 * 4. 大小寫不敏感：toLowerCase() 統一處理
 * 
 * 搜尋欄位選擇：
 * - title: 演唱會名稱，最常被搜尋
 * - artist: 藝人名稱，核心搜尋條件
 * - venue: 場館名稱，地區性搜尋需求
 * 
 * 為什麼不搜尋 description：
 * 1. 描述文字較長，可能產生不精確的結果
 * 2. 使用者通常以名稱和藝人為主要搜尋目標
 * 3. 保持搜尋結果的相關性
 * 
 * 效能考量：
 * - 目前使用簡單的字串搜尋，適合小量資料
 * - 未來可考慮：全文搜尋引擎、索引優化、搜尋建議
 */
export const searchConcerts = (query) => {
  // 空查詢處理
  if (!query) return concertsData
  
  // 搜尋關鍵字預處理
  const lowercaseQuery = query.toLowerCase().trim()
  
  // 多欄位模糊搜尋
  return concertsData.filter(concert => 
    concert.title.toLowerCase().includes(lowercaseQuery) ||
    concert.artist.toLowerCase().includes(lowercaseQuery) ||
    concert.venue.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * 根據藝人過濾演唱會 - 分類瀏覽功能
 * @param {string} artist - 藝人名稱
 * @returns {Array} 該藝人的所有演唱會
 * 
 * 使用場景：
 * 1. 藝人專頁：顯示特定藝人的所有演出
 * 2. 相關推薦：同藝人的其他演唱會
 * 3. 資料分析：統計藝人演出頻率
 * 
 * 實現方式：
 * 精確匹配藝人名稱，大小寫敏感
 * 使用 Array.filter() 回傳所有符合的結果
 */
export const getConcertsByArtist = (artist) => {
  return concertsData.filter(concert => concert.artist === artist)
}

/**
 * 根據場館過濾演唱會 - 地點瀏覽功能
 * @param {string} venue - 場館名稱
 * @returns {Array} 該場館的所有演唱會
 * 
 * 使用場景：
 * 1. 場館頁面：顯示特定場館的演出
 * 2. 地理搜尋：查看附近場館的活動
 * 3. 場館分析：了解熱門演出場所
 */
export const getConcertsByVenue = (venue) => {
  return concertsData.filter(concert => concert.venue === venue)
}

/**
 * 根據日期範圍過濾演唱會 - 時間區間查詢
 * @param {string} startDate - 開始日期 (YYYY-MM-DD)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD)
 * @returns {Array} 指定時間範圍內的演唱會
 * 
 * 使用場景：
 * 1. 行程規劃：查看特定時間段的演出
 * 2. 日曆顯示：按月份顯示演唱會
 * 3. 統計分析：某時期的演出密度
 * 
 * 技術實現：
 * 使用字串比較進行日期篩選
 * YYYY-MM-DD 格式天然支援字典序比較
 */
export const getConcertsByDateRange = (startDate, endDate) => {
  return concertsData.filter(concert => 
    concert.date >= startDate && concert.date <= endDate
  )
}

/**
 * 根據價格範圍過濾演唱會 - 預算導向搜尋
 * @param {number} minPrice - 最低價格
 * @param {number} maxPrice - 最高價格
 * @returns {Array} 價格範圍內的演唱會
 * 
 * 使用場景：
 * 1. 預算篩選：在預算範圍內選擇演唱會
 * 2. 價格比較：不同價位的演出選項
 * 3. 促銷活動：特定價格範圍的優惠
 * 
 * 實現邏輯：
 * 檢查每個演唱會的最低票價是否在範圍內
 * 使用 Math.min() 取得各區域的最低價格
 * Object.values() 取得所有票價進行比較
 */
export const getConcertsByPriceRange = (minPrice, maxPrice) => {
  return concertsData.filter(concert => {
    if (!concert.pricing) return false
    
    const minConcertPrice = Math.min(...Object.values(concert.pricing))
    return minConcertPrice >= minPrice && minConcertPrice <= maxPrice
  })
}

/**
 * 取得所有藝人列表 - 資料分析功能
 * @returns {Array} 不重複的藝人名稱陣列
 * 
 * 使用場景：
 * 1. 藝人選單：下拉選單的選項資料
 * 2. 統計資訊：平台上的藝人數量
 * 3. 搜尋建議：自動完成功能的資料來源
 * 
 * 技術實現：
 * 使用 Set 去除重複藝人名稱
 * 展開運算子轉換回陣列格式
 * map() 提取藝人名稱欄位
 */
export const getAllArtists = () => {
  return [...new Set(concertsData.map(concert => concert.artist))]
}

/**
 * 取得所有場館列表 - 場地資訊功能
 * @returns {Array} 不重複的場館名稱陣列
 * 
 * 使用場景同 getAllArtists，但針對場館資訊
 */
export const getAllVenues = () => {
  return [...new Set(concertsData.map(concert => concert.venue))]
}

/**
 * 取得熱門演唱會 - 推薦系統基礎
 * @param {number} limit - 回傳數量限制
 * @returns {Array} 熱門演唱會陣列
 * 
 * 使用場景：
 * 1. 首頁推薦：展示熱門演出
 * 2. 相關推薦：用戶可能感興趣的內容
 * 3. 行銷活動：主推的演唱會
 * 
 * 目前實現：
 * 簡單回傳前 N 筆資料
 * 
 * 未來改進：
 * 1. 根據購票數量排序
 * 2. 考慮用戶偏好
 * 3. 時間加權（即將開賣的權重更高）
 * 4. 地理位置因素
 */
export const getPopularConcerts = (limit = 6) => {
  return concertsData.slice(0, limit)
}

/**
 * 資料統計功能 - 系統資訊概覽
 * @returns {Object} 資料統計物件
 * 
 * 提供資訊：
 * 1. 總演唱會數量
 * 2. 藝人數量
 * 3. 場館數量
 * 4. 價格範圍
 * 5. 時間範圍
 * 
 * 使用場景：
 * 1. 管理後台：系統資料概覽
 * 2. 統計報表：平台營運數據
 * 3. 用戶介面：顯示平台規模
 */
export const getDataStats = () => {
  const artists = getAllArtists()
  const venues = getAllVenues()
  const prices = concertsData
    .map(concert => concert.pricing ? Object.values(concert.pricing) : [])
    .flat()
  const dates = concertsData.map(concert => concert.date)

  return {
    totalConcerts: concertsData.length,
    totalArtists: artists.length,
    totalVenues: venues.length,
    priceRange: prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : null,
    dateRange: dates.length > 0 ? {
      earliest: Math.min(...dates.map(date => new Date(date))),
      latest: Math.max(...dates.map(date => new Date(date)))
    } : null
  }
}

/**
 * 預設匯出 - 向後相容性
 * 
 * 提供常用功能的快速存取
 * 保持與現有程式碼的相容性
 */
export default {
  concertsData,
  getConcertById,
  searchConcerts,
  getConcertsByArtist,
  getConcertsByVenue,
  getConcertsByDateRange,
  getConcertsByPriceRange,
  getAllArtists,
  getAllVenues,
  getPopularConcerts,
  getDataStats
}
