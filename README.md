# CoDi-api

## Overview

`codi-api` is an API designed to generate CoDi payments via QR codes and Push notifications. It provides endpoints for creating and managing payment requests, as well as querying the status of payments. Now certifying

## Features

- Generate QR code payment requests
- Send push payment requests
- Query the status of payment requests
- Log incoming request data
- View logs: pm2 logs codi-api

## Instructions for credentials

In the private key, there is a missing  \n character in a section where it should be \n\n 

```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' fileName.cve
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' fileName.crt
```
