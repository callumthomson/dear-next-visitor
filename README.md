# Dear Next Visitor

A website where you read a message from the previous visitor,
and leave a message for the next visitor.

This monorepo uses Turborepo, and is split into 3 apps.
1. Web
2. Server
3. CDK

## 1. Web
Website built on Next.js 14 with Tailwind. Statically exported for simplified 
hosting on S3, delivered using CloudFront. Analytics by PostHog.

## 2. Server
Built using Hono.js, hosted on Labmda, delivered using an API Gateway HTTP API.
Anayltics by PostHog. Zod for validation. Data stored in DynamoDB (only the most 
recent message is stored, as well as a counter for the total number of messages read). 
OpenAI for content moderation. SSM Parameter Store for secret storage.

## 3. CDK
Manages infrastructure on AWS. Creates and configures above-mentioned services,
and also certificates for HTTPS in Certificate Manager and DNS records in Route53.
