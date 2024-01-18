FROM oven/bun:slim as base

WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
COPY package*.json .

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
# RUN bun run compile
# RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src src
COPY --from=prerelease /app/index.ts .
COPY --from=prerelease /app/package.json .
# COPY --from=prerelease /app/app .

# ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
# ENV DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN
# ENV DIRECT_MESSAGES=$DIRECT_MESSAGES
# ENV DM_WHITELIST_ID=$DM_WHITELIST_ID
# ENV OPENAI_API_KEY=$OPENAI_API_KEY
# ENV HTTP_SERVER=$HTTP_SERVER
# ENV DISCORD_MAX_RESPONSE_LENGTH=$DISCORD_MAX_RESPONSE_LENGTH
# ENV API_ENDPOINT=$API_ENDPOINT
# ENV MODEL=$MODEL
# ENV DEBUG=$DEBUG
# ENV SYSTEM_MESSAGE=$SYSTEM_MESSAGE
# ENV BOT_SHUTUP_PREFIX=$BOT_SHUTUP_PREFIX
# ENV ADMIN_ROLE_NAME=$ADMIN_ROLE_NAME
# ENV MESSAGE_HISTORY_LIMIT=$MESSAGE_HISTORY_LIMIT
# ENV MODEL_CONTEXT_LENGTH=$MODEL_CONTEXT_LENGTH

# run the app
#USER bun
EXPOSE 7860
ENTRYPOINT [ "bun", "run", "index.ts" ]
# ENTRYPOINT [ "./app" ]