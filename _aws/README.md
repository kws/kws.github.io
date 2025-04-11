# Website CloudFront Configuration

This directory contains the AWS infrastructure configuration for deploying a CloudFront distribution with Lambda@Edge functionality to serve the website.

## Overview

The setup consists of two main components:
1. A CloudFront distribution that serves content from multiple origins
2. A Lambda@Edge function that modifies the Host header for GitHub Pages requests

## Directory Structure

- `main-website/`
  - `lambda/` - Contains the Lambda@Edge function code
  - `events/` - Test events for local development
  - `template.yaml` - SAM template for Lambda function
  - `cloudfront.yml` - CloudFront distribution configuration
  - `Makefile` - Deployment automation commands

## Prerequisites

- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed
- Node.js and npm (for Lambda function development)
- jq (for JSON processing in deployment scripts)

## Deployment Instructions

1. First-time setup:
   ```bash
   cd main-website
   npm install
   ```

2. Test the Lambda function locally:
   ```bash
   make test
   ```

3. Deploy the Lambda function:
   ```bash
   make deploy
   ```

4. Update the CloudFront distribution with the new Lambda version:
   ```bash
   make update-distribution
   ```

Alternatively, you can run all steps at once:
```bash
make all
```

## Configuration Files

- `samconfig.toml`: Contains SAM deployment parameters
- `template.yaml`: Defines the Lambda@Edge function configuration
- `cloudfront.yml`: Contains the complete CloudFront distribution setup
- `Makefile`: Automates the deployment process

## Important Notes

- The Lambda@Edge function must be deployed in `us-east-1` region
- After updating the CloudFront distribution, changes may take 5-10 minutes to propagate
- Remember to update the `DIST_ID` in the Makefile if you create a new CloudFront distribution

## Troubleshooting

- Check CloudWatch Logs in `us-east-1` for Lambda@Edge function logs
- Use `sam logs` to view Lambda function logs
- For local testing, use the events in the `events/` directory

## Security

- Never commit AWS credentials or sensitive information
- The `.gitignore` file is configured to exclude sensitive files and build artifacts

