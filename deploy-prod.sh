#!/bin/bash
# =============================================================================
#  deploy-prod.sh — Production deployment script
# =============================================================================

set -e

# Load from environment variables if set
# GITHUB_TOKEN should be set in your shell: export GITHUB_TOKEN=your_token

# ── CONFIG — fill these in ────────────────────────────────────────────────────
SERVER_IP="195.110.58.111"
SERVER_USER="root"
SSH_KEY="/home/obscureduser/.ssh/id_ed25519"

GITHUB_USERNAME="obscuredusername"
# If GITHUB_TOKEN is not set, you'll need to provide it or set it here (FILE IS IGNORED BY GIT)
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"

REPO="obscuredusername/MindNoteFE"
BRANCH="main"

CONTAINER_NAME="mindnote-fe-prod"
IMAGE_NAME="mindnote-fe:prod"
HOST_PORT="3020"
API_URL="https://be.taskfri.com/api/v1"
# ─────────────────────────────────────────────────────────────────────────────

echo "🚀 Starting PRODUCTION deployment..."
echo "   Server  : $SERVER_USER@$SERVER_IP"
echo "   Branch  : $BRANCH"
echo "   Image   : $IMAGE_NAME"
echo ""

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" bash -s << REMOTE_SCRIPT

set -e

GITHUB_USERNAME="${GITHUB_USERNAME}"
GITHUB_TOKEN="${GITHUB_TOKEN}"
REPO="${REPO}"
BRANCH="${BRANCH}"
CONTAINER_NAME="${CONTAINER_NAME}"
IMAGE_NAME="${IMAGE_NAME}"
HOST_PORT="${HOST_PORT}"
SERVER_IP="${SERVER_IP}"
API_URL="${API_URL}"

DEPLOY_DIR="/tmp/mindnote-fe-prod-build"
REPO_URL="https://\${GITHUB_USERNAME}:\${GITHUB_TOKEN}@github.com/\${REPO}.git"

echo "📥 Cloning repository (branch: \${BRANCH})..."
rm -rf "\$DEPLOY_DIR"
git clone --depth=1 --branch "\$BRANCH" "\$REPO_URL" "\$DEPLOY_DIR"

cd "\$DEPLOY_DIR"

echo "🔨 Building Docker image: \${IMAGE_NAME}..."
docker build \\
  --build-arg NEXT_PUBLIC_API_URL="\${API_URL}" \\
  --build-arg NEXT_PUBLIC_APP_ENV="production" \\
  -t "\$IMAGE_NAME" \\
  "\$DEPLOY_DIR"

echo "🔄 Stopping old container (if any)..."
docker stop "\$CONTAINER_NAME" 2>/dev/null || true
docker rm   "\$CONTAINER_NAME" 2>/dev/null || true

echo "▶️  Starting new container on port \${HOST_PORT}..."
docker run -d \\
  --name "\$CONTAINER_NAME" \\
  --restart unless-stopped \\
  -p "\${HOST_PORT}:3000" \\
  "\$IMAGE_NAME"

echo "🧹 Deleting cloned code..."
cd /
rm -rf "\$DEPLOY_DIR"

echo "🗑  Pruning dangling images..."
docker image prune -f

echo ""
echo "✅ Production is live → http://\${SERVER_IP}:\${HOST_PORT}"

REMOTE_SCRIPT
