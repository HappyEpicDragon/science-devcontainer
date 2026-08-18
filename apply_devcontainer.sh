#!/usr/bin/env bash
set -euo pipefail

project_name="${1:-}"
workspace_folder="${2:-.}"

if [[ -z "$project_name" ]]; then
  read -r -p "ProjectName [my-project]: " project_name
  project_name="${project_name:-my-project}"
fi

devcontainer templates apply \
  --template-id ghcr.io/happyepicdragon/science-devcontainer/lx-science-workspace:1 \
  --template-args "{\"ProjectName\":\"${project_name}\"}" \
  --workspace-folder "$workspace_folder"
