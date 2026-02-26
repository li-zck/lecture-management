#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# Frontend Deployment Script for Minikube
# ──────────────────────────────────────────────────────────────────────────────
# This script deploys ONLY the frontend to Minikube.
#
# Prerequisites:
#   - Minikube is running (minikube status)
#   - Backend must be deployed first (namespace "thesis", postgres, backend-service)
#   - The Ingress is managed by the backend project
# ──────────────────────────────────────────────────────────────────────────────

set -e

NAMESPACE="thesis"
IMAGE_NAME="thesis-frontend"
IMAGE_TAG="latest"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env.local"

echo "========================================"
echo "  Frontend Deployment — Minikube"
echo "========================================"

# ── 1. Check if Minikube is running ──────────────────────────────────────────
echo ""
echo "[1/7] Checking Minikube status..."
if ! minikube status | grep -q "Running"; then
  echo "ERROR: Minikube is not running. Start it with: minikube start"
  exit 1
fi
echo "  ✓ Minikube is running"

# ── 2. Check if namespace exists ─────────────────────────────────────────────
echo ""
echo "[2/7] Checking namespace '${NAMESPACE}'..."
if ! kubectl get namespace "${NAMESPACE}" &>/dev/null; then
  echo "ERROR: Namespace '${NAMESPACE}' does not exist."
  echo "       Deploy the backend first — it creates the namespace."
  exit 1
fi
echo "  ✓ Namespace '${NAMESPACE}' exists"

# ── 3. Point Docker to Minikube's Docker daemon ─────────────────────────────
echo ""
echo "[3/7] Configuring Docker to use Minikube's daemon..."
eval $(minikube docker-env)
echo "  ✓ Docker configured for Minikube"

# ── 4. Build Docker image inside Minikube ────────────────────────────────────
echo ""
echo "[4/7] Building Docker image '${IMAGE_NAME}:${IMAGE_TAG}'..."
BUILD_ARGS=""
if [ -f "$ENV_FILE" ]; then
  echo "  Loading build args from .env.local..."
  while IFS='=' read -r key value; do
    key=$(echo "$key" | xargs)
    [[ -z "$key" || "$key" == \#* ]] && continue
    value=$(echo "$value" | sed 's/^"//;s/"$//')
    BUILD_ARGS="$BUILD_ARGS --build-arg $key=$value"
  done < "$ENV_FILE"
else
  echo "  WARNING: $ENV_FILE not found. Gemini env vars will not be baked into the build."
fi
docker build $BUILD_ARGS -t "${IMAGE_NAME}:${IMAGE_TAG}" "${SCRIPT_DIR}/.."
echo "  ✓ Image built successfully"

# ── 5. Apply Kubernetes manifests ────────────────────────────────────────────
echo ""
echo "[5/7] Applying Kubernetes manifests..."
kubectl apply -f "${SCRIPT_DIR}/frontend/configmap.yaml"
if [ -f "${SCRIPT_DIR}/frontend/secret.yaml" ]; then
  kubectl apply -f "${SCRIPT_DIR}/frontend/secret.yaml"
  echo "  ✓ Secret applied"
else
  echo "  WARNING: secret.yaml not found. Copy secret.example.yaml → secret.yaml"
fi
kubectl apply -f "${SCRIPT_DIR}/frontend/deployment.yaml"
kubectl apply -f "${SCRIPT_DIR}/frontend/service.yaml"
echo "  ✓ All manifests applied"

# ── 6. Restart pods to pick up new image ─────────────────────────────────────
echo ""
echo "[6/7] Restarting frontend deployment..."
kubectl rollout restart deployment/frontend -n "${NAMESPACE}"
echo "  ✓ Rollout restart triggered"

# ── 7. Wait for rollout to complete ──────────────────────────────────────────
echo ""
echo "[7/7] Waiting for rollout to complete..."
kubectl rollout status deployment/frontend -n "${NAMESPACE}" --timeout=120s
echo "  ✓ Rollout complete"

# ── Print status ─────────────────────────────────────────────────────────────
echo ""
echo "========================================"
echo "  Deployment Summary"
echo "========================================"
echo ""
kubectl get pods -n "${NAMESPACE}" -l app=frontend
echo ""
kubectl get svc -n "${NAMESPACE}" frontend-service
echo ""
echo "──────────────────────────────────────"
MINIKUBE_IP=$(minikube ip)
echo "  Minikube IP:     ${MINIKUBE_IP}"
echo "  Access URL:      http://thesis.local"
echo ""
echo "  Make sure /etc/hosts contains:"
echo "    ${MINIKUBE_IP}  thesis.local"
echo "──────────────────────────────────────"
echo ""
echo "Done! Frontend is deployed to Minikube."
