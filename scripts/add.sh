#!/bin/bash

npm run news:new -- --title "$1" --date $(date +%Y-%m-%d) --slug $2
