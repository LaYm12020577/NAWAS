class Finance:
    def __init__(self, client):
        self.client = client

    def get_expenses(self, shop_id, date_from, date_to):
        params = {
            "shopId": shop_id,
            "dateFrom": date_from,
            "dateTo": date_to
        }
        return self.client.get("/seller-openapi/v1/finance/expenses", params=params)

    def get_withdrawals(self, seller_id, page=0, size=20):
        # Hypothetical endpoint based on task requirements
        params = {
            "sellerId": seller_id,
            "page": page,
            "size": size
        }
        return self.client.get("/seller/finance/withdrawals", params=params)
