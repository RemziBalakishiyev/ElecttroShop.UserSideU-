# 🛒 Electronics Store - User Interface

Modern, responsive, and user-friendly electronics store web application. Built with React 19, TypeScript, and TailwindCSS 4.

## ✨ Features

### 🏠 Home Page
- **Hero Section**: Banner product display
- **Promotional Banners**: Featured products for brands
- **Category Grid**: 6 main categories (Phones, Smart Watches, Cameras, Headphones, Computers, Gaming)
- **Featured Products**: Tab system (New Arrivals, Bestsellers, Featured Products)
- **Discounts**: Products with up to -50% discount
- **Popular Products**: Popular products display
- **Big Summer Sale**: Special offer banner

### 🛍️ Products
- **Product List**: Pagination, filtering, and search
- **Product Detail**: Complete product information, image gallery, quantity selector
- **Filtering**: 
  - Price range (min-max)
  - Brand filter
  - Category filter
- **Search**: Real-time product search
- **Pagination**: Page navigation system

### 🛒 Shopping Cart
- Add/remove products
- Quantity adjustment
- Order summary (Subtotal, Shipping, Tax, Total)
- Clear cart functionality

### 💳 Checkout
- Multi-step checkout process:
  1. Shipping information
  2. Payment information
- Form validation (Formik + Yup)
- Order confirmation page

### 👤 User
- **Registration**: Create new account
- **Login**: JWT token authentication
- **Wishlist**: Save favorite products
- **Token Refresh**: Automatic refresh token mechanism

### 🎨 UI/UX
- **Responsive Design**: Mobile, tablet, and desktop compatibility
- **Toast Notifications**: User notifications
- **Loading States**: Skeleton loader animations
- **Error Handling**: Error messages and fallback UI
- **Azerbaijani Language**: Full localization

## 🛠️ Technologies

### Core
- **React 19.1.0**: UI framework
- **TypeScript 5.8**: Type safety
- **Vite 6.3**: Build tool and dev server

### Styling
- **TailwindCSS 4.1**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Framer Motion**: Animations (optional)

### State Management
- **React Context API**: Global state (Auth, Cart, Wishlist, Toast)
- **TanStack Query (React Query)**: Server state management, caching

### Routing & Forms
- **React Router DOM 7.9**: Client-side routing
- **Formik 2.4**: Form handling
- **Yup 1.7**: Form validation

### HTTP Client
- **Axios 1.13**: API requests
- **JWT Authentication**: Token-based auth
- **Refresh Token**: Automatic token refresh

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Button, Input, Badge, Toast
│   └── layout/         # Header, Footer, MainLayout
├── context/            # Global state management
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── ToastContext.tsx
├── features/           # Feature-based structure
│   ├── home/           # Home page components
│   └── products/       # Product components and hooks
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── WishlistPage.tsx
├── services/           # API services
│   ├── api.ts          # Axios instance and interceptors
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── brand.service.ts
│   └── category.service.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Configuration files
```

## 🚀 Installation and Usage

### Requirements
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env.development` for local development:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ASSET_BASE_URL=http://localhost:5000
```

> **Production:** `VITE_API_BASE_URL` and `VITE_ASSET_BASE_URL` are injected at build time via Render's Environment Variables panel. Never commit `.env.development` or `.env.production` files.

## 🚀 Production Deploy (Render Static Site)

### Domains
- User frontend: https://smartal.net
- User frontend (www): https://www.smartal.net
- Backend API: https://api.smartal.net/api

### Render Settings
| Setting | Value |
|---|---|
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Render Environment Variables
```
VITE_API_BASE_URL=https://api.smartal.net/api
VITE_ASSET_BASE_URL=https://api.smartal.net
```

### Render Static Site (User Frontend)
| Setting | Value |
|---|---|
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Custom domains: `https://smartal.net`, `https://www.smartal.net`

Product images are served either directly from Cloudinary (`imageUrl` full URLs, used as-is) or from `VITE_ASSET_BASE_URL`/`VITE_API_BASE_URL` for legacy `/uploads` paths and `imageId` lookups — see `src/utils/imageUrl.ts` and `src/utils/productImage.ts`.

### Render Redirects / Rewrites (React Router)
| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

### Namecheap DNS
Point `smartal.net` and `www.smartal.net` to Render Static Site custom domain per Render's DNS instructions.

## 🔌 API Integration

The project integrates with a RESTful API:

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Production API**: `https://api.smartal.net/api`
- **Authentication**: JWT Bearer token
- **Response Format**: `{ isSuccess, value, error, page, pageSize, totalCount, totalPages }`
- **Error Handling**: Automatic token refresh and error management

### API Endpoints

- `GET /products` - Product list (pagination, filtering, search)
- `GET /products/{id}` - Product detail
- `GET /products/banner` - Banner product
- `GET /products/featured` - Featured products
- `GET /brands` - Brand list
- `GET /brands/{id}` - Brand detail
- `GET /brands/promotional` - Promotional brands and products
- `GET /categories` - Category list
- `POST /auth/login` - Login
- `POST /auth/register` - Registration
- `POST /auth/refresh-token` - Token refresh

## 🎯 Key Functionalities

### 1. Product Search and Filtering
- Real-time search
- Price range filter
- Brand and category filters
- URL parameter-based state management

### 2. Shopping Cart
- LocalStorage persistence
- Real-time quantity changes
- Order summary calculation
- Toast notifications

### 3. Wishlist
- Add/remove products to wishlist
- LocalStorage persistence
- Direct add to cart

### 4. Authentication
- JWT token-based auth
- Automatic token refresh
- Protected routes
- Logout functionality

### 5. Form Validation
- Formik form management
- Yup schema validation
- Real-time error display
- Error messages in Azerbaijani

## 🌐 Localization

All UI elements are in Azerbaijani:
- Navigation links
- Form labels
- Button texts
- Error messages
- Toast notifications
- Validation messages

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl
- **Adaptive Layout**: Dynamic grid systems
- **Touch Friendly**: Mobile interactions

## 🔒 Security

- JWT token authentication
- Secure token storage (localStorage)
- Automatic token refresh
- Protected API routes
- XSS protection

## 🧪 Testing

```bash
# Linting
npm run lint
```

## 📝 Commit Messages

The project uses conventional commits format:

```
feat: add new feature
fix: fix bug
refactor: code refactoring
docs: update documentation
style: UI/UX changes
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is a private project.

## 👨‍💻 Developer

Electronics Store - User Interface Development Team

## 🔗 Contact

For questions about the project, please open an issue.

---

**Production**: Deployed on Render Static Site. `main` branch is the production branch. `development` branch is for local/development work.
