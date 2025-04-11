REGION = us-east-1
DIST_ID = E2KIUFX7MGDV9B

jstest:
	cd lambda && npm install && npm test

test: build
	sam local invoke HostHeaderFunction --event events/viewer-request.json
	sam local invoke RedirectRewriterFunction --event events/viewer-redirect-response.json
	sam local invoke StripPathRequestFunction --event events/viewer-request.json

build:
	sam build

deploy: build
	sam deploy --config-file samconfig.toml --no-confirm-changeset --no-fail-on-empty-changeset

get-arns:
	$(eval HOST_ARN := $(shell aws lambda publish-version --function-name cf-github-ksi-host-header --region $(REGION) --query FunctionArn --output text))
	$(eval REDIRECT_ARN := $(shell aws lambda publish-version --function-name cf-github-ksi-redirect-rewriter --region $(REGION) --query FunctionArn --output text))
	$(eval STRIP_PATH_ARN := $(shell aws lambda publish-version --function-name cf-github-ksi-strip-path-request --region $(REGION) --query FunctionArn --output text))

	@echo "cf-github-ksi-host-header:       $(HOST_ARN)"
	@echo "cf-github-ksi-redirect-rewriter: $(REDIRECT_ARN)"
	@echo "cf-github-ksi-strip-path-request: $(STRIP_PATH_ARN)"

update-distribution: publish
	aws cloudfront get-distribution-config --id $(DIST_ID) > dist.json
	$(eval ETAG := $(shell jq -r '.ETag' dist.json))
	jq '.DistributionConfig' dist.json > dist-config.json
	jq '(.DefaultCacheBehavior.LambdaFunctionAssociations.Items[] | select(.EventType=="viewer-request")).LambdaFunctionARN |= "arn:aws:lambda:$(REGION):YOUR_ACCOUNT_ID:function:$(FUNCTION_NAME):$(VERSION)"' dist-config.json > updated-config.json
	aws cloudfront update-distribution --id $(DIST_ID) --distribution-config file://updated-config.json --if-match $(ETAG)

all: test deploy update-distribution
