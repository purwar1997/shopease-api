# Shopease API Server

![static-badge](https://img.shields.io/badge/built_with-love-red?style=for-the-badge)
![static-badge](https://img.shields.io/badge/status-success-limegreen?style=for-the-badge)

## 0. Table of Contents

1. [Overview](#1-overview)
2. [Main Features](#2-main-features)
3. [Deployed Link](#3-deployed-link)

## 1. Overview

A RESTful API server to manage interactions on an ecommerce platform called Shopease. It is built using `Express.js` and uses `MongoDB` as a database.

## 2. Main Features

- JWT Authentication
- Database modelling using Mongoose schemas
- Centralized error handling using Express middlewares
- Validation of request payload using Joi
- Routing using Express middlewares
- Ability to parse multipart/form-data using Formidable
- Cloudinary APIs to upload and delete images
- Ability to send emails using Nodemailer
- Payment gateway integration using Razorpay
- Logs information about HTTP requests using Morgan
- Cron jobs scheduled using node-cron library
- pm2 configured to manage Express server and cron jobs
- Hosted on DigitalOcean droplet using Nginx as a web server

## 3. Deployed Link

This project is hosted on this domain - [click here](http://api.shopease.shubhampurwar.in/).