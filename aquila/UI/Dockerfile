FROM node:16-alpine as builder

ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_AQUILA_API_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NODE_ENV=production

WORKDIR /app

COPY . .

ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_AQUILA_API_URL=$NEXT_PUBLIC_AQUILA_API_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN yarn --frozen-lockfile

RUN NODE_ENV=${NODE_ENV} yarn build


FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["node", "server.js"]