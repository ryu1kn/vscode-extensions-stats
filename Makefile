
# Set AWS_PROFILE, AWS_REGION and BUILD_NUMBER environment variables to run
ENV := dev

all: deploy-lambda

install-kumo:
	kumo install

deploy-lambda: install-kumo
	(cd modules/fetch-vscode-extension-stats && kumo deploy-module --region $(AWS_REGION) --env $(ENV) --verbose)

destroy-lambda: install-kumo
	(cd modules/fetch-vscode-extension-stats && kumo destroy-module --region $(AWS_REGION) --env $(ENV) --verbose)

clean:
	rm -rf .kumo

show-stats:
	AWS_REGION=ap-southeast-2 node app

