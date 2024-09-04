# Shopease API Server

![static-badge](https://img.shields.io/badge/built_with-love-red?style=for-the-badge)
![static-badge](https://img.shields.io/badge/status-success-limegreen?style=for-the-badge)

## 0. Table of Contents

1. [Overview](#1-overview)
2. [Main Features](#2-main-features)
3. [Deployed Link](#3-deployed-link)

## 1. Overview

A RESTful API server to mange interactions on an ecommerce platform called Shopease. It is built using `Express.js` and uses `MongoDB` to store data.

## 2. Main Features

- JWT Authentication
- Database modelling using mongoose schemas
- Centralized error handling using express middleware
- Validation of request payload using Joi
- Routing using express middlewares
- Ability to parse multipart/form-data using Formidable
- Cloudinary APIs to upload and delete images
- Ability to send emails using Nodemailer
- Payment gateway integration using Razorpay
- Logs information about HTTP requests using Morgan
- Cron jobs scheduled using node-cron library
- pm2 configured to manage express server and cron jobs 

## 3. Deployed Link

This project is hosted on this domain - [click here](http://api.shopease.shubhampurwar.in/).