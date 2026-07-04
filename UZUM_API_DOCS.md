# Uzum Seller API Documentation (Internal & OpenAPI)

## Base URLs
- OpenAPI: `https://api-seller.uzum.uz/api/seller-openapi/`
- Internal: `https://api-seller.uzum.uz/api/seller/`
- CubeJS: `https://cubejs.uzum.uz/` (Hypothetical based on common patterns)

## Authentication
Bearer Token in `Authorization` header.

---

## 1. Advertising Management API (Internal)

### Get Ad Campaigns
- **URL**: `/api/seller/advertising/management/ad-campaign`
- **Method**: `GET`
- **Query Parameters**:
    - `sellerId` (long): ID of the seller.
    - `page` (int): Page number (0-indexed).
    - `size` (int): Items per page.
    - `from` (string): Start date (YYYY-MM-DD).
    - `to` (string): End date (YYYY-MM-DD).
    - `statusGroup` (enum): `ALL`, `ACTIVE`, `PAUSED`, etc.
- **Response**:
    - `id`: Campaign ID.
    - `name`: Campaign name.
    - `status`: Current status.
    - `budget`: Daily/Total budget.
    - `weeklyRemaining`: Remaining weekly budget.
    - `skuGroupsCount`: Number of SKU groups.

### Create Campaign
- **URL**: `/api/seller/advertising/management/ad-campaign`
- **Method**: `POST`
- **Payload**:
    - `name` (string)
    - `budget` (long)
    - `type` (enum)

### Update Budget
- **URL**: `/api/seller/advertising/management/ad-campaign/{id}/budget`
- **Method**: `PATCH`
- **Payload**: `{"budget": 1000}`

---

## 2. Orders & Finance (OpenAPI)

### Get Orders (Finance)
- **URL**: `/v1/finance/orders`
- **Method**: `GET`
- **Query Parameters**: `shopId`, `dateFrom`, `dateTo`, `page`, `size`.

### Get Expenses
- **URL**: `/v1/finance/expenses`
- **Method**: `GET`
- **Query Parameters**: `shopId`, `dateFrom`, `dateTo`.

### Get FBS Orders
- **URL**: `/v2/fbs/orders`
- **Method**: `GET`

---

## 3. Analytics & CubeJS

### Advertising Daily Funnel
- **CubeJS Query**: `AdvertisingDailyFunnel`
- **Metrics**: Impressions, Clicks, CTR, Orders, Revenue.

### Advertising CPO Funnel
- **CubeJS Query**: `AdvertisingCpoFunnel`
- **Metrics**: CPO, ROAS, CRR.

---

## 4. Key IDs & Enums
- `sellerId`: Unique seller identifier.
- `shopId`: Unique shop identifier.
- `statusGroup`: `ALL`, `ACTIVE`, `PAUSED`, `FINISHED`, `ARCHIVED`.
- `orderStatus`: `CREATED`, `CONFIRMED`, `DELIVERING`, `DELIVERED`, `CANCELED`.
