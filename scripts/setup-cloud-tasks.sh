#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-iconic-flare-508617-n3}"
REGION="${GCP_LOCATION:-southamerica-east1}"
QUEUE="${CLOUD_TASKS_QUEUE:-thumbnail-queue}"
SERVICE="${CLOUD_RUN_SERVICE:-files-storage}"
INVOKER_SA="cloud-tasks-thumbnail-invoker"
RUNTIME_SA="${CLOUD_RUN_RUNTIME_SA:-769000191771-compute@developer.gserviceaccount.com}"

gcloud config set project "$PROJECT_ID"

gcloud services enable cloudtasks.googleapis.com run.googleapis.com --quiet

gcloud iam service-accounts describe "${INVOKER_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
  2>/dev/null \
  || gcloud iam service-accounts create "$INVOKER_SA" \
    --display-name="Cloud Tasks thumbnail invoker"

gcloud tasks queues describe "$QUEUE" --location="$REGION" 2>/dev/null \
  || gcloud tasks queues create "$QUEUE" \
    --location="$REGION" \
    --max-concurrent-dispatches=2 \
    --max-dispatches-per-second=10 \
    --max-attempts=5

gcloud run services add-iam-policy-binding "$SERVICE" \
  --region="$REGION" \
  --member="serviceAccount:${INVOKER_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/cloudtasks.enqueuer" \
  --quiet

gcloud iam service-accounts add-iam-policy-binding \
  "${INVOKER_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

SERVICE_URL="$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(status.url)')"
HANDLER_URL="${SERVICE_URL}/internal/thumbnails"

echo ""
echo "Cloud Tasks queue: ${QUEUE} (${REGION})"
echo "Invoker SA: ${INVOKER_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
echo "Set on Cloud Run:"
echo "  THUMBNAIL_TASKS_MODE=cloud-tasks"
echo "  GCP_PROJECT_ID=${PROJECT_ID}"
echo "  GCP_LOCATION=${REGION}"
echo "  CLOUD_TASKS_QUEUE=${QUEUE}"
echo "  CLOUD_TASKS_HANDLER_URL=${HANDLER_URL}"
echo "  CLOUD_TASKS_INVOKER_EMAIL=${INVOKER_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
