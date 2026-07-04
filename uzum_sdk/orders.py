class Orders:
    def __init__(self, client):
        self.client = client

    def get_orders(self, shop_id, date_from=None, date_to=None, page=0, size=20):
        params = {
            "shopId": shop_id,
            "dateFrom": date_from,
            "dateTo": date_to,
            "page": page,
            "size": size
        }
        return self.client.get("/seller-openapi/v1/finance/orders", params=params)

    def get_fbs_orders(self, date_from=None, date_to=None, page=0, size=20):
        params = {
            "dateFrom": date_from,
            "dateTo": date_to,
            "page": page,
            "size": size
        }
        return self.client.get("/seller-openapi/v2/fbs/orders", params=params)

    def get_order_details(self, order_id):
        return self.client.get(f"/seller-openapi/v1/fbs/order/{order_id}")
