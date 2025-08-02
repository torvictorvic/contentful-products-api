# Contentful Products API

A complete backend REST API built with **NestJS**, connected to **Contentful CMS**, that synchronizes, stores, filters, and reports products in a PostgreSQL database. It includes **JWT authentication**, **cron job sync**, and is fully tested with **Jest** and **SuperTest**.


---

## Features

- **Sync from Contentful** via API
- **Products REST endpoints** (GET, DELETE, pagination, filters)
- **Soft delete** support
- **Reports** for deleted/non-deleted items and top categories
- **JWT-based authentication**
- **Unit & e2e tests** with coverage report
- **Docker support** for local environment
- **Environment variable validation** with Joi
- **Cron job** to sync from Contentful hourly

---


## Project Description
This project implements a **Backend API** in **NestJS** that:
- Consumes products from **Contentful API** every hour via a cron job.
- Inserts and updates products in a **PostgreSQL** database.
- Provides public and private endpoints (with JWT) for product management and reports.
- Includes API documentation with **Swagger** at `/api/docs`.
- Is fully dockerized and tested with **GitHub Actions** and unit tests (>85% coverage).

---

## **Project Architecture**
- **NestJS** with modular structure:
  - `products` : product management.
  - `reports` : private reporting endpoints.
  - `sync` : Contentful synchronization.
  - `auth` : JWT authentication.
- **Database**: PostgreSQL (external or via Docker).
- **ORM**: TypeORM.
- **API Documentation**: Swagger.
- **Testing**: Jest + Supertest.

---

## **Prerequisites**
- Node.js >= 20
- npm >= 10
- PostgreSQL >= 9.5
- Docker (optional, for docker-compose)

---

## **Project Structure**
```
server/
 ├-- src/
 │   ├-- products/       # CRUD and synchronization of products
 │   ├-- reports/        # Private reporting endpoints
 │   ├-- sync/           # Contentful integration
 │   ├-- auth/           # JWT authentication
 │   ├-- app.module.ts   # Root module
 ├-- test/               # Unit and e2e tests
 ├-- Dockerfile
 ├-- docker-compose.yml
 ├-- README.md
```

---

## **Environment Variables (.env)**
Example `.env` file:

```env
PORT=3000
JWT_SECRET=supersecret

# Cron job schedule (default = every hour)
SYNC_CRON=0 * * * *

# PostgreSQL
DB_HOST=###.###.#.#
DB_PORT=5432
DB_USER=postgres
DB_PASS=########
DB_NAME=products

# Contentful API
CONTENTFUL_CDN_BASE=https://cdn.contentful.com
CONTENTFUL_SPACE_ID=xx
CONTENTFUL_ACCESS_TOKEN=xx
CONTENTFUL_ENVIRONMENT=xx
CONTENTFUL_CONTENT_TYPE=xx
```

---

## **Local Installation**
```bash
git clone <repo-url>
cd server
npm install
npm run start:dev
```

The API will be available at:  
`http://localhost:3000`

---

## **Running with Docker**
```bash
docker-compose up --build
```
API service runs at:  
`http://localhost:3000`

---

## **Swagger API Documentation**
Once the project is running, access:  
`http://localhost:3000/api/docs`

---

## **Testing & Coverage**
Run tests with:
```bash
npm run test
npm run test:cov
```
Current coverage:  
**Statements: 83.76%**  
**Branches: 53.92%**  
**Functions: 82.75%**  
**Lines: 85.95%**

---

## **Main Endpoints**

### Public
| Method | Endpoint            | Description |
|--------|----------------------|-------------|
| GET    | `/products`          | Paginated product list |
| DELETE | `/products/:id`      | Soft delete a product |

### Private (requires JWT)
| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| GET    | `/reports/deleted-percentage`    | % of deleted products |
| GET    | `/reports/non-deleted-percentage`| % of non-deleted products |
| GET    | `/reports/top-categories`        | Top product categories |

---

## **Implemented Testing**
- `products.service.spec.ts`  :  business logic.
- `products.controller.spec.ts`  :  public endpoints.
- `reports.controller.spec.ts`  :  private reports.
- `auth.service.spec.ts`  :  JWT authentication.
- `sync.controller.spec.ts` and `contentful.service.spec.ts`  :  Contentful synchronization.

---

## Scheduled Sync Job

The system automatically fetches products from Contentful every hour using a cron job. The frequency can be changed via the `SYNC_CRON` variable.

- Default: `0 * * * *`  =>  runs every hour
- Manual trigger: `POST /api/sync/trigger`

Example response:

```json
{ "upserts": 99 }
```

---

## API Testing with Insomnia

For convenience, this repository includes an **Insomnia collection** with all the required endpoints and preconfigured requests to test the API easily.

### Importing the Collection
1. Open Insomnia.
2. Go to **Application => Preferences => Data => Import Data**.
3. Choose **From File** and select `insomnia_requests-01.har` from this repository.
4. All endpoints will be ready to use, grouped by functionality.

> The file is located in the root folder: [`insomnia_requests-01.har`](./insomnia_requests-01.har)


## **Final Notes**
- Uses best practices: **Strict TypeScript**, **linting**, **Jest testing**, **Swagger**, and **Docker**.
- Test coverage exceeds the required 30%, achieving **over 85%**.

---
**Author**: Victor Manuel Suarez Torres - victorms@gmail.com
