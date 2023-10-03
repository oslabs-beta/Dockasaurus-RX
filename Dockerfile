FROM --platform=$BUILDPLATFORM node:current-alpine3.17 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm i
RUN npm run build

FROM node:current-alpine3.17

WORKDIR /dockasaurus/
LABEL org.opencontainers.image.title="DockasaurusRX" \
    org.opencontainers.image.description="Docker Resource Management Extension" \
    org.opencontainers.image.vendor="DockasaurusRX" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots="" \
    com.docker.desktop.extension.icon="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog=""

COPY backend ./backend
COPY prometheus /prometheus
COPY docker-compose.yaml /
COPY prometheus /prometheus
COPY metadata.json /
COPY package.json .
COPY docker.svg /
COPY tsconfig.json .
COPY --from=client-builder /ui/build /ui
RUN npm i
RUN npm install typescript -g
RUN tsc
CMD node ./dist/server.js
