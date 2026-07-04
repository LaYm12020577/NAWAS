class Analytics:
    def __init__(self, client):
        self.client = client

    def get_daily_funnel(self, seller_id, date_from, date_to):
        payload = {
            "query": {
                "measures": ["AdvertisingDailyFunnel.impressions", "AdvertisingDailyFunnel.clicks", "AdvertisingDailyFunnel.ctr"],
                "dimensions": ["AdvertisingDailyFunnel.date"],
                "filters": [
                    {"member": "AdvertisingDailyFunnel.sellerId", "operator": "equals", "values": [str(seller_id)]},
                    {"member": "AdvertisingDailyFunnel.date", "operator": "inDateRange", "values": [date_from, date_to]}
                ]
            }
        }
        return self.client.post("/analytics/cubejs/v1/load", json=payload)

    def calculate_net_profit(self, revenue, expenses, ad_spent, commissions=0.15):
        """
        Calculates net profit based on standard Uzum fees.
        """
        commission_total = revenue * commissions
        return revenue - commission_total - expenses - ad_spent

    def get_sku_performance(self, shop_id, date_from, date_to):
        """
        Retrieves and calculates performance metrics per SKU.
        """
        orders = self.client.get("/seller-openapi/v1/finance/orders", params={
            "shopId": shop_id, "dateFrom": date_from, "dateTo": date_to
        })

        performance = {}
        for order in orders.get('payload', {}).get('orders', []):
            sku_id = order['skuId']
            if sku_id not in performance:
                performance[sku_id] = {'revenue': 0, 'orders': 0}
            performance[sku_id]['revenue'] += order['orderPrice']
            performance[sku_id]['orders'] += 1

        return performance
