import time
import hashlib
import urllib.parse
from datetime import datetime


class SimplePaymentGenerator:
    """簡單的綠界付款頁面生成器"""

    def __init__(self):
        # 綠界測試環境參數，正式環境請改變數或從設定檔注入
        self.merchant_id = '2000132'
        self.hash_key = '5294y06JbISpM5x9'
        self.hash_iv = 'v77hoKGq4kWxNNIS'
        self.action_url = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'

    def generate_trade_no(self):
        """產生唯一訂單編號，包含 TEST + UNIX 時間戳"""
        return f"TEST{int(time.time())}"

    def generate_check_mac_value(self, params):
        """計算綠界 CheckMacValue，保持算法一致"""
        # 移除空值及 CheckMacValue 本身
        filtered_params = {
            k: str(v) for k, v in params.items()
            if k != 'CheckMacValue' and v is not None and str(v).strip() != ''
        }
        # 按鍵排序
        sorted_params = sorted(filtered_params.items())
        query_str = '&'.join(f"{k}={v}" for k, v in sorted_params)
        raw_str = f"HashKey={self.hash_key}&{query_str}&HashIV={self.hash_iv}"
        encoded_str = urllib.parse.quote_plus(raw_str).lower()
        return hashlib.sha256(encoded_str.encode('utf-8')).hexdigest().upper()

    def create_payment_page(self, item_name="Test Product", amount=100, choose_payment="Credit"):
        """
        動態產生付款表單 HTML 字串，不寫檔案
        """
        trade_no = self.generate_trade_no()
        params = {
            'MerchantID': self.merchant_id,
            'MerchantTradeNo': trade_no,
            'MerchantTradeDate': datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
            'PaymentType': 'aio',
            'TotalAmount': str(amount),
            'TradeDesc': item_name,
            'ItemName': item_name,
            'ReturnURL': 'http://localhost:3000/',    # 替換為你的系統URL
            'ClientBackURL': 'http://localhost:3000/',           # 替換為你的系統URL
            'ChoosePayment': choose_payment,
            'EncryptType': '1',
        }
        params['CheckMacValue'] = self.generate_check_mac_value(params)

        hidden_fields = ''
        for k, v in params.items():
            escaped = str(v).replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
            hidden_fields += f'        <input type="hidden" name="{k}" value="{escaped}">\n'

        html = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>綠界付款 - {item_name}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            text-align: center;
            background-color: #f5f5f5;
            padding: 20px;
        }}
        .payment-box {{
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .submit-btn {{
            background-color: #28a745;
            color: #fff;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
        }}
        .submit-btn:hover {{
            background-color: #218838;
        }}
        .info {{
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .debug {{
            background-color: #fff3cd;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
        }}
    </style>
</head>
<body>
    <div class="payment-box">
        <h1>🛒 綠界付款確認</h1>

        <div class="info">
            <h3>📋 訂單資訊</h3>
            <p><strong>訂單編號：</strong>{trade_no}</p>
            <p><strong>商品名稱：</strong>{item_name}</p>
            <p><strong>金額：</strong>NT$ {amount}</p>
        </div>

        <form method="post" action="{self.action_url}" id="ecpay-form">
{hidden_fields}
            <input type="submit" value="前往綠界付款" class="submit-btn">
        </form>

        <div class="info">
            <h4>💡 測試說明</h4>
            <p>這是綠界測試環境</p>
            <p><strong>測試卡號：</strong>4311-9522-2222-2222</p>
            <p><strong>安全碼：</strong>任意三碼數字</p>
        </div>

        <div class="debug">
            <h4>🔍 除錯資訊</h4>
            <p><strong>CheckMacValue：</strong>{params['CheckMacValue']}</p>
        </div>
    </div>
    <script>document.getElementById('ecpay-form').submit();</script>
</body>
</html>
"""
        return html
