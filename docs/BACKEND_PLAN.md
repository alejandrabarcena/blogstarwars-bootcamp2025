# Backend Development Plan

## 🎯 Phase 1: Basic API Setup
- [ ] Node.js + Express server
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] Basic CRUD operations
- [ ] API documentation with Swagger

## 🎯 Phase 2: Core Features
- [ ] User authentication (JWT)
- [ ] Favorites system (database)
- [ ] Image upload/storage
- [ ] Search functionality
- [ ] Pagination

## 🎯 Phase 3: Advanced Features
- [ ] User profiles
- [ ] Comments system
- [ ] Rating system
- [ ] Admin panel
- [ ] Analytics

## 🎯 Phase 4: Performance & Scale
- [ ] Caching (Redis)
- [ ] CDN for images
- [ ] Database optimization
- [ ] Load balancing
- [ ] Monitoring

## 📊 Database Schema (Proposed)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Entities Table
```sql
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  properties JSONB,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(uid, type)
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  entity_id INTEGER REFERENCES entities(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, entity_id)
);
```

## 🔧 Tech Stack Recommendations

### Backend Framework
- **Node.js + Express** (familiar, fast setup)
- **Node.js + Fastify** (better performance)
- **Python + FastAPI** (if you prefer Python)

### Database
- **PostgreSQL** (relational, JSONB support)
- **MongoDB** (document-based, flexible)

### Authentication
- **JWT** tokens
- **Passport.js** for strategies
- **bcrypt** for password hashing

### File Storage
- **Local storage** (development)
- **AWS S3** (production)
- **Cloudinary** (images with transformations)

### Deployment
- **Railway** (easy, free tier)
- **Vercel** (serverless functions)
- **Heroku** (traditional hosting)
- **DigitalOcean** (VPS)

## 🚀 Migration Strategy

1. **Keep current SWAPI integration** as fallback
2. **Gradually migrate** to backend API
3. **Feature flags** to switch between APIs
4. **Maintain compatibility** during transition

## 📝 API Endpoints Design

```
# Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

# Entities
GET    /api/characters?page=1&limit=20
GET    /api/characters/:id
POST   /api/characters (admin only)
PUT    /api/characters/:id (admin only)
DELETE /api/characters/:id (admin only)

# Same pattern for planets, starships, vehicles

# Favorites
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:id

# Search
GET    /api/search?q=luke&type=people

# Images
POST   /api/images/upload
GET    /api/images/:filename
```

## 🔄 Development Workflow

1. **Setup local backend** alongside frontend
2. **Create API endpoints** one by one
3. **Test with Postman/Insomnia**
4. **Update frontend** to use new endpoints
5. **Deploy backend** to cloud
6. **Update frontend** config for production
