# Job Queue System

A simple background job processing system built with Express, BullMQ, Redis, Prisma, and PostgreSQL. It accepts jobs over HTTP, stores them in PostgreSQL, enqueues them in BullMQ, and processes them asynchronously with worker retry logic and execution logs.

---

## ✨ Features

- **HTTP API**: Simple endpoint to create background jobs.
- **Idempotency**: Prevent duplicate job processing using an optional `idempotencyKey`.
- **Persistent Storage**: Save job details and execution logs in PostgreSQL using Prisma.
- **Retries & Backoff**: Automatic retries with exponential backoff powered by BullMQ.
- **Provider Architecture**: Support for job types (`email`, `sms`, `push`) via a extensible provider registry.

---

## 🛠️ Tech Stack

- **Node.js** + **TypeScript**
- **Express** (HTTP API)
- **BullMQ** & **Redis** (Job Queue)
- **Prisma** & **PostgreSQL** (Database & ORM)
- **Resend** (Email Provider)
- **Zod** (Validation)

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma         # Database models (Job, JobLog, RateLimitBucket)
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # API entrypoint
│   ├── config/env.ts         # Environment variables configuration
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── redis.ts          # Redis connection instance
│   ├── modules/jobs/
│   │   ├── jobs.controller.ts # Request controller
│   │   ├── jobs.service.ts    # Job creation logic & idempotency
│   │   ├── jobs.validator.ts  # Zod payload schema
│   │   ├── jobs.queue.ts      # BullMQ queue instance
│   │   └── jobs.worker.ts     # Worker process logic & attempt logging
│   └── providers/            # Job execution handlers (email, sms, push)
```

---

## 📋 Prerequisites

Before running the project, make sure you have installed:

- **Node.js** (v18+)
- **PostgreSQL**
- **Redis**

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/job_queue_db"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email Provider Configuration (Optional if testing email jobs)
RESEND_API_KEY=re_123456789...
EMAIL_FROM=noreply@example.com
```

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client & run migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

---

## 🏃 Running the Application

1. **Start the API Server**:
   ```bash
   npm run dev
   ```

2. **Start the Worker Process** (in a separate terminal):
   ```bash
   npx tsx src/modules/jobs/jobs.worker.ts
   ```

---

## 📡 API Usage

### Create a Job

**Endpoint**: `POST /`  
**Content-Type**: `application/json`

#### Example Request (`email` job)

```bash
curl -X POST http://127.0.0.1:5000/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "payload": {
      "to": "user@example.com",
      "subject": "Hello World",
      "body": "<p>This is a test job payload</p>"
    },
    "idempotencyKey": "welcome-email-123"
  }'
```

#### Example Request (`sms` or `push` job)

```bash
curl -X POST http://127.0.0.1:5000/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "sms",
    "payload": {
      "phoneNumber": "+1234567890",
      "message": "Hello from Job Queue System"
    }
  }'
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "b3f2a1c0-4e5d-6f7a-8b9c-0d1e2f3a4b5c",
    "type": "email",
    "status": "PENDING"
  }
}
```

---

## 💡 Supported Job Types

- `email`: Sends real emails via **Resend** (requires `RESEND_API_KEY`).
- `sms`: Processed via mock provider with simulated success/failure.
- `push`: Processed via mock provider with simulated success/failure.

---

## 📄 License

This project is open-source under the **MIT License**.
