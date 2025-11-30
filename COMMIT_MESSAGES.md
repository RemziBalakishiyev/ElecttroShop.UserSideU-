# Commit Messages

## Main Commit Messages

### 1. Localization and Promotional Brands
```
feat: add Azerbaijani localization and promotional brands feature

- Translate entire application to Azerbaijani language
- Add promotional brands component with API integration
- Implement dynamic brand and featured product display
- Update all UI components, pages, and messages to Azerbaijani
- Add usePromotionalBrands hook for API data fetching
- Update brand service with isPromotional and displayOrder fields
```

### 2. Brand Service API Integration
```
feat: implement brand service API integration

- Add isPromotional and displayOrder fields to Brand interface
- Update brand service to match API documentation
- Support pagination, searchTerm, and filtering
- Implement getBrandById endpoint
- Add promotional brands service and hook
```

### 3. Product Filtering
```
feat: implement product filtering functionality

- Add dynamic category and brand filters from API
- Implement price range filtering (min/max)
- Add URL parameter-based filter state management
- Update ProductListPage to read filter parameters
- Integrate useCategories and useBrands hooks
```

### 4. Initial Project Setup
```
feat: initial project setup with core features

- Set up React 19 + TypeScript + Vite project
- Configure TailwindCSS 4 and React Router
- Implement authentication with JWT tokens
- Add shopping cart and wishlist functionality
- Create reusable UI components (Button, Input, Badge, Toast)
- Set up API service layer with Axios interceptors
- Implement React Query for data fetching
- Add form validation with Formik and Yup
```

## Short Commit Messages (Alternative)

### Single Commit (All Changes)
```
feat: add Azerbaijani localization, promotional brands, and API integration

- Complete Azerbaijani language translation
- Implement promotional brands with featured products
- Add brand service API integration (isPromotional, displayOrder)
- Implement product filtering (category, brand, price range)
- Update all components and pages to Azerbaijani
- Add usePromotionalBrands hook and service
```

### Separate Commits (Recommended)

#### Commit 1: Localization
```
feat(i18n): translate application to Azerbaijani

- Translate all UI components, pages, and messages
- Update form validation messages to Azerbaijani
- Localize toast notifications and error messages
- Translate navigation, footer, and all user-facing text
```

#### Commit 2: Promotional Brands
```
feat(home): add promotional brands component

- Create PromotionalBanners component with API integration
- Add usePromotionalBrands hook for data fetching
- Implement promotionalBrandService with API endpoint
- Display featured products for promotional brands
- Add loading and empty states
```

#### Commit 3: Brand Service
```
feat(api): update brand service to match API specification

- Add isPromotional and displayOrder to Brand interface
- Update brand service methods for API compatibility
- Support pagination and searchTerm parameters
- Implement getBrandById endpoint
```

#### Commit 4: Product Filtering
```
feat(products): implement advanced product filtering

- Add dynamic category and brand filters from API
- Implement price range filtering (min/max)
- Use URL parameters for filter state management
- Integrate useCategories and useBrands hooks
- Update ProductListPage with filter support
```

## Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, UI changes
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Add tests
- `chore`: Build, config changes

### Scope:
- `i18n`: Localization
- `home`: Home page
- `products`: Products
- `api`: API integration
- `auth`: Authentication
- `cart`: Shopping cart
- `ui`: UI components

## Example Commit Messages

### Main Commit (All Changes)
```bash
git add .
git commit -m "feat: add Azerbaijani localization, promotional brands, and brand API integration

- Complete Azerbaijani language translation for entire application
- Implement promotional brands component with featured products
- Add brand service API integration with isPromotional and displayOrder
- Implement product filtering (category, brand, price range)
- Update all components, pages, and messages to Azerbaijani
- Add usePromotionalBrands hook and promotionalBrandService
- Update brand interface with new API fields
- Integrate dynamic filters from API endpoints"
```

### Separate Commits (Recommended)
```bash
# 1. Localization
git add src/components src/pages src/features
git commit -m "feat(i18n): translate application to Azerbaijani

- Translate all UI components and pages
- Update form validation and error messages
- Localize toast notifications
- Translate navigation and footer"

# 2. Promotional Brands
git add src/features/home/components/PromotionalBanners.tsx src/services/brand.service.ts src/features/products/hooks/usePromotionalBrands.ts
git commit -m "feat(home): add promotional brands component with API integration

- Create PromotionalBanners component
- Add usePromotionalBrands hook
- Implement promotionalBrandService
- Display featured products for brands"

# 3. Brand Service
git add src/services/brand.service.ts
git commit -m "feat(api): update brand service to match API specification

- Add isPromotional and displayOrder fields
- Update service methods for API compatibility
- Support pagination and searchTerm"

# 4. Product Filtering
git add src/features/products/components/ProductFilters.tsx src/pages/ProductListPage.tsx
git commit -m "feat(products): implement advanced product filtering

- Add dynamic category and brand filters
- Implement price range filtering
- Use URL parameters for state management"
```
