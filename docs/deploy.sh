#!/bin/bash -e

OUTPUT_DIR="./dist"
REPO_URL="git@github.com:skbkontur/billing-ui.git"
COMMITTER_EMAIL="isosnin@skbkontur.ru"

function highlighted_echo {
    echo -e "\e[1m$1\e[21m";
}

highlighted_echo "Check dir"
ls -la
rm -rf $OUTPUT_DIR
mkdir $OUTPUT_DIR

echo ""
highlighted_echo "Building storybook to $OUTPUT_DIR..."
npm run build-storybook -- -o $OUTPUT_DIR
highlighted_echo "Building storybook done"
echo ""

highlighted_echo "Initializing git..."
cd $OUTPUT_DIR
git init
git config user.name "GH Pages Bot"
git config user.email $COMMITTER_EMAIL
git add .
git commit -m "Deploy Storybook to GitHub Pages"
highlighted_echo "Initializing git done"
echo ""

highlighted_echo "Deploying storybook to $REPO_URL..."
git push --force --quiet $REPO_URL master:gh-pages
highlighted_echo "Deploying storybook done"
echo ""

cd ..
rm -rf $OUTPUT_DIR

highlighted_echo "Documentation deployed successfully!"
echo ""
