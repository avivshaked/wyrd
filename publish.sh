#!/bin/bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

git checkout main &&
git pull origin main &&
yarn install && \
yarn test && \
yarn deploy && \
npm publish --strict-ssl=false && \
git tag $PACKAGE_VERSION && git push --tag