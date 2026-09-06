FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# TeX Live provides PDFLaTeX/XeLaTeX/LuaLaTeX, BibLaTeX/Biber, Chinese typesetting, and latexmk.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    wget \
    vim \
    nano \
    openssh-client \
    build-essential \
    cmake \
    pkg-config \
    gnupg \
    latexmk \
    biber \
    texlive-latex-extra \
    texlive-xetex \
    texlive-luatex \
    texlive-lang-chinese \
    texlive-fonts-recommended \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v \
    && rm -rf /var/lib/apt/lists/*

# Install pixi
RUN curl -fsSL https://pixi.sh/install.sh | bash

ENV PATH="/root/.pixi/bin:${PATH}"

# Install the Docker CLI only. The Docker daemon is provided by the host through
# /var/run/docker.sock (Docker-outside-of-Docker).
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
      | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" \
      > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Match the K3s cluster's Kubernetes minor version and expose kubectl to the
# workspace. The client only talks to the remote K3s API server.
ARG KUBECTL_VERSION=v1.36.4
RUN curl -fsSLo /usr/local/bin/kubectl \
      "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" \
    && chmod +x /usr/local/bin/kubectl \
    && kubectl version --client

WORKDIR /workspace

