import requests

class UzumClient:
    def __init__(self, bearer_token, seller_id=None):
        self.base_url = "https://api-seller.uzum.uz/api"
        self.token = bearer_token
        self.seller_id = seller_id
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "User-Agent": "UzumSellerSDK/1.0.0"
        })

    def request(self, method, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

    def get(self, endpoint, params=None):
        return self.request("GET", endpoint, params=params)

    def post(self, endpoint, json=None):
        return self.request("POST", endpoint, json=json)

    def patch(self, endpoint, json=None):
        return self.request("PATCH", endpoint, json=json)

    def delete(self, endpoint, json=None):
        return self.request("DELETE", endpoint, json=json)
