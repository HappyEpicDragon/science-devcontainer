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

WORKDIR /workspace

