# API Tələbləri - Promotional Brands

## Endpoint: GET /api/brands/promotional

Bu endpoint iki brend və hər brend üçün seçilmiş (featured) məhsul qaytarır.

### Request
```
GET /api/brands/promotional
```

### Response Format

API standart `ApiResponse<T>` formatını istifadə edir:

```json
{
  "isSuccess": true,
  "value": [
    {
      "brand": {
        "id": "string",
        "name": "string",
        "discountPercent": 0,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "featuredProduct": {
        "id": "string",
        "name": "string",
        "description": "string | null",
        "price": 0,
        "finalDiscountPercent": 0 | null,
        "finalPrice": 0 | null,
        "currency": "string",
        "sku": "string",
        "categoryId": "string",
        "categoryName": "string",
        "brandId": "string",
        "brandName": "string",
        "stock": 0,
        "imageUrl": "string | null",
        "imageId": "string | null",
        "isActive": true,
        "vatRate": 0,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "isBanner": false,
        "isFeatured": true,
        "displayOrder": 0 | null
      }
    },
    {
      "brand": { ... },
      "featuredProduct": { ... }
    }
  ],
  "error": null
}
```

### Response Array Strukturu

- **Array uzunluğu**: Minimum 0, maksimum 4 (frontend ilk 2-ni böyük banner kimi, qalan 2-ni kiçik banner kimi göstərir)
- **Sıralama**: `displayOrder` və ya `createdAt`-ə görə sıralanmalıdır
- **Brend seçimi**: Admin panelində və ya verilənlər bazasında "promotional" olaraq işarələnmiş brendlər seçilməlidir
- **Məhsul seçimi**: Hər brend üçün `isFeatured: true` olan və ya `displayOrder`-ə görə ən yüksək olan məhsul seçilməlidir

### Xüsusiyyətlər

1. **Brend seçimi**: 
   - Verilənlər bazasında brendlər üçün `isPromotional` və ya `displayOrder` field-i ola bilər
   - İlk 2 brend böyük banner kimi göstərilir
   - 3-4 brendlər kiçik banner kimi göstərilir

2. **Məhsul seçimi**:
   - Hər brend üçün `brandId`-ə uyğun məhsullar arasından seçilmiş məhsul tapılmalıdır
   - `isFeatured: true` olan məhsul üstünlük verilməlidir
   - `displayOrder`-ə görə sıralanmalıdır
   - `isActive: true` olan məhsullar seçilməlidir

3. **Error Handling**:
   - Əgər heç bir promotional brand yoxdursa, boş array qaytarılmalıdır: `[]`
   - Əgər brend var amma featured product yoxdursa, o brend skip edilməlidir

### Nümunə Response

```json
{
  "isSuccess": true,
  "value": [
    {
      "brand": {
        "id": "brand-1",
        "name": "Sony",
        "discountPercent": 10,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "featuredProduct": {
        "id": "product-1",
        "name": "Playstation 5",
        "description": "Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.",
        "price": 499.99,
        "finalPrice": 449.99,
        "finalDiscountPercent": 10,
        "currency": "AZN",
        "sku": "PS5-001",
        "categoryId": "cat-1",
        "categoryName": "Gaming",
        "brandId": "brand-1",
        "brandName": "Sony",
        "stock": 50,
        "imageId": "img-123",
        "isActive": true,
        "isFeatured": true,
        "displayOrder": 1
      }
    },
    {
      "brand": {
        "id": "brand-2",
        "name": "Apple",
        "discountPercent": 5,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "featuredProduct": {
        "id": "product-2",
        "name": "Macbook Air",
        "description": "The new 15-inch Macbook Air with Liquid Retina display. Supercharged by M2 chip.",
        "price": 1299.99,
        "finalPrice": 1234.99,
        "finalDiscountPercent": 5,
        "currency": "AZN",
        "sku": "MBA-001",
        "categoryId": "cat-2",
        "categoryName": "Computers",
        "brandId": "brand-2",
        "brandName": "Apple",
        "stock": 30,
        "imageId": "img-456",
        "isActive": true,
        "isFeatured": true,
        "displayOrder": 1
      }
    }
  ],
  "error": null
}
```

### Verilənlər Bazası Tələbləri

1. **Brands cədvəli**:
   - `isPromotional` (boolean) - brendin promotional olub-olmadığını göstərir
   - `displayOrder` (int, nullable) - promotional brendlərin sıralaması

2. **Products cədvəli**:
   - `isFeatured` (boolean) - məhsulun featured olub-olmadığını göstərir
   - `displayOrder` (int, nullable) - featured məhsulların sıralaması
   - `brandId` (foreign key) - brendə aidiyyəti

### SQL Query Nümunəsi (əgər SQL istifadə edirsinizsə)

```sql
SELECT 
    b.id AS brand_id,
    b.name AS brand_name,
    b.discountPercent AS brand_discount,
    b.createdAt AS brand_created,
    p.id AS product_id,
    p.name AS product_name,
    p.description,
    p.price,
    p.finalPrice,
    p.finalDiscountPercent,
    p.currency,
    p.sku,
    p.categoryId,
    p.categoryName,
    p.brandId,
    p.brandName,
    p.stock,
    p.imageId,
    p.imageUrl,
    p.isActive,
    p.vatRate,
    p.createdAt AS product_created,
    p.updatedAt,
    p.isBanner,
    p.isFeatured,
    p.displayOrder
FROM Brands b
INNER JOIN Products p ON p.brandId = b.id
WHERE b.isPromotional = 1
    AND p.isActive = 1
    AND p.isFeatured = 1
ORDER BY b.displayOrder ASC, p.displayOrder ASC
LIMIT 4;
```

### Qeydlər

- Frontend komponenti ilk 2 elementi böyük banner kimi göstərir
- 3-4 elementlər kiçik banner kimi göstərilir
- Əgər 2-dən az element varsa, yalnız mövcud olanlar göstərilir
- Əgər heç bir element yoxdursa, default placeholder məzmunu göstərilir

