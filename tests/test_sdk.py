import unittest
from unittest.mock import MagicMock, patch
from uzum_sdk.client import UzumClient
from uzum_sdk.advertising import Advertising
from uzum_sdk.orders import Orders
from uzum_sdk.finance import Finance
from uzum_sdk.analytics import Analytics

class TestUzumSDK(unittest.TestCase):
    def setUp(self):
        self.client = UzumClient(bearer_token="test_token")
        self.client.request = MagicMock(return_value={"status": "success"})

    def test_advertising_get_campaigns(self):
        adv = Advertising(self.client)
        adv.get_campaigns(seller_id=123)
        self.client.request.assert_called_with("GET", "/seller/advertising/management/ad-campaign", params={
            "sellerId": 123, "page": 0, "size": 20, "from": None, "to": None, "statusGroup": "ALL"
        })

    def test_orders_get_orders(self):
        orders = Orders(self.client)
        orders.get_orders(shop_id=456)
        self.client.request.assert_called_with("GET", "/seller-openapi/v1/finance/orders", params={
            "shopId": 456, "dateFrom": None, "dateTo": None, "page": 0, "size": 20
        })

    def test_finance_get_expenses(self):
        fin = Finance(self.client)
        fin.get_expenses(shop_id=456, date_from="2026-07-01", date_to="2026-07-31")
        self.client.request.assert_called_with("GET", "/seller-openapi/v1/finance/expenses", params={
            "shopId": 456, "dateFrom": "2026-07-01", "dateTo": "2026-07-31"
        })

    def test_analytics_get_daily_funnel(self):
        ana = Analytics(self.client)
        ana.get_daily_funnel(seller_id=123, date_from="2026-07-01", date_to="2026-07-02")
        self.client.request.assert_called()
        args, kwargs = self.client.request.call_args
        self.assertEqual(args[0], "POST")
        self.assertEqual(args[1], "/analytics/cubejs/v1/load")

if __name__ == "__main__":
    unittest.main()
