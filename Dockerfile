FROM node:22-bookworm-slim

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# 既存のUID=1000ユーザーを削除（必要な場合）
RUN userdel -r node 2>/dev/null || true

RUN groupadd --gid ${USER_GID} ${USERNAME} \
  && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME}

RUN apt-get update && apt-get install -y \
  build-essential \
  curl \
  git \
  python3 \
  sudo \
  python3-pip

# $USERNAMEをsudoグループに追加
RUN usermod -aG sudo ${USERNAME}

# Prepare npm cache dir with non-root ownership so named volume is writable by dev.
RUN mkdir -p /home/${USERNAME}/.npm \
  && chown -R ${USER_UID}:${USER_GID} /home/${USERNAME}

USER ${USERNAME}
WORKDIR /workspace
