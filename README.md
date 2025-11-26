# LogiNex

**Mebike** is a microservices-based application built with [Nx](https://nx.dev), [NestJS](https://nestjs.com/), and [Docker](https://www.docker.com/). It uses a modern tech stack to ensure scalability and maintainability.

## 🚀 Tech Stack

- **Monorepo Tool**: [Nx](https://nx.dev)
- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Service Discovery**: [Consul](https://www.consul.io/)
- **Reverse Proxy**: [Traefik](https://traefik.io/)
- **Containerization**: Docker & Docker Compose

## 🏗 Architecture

The project consists of the following main services:

- **API Gateway (Custom Nestjs)**: A custom-built gateway service using NestJS. It acts as the single entry point for client requests, handling routing, request aggregation, and authentication guards before forwarding traffic to internal microservices.
- **Auth Service**: Handles user authentication and authorization (JWT, Passport).
- **User Service**: Manages user profiles and data.
- **Consul**: Used for service discovery and configuration.
- **Traefik**: Acts as the edge router and load balancer.

## 🛠 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mebike
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

> **Note:** Update the `.env` file with your specific database credentials and other secrets.

### 4. Start Infrastructure (Docker)

Start the databases, Consul, and Traefik using Docker Compose:

```bash
docker-compose up -d
```

### 5. Run Applications

You can run the microservices locally using Nx:

```bash
# Start the API Gateway
npx nx serve api-gateway

# Start the Auth Service
npx nx serve auth-service

# Start the User Service
npx nx serve user-service
```

## 📦 Build

To build the project for production:

```bash
npx nx build api-gateway
npx nx build auth-service
npx nx build user-service
```

## 🧪 Testing

Run unit tests:

```bash
npx nx test api-gateway
npx nx test auth-service
```

## 📂 Project Structure

```
Mebike/
├── apps/               # Application services
│   ├── api-gateway/    # API Gateway service
│   ├── auth-service/   # Authentication service
│   └── user-service/   # User management service
├── common/             # Shared libraries and modules
├── docker-compose.yaml # Docker infrastructure config
├── nx.json             # Nx configuration
└── package.json        # Project dependencies
```

## 📄 License

This project is licensed under the MIT License.
