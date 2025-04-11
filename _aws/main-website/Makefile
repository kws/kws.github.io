FUNCTION_NAME = cf-github-host-header
REGION = us-east-1
DIST_ID = E2KIUFX7MGDV9B
ZIP_FILE = lambda.zip

jstest:
	cd lambda && npm install && npm test

test: build
	sam local invoke HostHeaderFunction --event events/viewer-request.json
	sam local invoke RedirectRewriterFunction --event events/viewer-redirect-response.json

build:
	sam build

deploy: build
	sam deploy --config-file samconfig.toml --no-confirm-changeset --no-fail-on-empty-changeset

publish:
	$(eval VERSION := $(shell aws lambda publish-version --function-name $(FUNCTION_NAME) --region $(REGION) --query Version --output text))
	echo "Published version: $(VERSION)"

update-distribution: publish
	aws cloudfront get-distribution-config --id $(DIST_ID) > dist.json
	$(eval ETAG := $(shell jq -r '.ETag' dist.json))
	jq '.DistributionConfig' dist.json > dist-config.json
	jq '(.DefaultCacheBehavior.LambdaFunctionAssociations.Items[] | select(.EventType=="viewer-request")).LambdaFunctionARN |= "arn:aws:lambda:$(REGION):YOUR_ACCOUNT_ID:function:$(FUNCTION_NAME):$(VERSION)"' dist-config.json > updated-config.json
	aws cloudfront update-distribution --id $(DIST_ID) --distribution-config file://updated-config.json --if-match $(ETAG)

all: test deploy update-distribution
