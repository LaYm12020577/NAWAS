class Advertising:
    def __init__(self, client):
        self.client = client

    def get_campaigns(self, seller_id, page=0, size=20, date_from=None, date_to=None, status_group="ALL"):
        params = {
            "sellerId": seller_id,
            "page": page,
            "size": size,
            "from": date_from,
            "to": date_to,
            "statusGroup": status_group
        }
        return self.client.get("/seller/advertising/management/ad-campaign", params=params)

    def create_campaign(self, name, budget, campaign_type="SEARCH"):
        payload = {
            "name": name,
            "budget": budget,
            "type": campaign_type
        }
        return self.client.post("/seller/advertising/management/ad-campaign", json=payload)

    def update_budget(self, campaign_id, budget):
        payload = {"budget": budget}
        return self.client.patch(f"/seller/advertising/management/ad-campaign/{campaign_id}/budget", json=payload)

    def start_campaign(self, campaign_id):
        return self.client.post(f"/seller/advertising/management/ad-campaign/{campaign_id}/start")

    def pause_campaign(self, campaign_id):
        return self.client.post(f"/seller/advertising/management/ad-campaign/{campaign_id}/pause")

    def delete_campaign(self, campaign_id):
        return self.client.delete(f"/seller/advertising/management/ad-campaign/{campaign_id}")

    def add_sku(self, campaign_id, sku_ids):
        payload = {"skuIds": sku_ids}
        return self.client.post(f"/seller/advertising/management/ad-campaign/{campaign_id}/sku", json=payload)

    def remove_sku(self, campaign_id, sku_ids):
        payload = {"skuIds": sku_ids}
        return self.client.delete(f"/seller/advertising/management/ad-campaign/{campaign_id}/sku", json=payload)
