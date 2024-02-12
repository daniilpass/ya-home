#!/bin/sh
# Copy demo data to a mounted location
cp -a packages/api/src/demo/media packages/api/appData
# Then run the image's CMD
exec "$@"