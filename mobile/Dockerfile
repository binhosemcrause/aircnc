# Debian-based (not alpine) because this Expo SDK 35 / RN 0.59-era toolchain predates
# good musl-libc support in some of its native transitive deps.
FROM node:22-bullseye-slim

WORKDIR /usr/src/app

# This SDK 35-era project expects a global expo-cli binary (the local "expo" package is
# just the SDK/runtime, not the CLI). expo-cli itself is deprecated upstream in favor of
# "npx expo", but that replacement dropped support for SDKs this old, so we pin the last
# published legacy expo-cli instead.
RUN npm install -g expo-cli@6.3.10

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Avoid interactive prompts (telemetry opt-in, update checks) from the legacy expo-cli
# when there's no TTY attached.
ENV CI=true
ENV EXPO_NO_TELEMETRY=1

EXPOSE 19006

# This toolchain's bundled webpack 4/Metro still hash with MD4, which Node's default
# OpenSSL 3 provider no longer supports (--openssl-legacy-provider restores it). It has to
# be passed as a real CLI flag to the expo-cli process directly: both yarn and npx strip
# NODE_OPTIONS from the child script's environment, so setting it as an env var alone is
# silently ignored here.
CMD ["sh", "-c", "node --openssl-legacy-provider \"$(which expo)\" start --web --non-interactive"]
