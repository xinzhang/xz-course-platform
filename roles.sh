# create service account
gcloud iam service-accounts create github-actions-deployer \
  --description="Deploys from GitHub Actions" \
  --display-name="GitHub Actions Deployer"


# grant roles
gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-deployer@xz-share.iam.gserviceaccount.com

# create json key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-deployer@xz-share.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding xz-share \
  --member="serviceAccount:github-actions-deployer@xz-share.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.repositories.admin"