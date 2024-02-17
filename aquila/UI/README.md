# Aquila-Network-UI


# ⚠️ Server and other Credentials are in workflow file.
Never Make this Repo Public

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Docker Deploy

```bash
docker build  --build-arg NEXTAUTH_URL=http://localhost:3000 --build-arg NEXTAUTH_SECRET=secret --build-arg NEXT_PUBLIC_AQUILA_API_URL=https://aquila.api/url --build-arg NEXT_PUBLIC_BASE_URL=http://localhost:3000 -t aquila-network/aquila-network-ui .
```
