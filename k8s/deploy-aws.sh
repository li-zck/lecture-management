#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# Frontend Deployment Script for AWS EKS
# ──────────────────────────────────────────────────────────────────────────────
# This script deploys ONLY the frontend to AWS EKS.
#
# Prerequisites:
#   - AWS CLI configured with appropriate permissions
#   - kubectl configured for EKS cluster
#   - Docker installed
#   - Backend must be deployed first (namespace "thesis", postgres, backend-service)
#   - The Ingress is managed by the backend project
# ──────────────────────────────────────────────────────────────────────────────

set -e

AWS_REGION="${AWS_REGION:-ap-southeast-2}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ECR_REPO_NAME="thesis-frontend"
EKS_CLUSTER_NAME="${EKS_CLUSTER_NAME:-thesis-cluster}"
NAMESPACE="thesis"
IMAGE_TAG="${IMAGE_TAG:-latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "  Frontend Deployment — AWS EKS"
echo "========================================"

# ── 1. Check required tools ──────────────────────────────────────────────────
echo ""
echo "[1/9] Checking required tools..."
command -v aws >/dev/null 2>&1 || { echo "ERROR: AWS CLI required."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "ERROR: kubectl required."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker required."; exit 1; }
echo "  ✓ All tools available"

# ── 2. Get AWS Account ID ────────────────────────────────────────────────────
echo ""
echo "[2/9] Getting AWS Account ID..."
if [ -z "$AWS_ACCOUNT_ID" ]; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
fi
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
IMAGE_URI="$ECR_URI/$ECR_REPO_NAME:$IMAGE_TAG"
echo "  ✓ Account: $AWS_ACCOUNT_ID"
echo "  ✓ Image:   $IMAGE_URI"

# ── 3. Configure kubectl for EKS ─────────────────────────────────────────────
echo ""
echo "[3/9] Configuring kubectl for EKS..."
aws eks update-kubeconfig --region "$AWS_REGION" --name "$EKS_CLUSTER_NAME"
echo "  ✓ kubectl configured"

# ── 4. Check if namespace exists ─────────────────────────────────────────────
echo ""
echo "[4/9] Checking namespace '${NAMESPACE}'..."
if ! kubectl get namespace "${NAMESPACE}" &>/dev/null; then
    echo "ERROR: Namespace '${NAMESPACE}' does not exist."
    echo "       Deploy the backend first — it creates the namespace."
    exit 1
fi
echo "  ✓ Namespace '${NAMESPACE}' exists"

# ── 5. Create ECR repository if not exists ────────────────────────────────────
echo ""
echo "[5/9] Ensuring ECR repository exists..."
aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" 2>/dev/null || \
    aws ecr create-repository --repository-name "$ECR_REPO_NAME" --region "$AWS_REGION"
echo "  ✓ ECR repository ready"

# ── 6. Login to ECR ──────────────────────────────────────────────────────────
echo ""
echo "[6/9] Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_URI"
echo "  ✓ ECR login successful"

# ── 7. Build and push Docker image ───────────────────────────────────────────
echo ""
echo "[7/9] Building and pushing Docker image..."
docker build -t "$ECR_REPO_NAME:$IMAGE_TAG" "$SCRIPT_DIR/.."
docker tag "$ECR_REPO_NAME:$IMAGE_TAG" "$IMAGE_URI"
docker push "$IMAGE_URI"
echo "  ✓ Image pushed to ECR"

# ── 8. Apply Kubernetes manifests ─────────────────────────────────────────────
echo ""
echo "[8/9] Applying Kubernetes manifests..."

# Use AWS configmap
kubectl apply -f "$SCRIPT_DIR/frontend/configmap-aws.yaml"

# Create temp deployment with ECR image and Always pull policy
DEPLOY_FILE="$SCRIPT_DIR/frontend/deployment.yaml"
TEMP_DEPLOY="/tmp/frontend-deployment-aws.yaml"
sed "s|image: thesis-frontend:latest|image: $IMAGE_URI|g; s|imagePullPolicy: Never|imagePullPolicy: Always|g" "$DEPLOY_FILE" > "$TEMP_DEPLOY"

kubectl apply -f "$TEMP_DEPLOY"
kubectl apply -f "$SCRIPT_DIR/frontend/service.yaml"

rm -f "$TEMP_DEPLOY"
echo "  ✓ All manifests applied"

# ── 9. Wait for rollout ──────────────────────────────────────────────────────
echo ""
echo "[9/9] Waiting for rollout to complete..."
kubectl rollout status deployment/frontend -n "${NAMESPACE}" --timeout=180s
echo "  ✓ Rollout complete"

# ── Print status ──────────────────────────────────────────────────────────────
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
echo "  Image: $IMAGE_URI"
echo ""
echo "  The Ingress is managed by the backend project."
echo "  Make sure to apply the updated ingress from backend:"
echo "    kubectl apply -f <backend-repo>/k8s/backend/ingress-aws.yaml"
echo "──────────────────────────────────────"
echo ""
echo "Done! Frontend is deployed to AWS EKS."