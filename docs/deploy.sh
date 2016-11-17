#!/bin/bash

OUTPUT_DIR="dist"
REPO_URL="git@github.com:skbkontur/billing-ui.git"
COMMITTER_EMAIL="isosnin@skbkontur.ru"

rm -rf $OUTPUT_DIR
mkdir $OUTPUT_DIR

echo -e "\e[33mBuilding storybook..."
build-storybook -o $OUTPUT_DIR

echo -e "\e[33mInitializing git..."
cd ./$OUTPUT_DIR
git init
git config user.name "GH Pages Bot"
git config user.email $COMMITTER_EMAIL
git add .
git commit -m "Deploy Storybook to GitHub Pages"

echo -e "\e[33mDeploying storybook..."
git push --force --quiet $REPO_URL master:gh-pages

cd ..
rm -rf $OUTPUT_DIR

echo -e "\e[1m\e[32mSuccessfully deployed!"
