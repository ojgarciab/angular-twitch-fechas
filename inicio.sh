#!/bin/bash

cat <<EOF > public/config.js
const idToken = "$TWITCH_CLIENTID";
const redirect = "${GITPOD_WORKSPACE_URL/:\/\//:\/\/8001-}";
EOF
