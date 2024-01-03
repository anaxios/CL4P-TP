FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY ./llmAPI /app/llmAPI 
COPY ./utils /app/utils
COPY client.js .

ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ENV DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN
ENV DIRECT_MESSAGES=$DIRECT_MESSAGES
ENV DM_WHITELIST_ID=$DM_WHITELIST_ID
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV HTTP_SERVER=$HTTP_SERVER
ENV DISCORD_MAX_RESPONSE_LENGTH=$DISCORD_MAX_RESPONSE_LENGTH
ENV API_ENDPOINT=$API_ENDPOINT
ENV MODEL=$MODEL
ENV DEBUG=$DEBUG
ENV SYSTEM_MESSAGE=$SYSTEM_MESSAGE
ENV BOT_SHUTUP_PREFIX=$BOT_SHUTUP_PREFIX
ENV ADMIN_ROLE_NAME=$ADMIN_ROLE_NAME
ENV MESSAGE_HISTORY_LIMIT=$MESSAGE_HISTORY_LIMIT
ENV MODEL_CONTEXT_LENGTH=$MODEL_CONTEXT_LENGTH

EXPOSE 7860

CMD ["npm", "start"]