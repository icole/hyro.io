#!/bin/bash

truffle migrate --reset
rm -rf ~/Workspace/hyro-api/public/local_contracts/*
cp build/contracts/* ~/Workspace/hyro-api/public/local_contracts/