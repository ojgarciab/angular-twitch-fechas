#!/bin/bash

mv docs public

cat <<EOF > public/config.js
const clientId = "$TWITCH_CLIENTID";
const redirect = "${GITPOD_WORKSPACE_URL/:\/\//:\/\/8001-}/callback.html";
EOF
