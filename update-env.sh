gcloud run services update my-course-platform \
  --region=australia-southeast1 \
  --project=xz-share \
  --update-env-vars="$(grep -v '^#' .env | sed '/^\s*$/d' | tr '\n' ',' | sed 's/,$//')"