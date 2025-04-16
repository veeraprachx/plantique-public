#!/bin/bash

# Define the token as an environment variable
export TOKEN="__CLOUDFLARE_TOKEN__"


# Generate the cloudflare-secret.yaml on the fly from the template
envsubst < "cloudflare-secret.template.yaml" | microk8s kubectl apply -f -

# Apply the manifest to update the configurations
microk8s kubectl apply -f "cloudflare.yaml" \
  -f "frontend-deployment.yaml" \
  -f "frontend-service.yaml" \
  -f "backend-deployment.yaml" \
  -f "backend-service.yaml" \
  -f "ingress.yaml"

# Force a rolling restart to pull the latest image
microk8s kubectl rollout restart deployment frontend-deployment
microk8s kubectl rollout restart deployment backend-deployment

