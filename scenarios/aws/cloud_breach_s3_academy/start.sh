#!/bin/bash
set -eu
if [ ! -f ./cloudgoat ]; then
  ssh-keygen -b 4096 -t rsa -f ./cloudgoat -q -N ""
fi
