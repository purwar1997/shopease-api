# Shopease API

![static-badge](https://img.shields.io/badge/built_with-love-red?style=for-the-badge)
![static-badge](https://img.shields.io/badge/status-success-limegreen?style=for-the-badge)

## 0. Table of Contents

1. [Overview](#1-overview)
2. [Deployment and Documentation](#2-deployment-and-documentation)
3. [Main Features](#3-main-features)
4. [Schemas and Routes](#4-schemas-and-routes)
   - [Authentication Routes](#authentication-routes)
   - [User Routes](#user-routes)
   - [Address Routes](#address-routes)
   - [Cart Routes](#cart-routes)
   - [Wishlist Routes](#wishlist-routes)
   - [Product Routes](#product-routes)
   - [Category Routes](#category-routes)
   - [Brand Routes](#brand-routes)
   - [Coupon Routes](#coupon-routes)
   - [Order Routes](#order-routes)
   - [Review Routes](#review-routes)

## 1. Overview

A RESTful API for an ecommerce platform that provides multiple endpoints to manage authentication, users, cart, wishlist, addresses, products, categories, brands, coupons, orders and reviews.

This project is built using Express.js and MongoDB; all the APIs are well-documented using Swagger specification. User authentication has been implemented via JSON Web Tokens and the project is deployed on a DigitalOcean Droplet using Nginx as a web server.

![preview](./media/header.png)

## 2. Deployment and Documentation

This project is deployed on a DigitalOcean Droplet and linked to a custom domain. To visit the live deployment, [click here](http://api.shopease.shubhampurwar.in).

APIs are documented using Swagger (OpenAPI) specification and all of them are live and functional. [Click here](http://api.shopease.shubhampurwar.in/docs/swagger) to view API docs. Select shopease production server in the dropdown menu and play with any API.

[![Documentation Preview](/media/swagger.png)](http://api.shopease.shubhampurwar.in/docs/swagger)

## 3. Main Features

- Authentication using JSON Web Tokens (signup, login, reset password)
- Authorization based on role of a user (user or admin)
- Database modelling using various Mongoose schemas
- Used MongoDB aggregation pipelines to perform complex database queries
- Applied filters, sorting and pagination on Mongoose documents
- Scheduled CRON job to check the expiry status of coupons every midnight
- API and CRON jobs are deployed on a DigitalOcean Droplet using Nginx as a web server
- Configured PM2 to keep API and Cron jobs running as daemon processes to ensure availability
- Utilized the cluster module to evenly distribute incoming requests across all CPU cores in the server
- APIs are documented using Swagger (OpenAPI) specification
- Integration of payment gateway using Razorpay APIs
- Verification of email addresses and phone numbers using Abstract APIs (third party service)
- Validation of request payload using Joi library
- Logging of HTTP requests using Morgan
- Parsing of multipart/form-data using Formidable library
- Upload and delete images using Cloudinary APIs
- Ability to send emails using Nodemailer
- Routing enabled using Express middlewares
- Centralized error handling using Express middlewares
- Project is based on MVC architecture

## 4. Schemas and Routes

Shopease API consists of 8 schemas and 70+ routes and controllers.

### Authentication Routes

| Action          | Method | Route                       | Access Requirements |
| :-------------- | :----- | :-------------------------- | :------------------ |
| Signup          | POST   | /auth/signup                | None                |
| Login           | POST   | /auth/login                 | None                |
| Logout          | POST   | /auth/logout                | Authentication      |
| Forgot password | POST   | /auth/password/forgot       | None                |
| Reset password  | PUT    | /auth/password/reset/:token | None                |

### User Routes

| Action               | Method | Route                     | Access Requirements            |
| :------------------- | :----- | :------------------------ | :----------------------------- |
| Fetch profile        | GET    | /users/self               | Authentication                 |
| Update profile       | PUT    | /users/self               | Authentication                 |
| Delete account       | DELETE | /users/self               | Authentication                 |
| Add profile photo    | POST   | /users/self/avatar        | Authentication                 |
| Remove profile photo | PUT    | /users/self/avatar        | Authentication                 |
| Update profile photo | POST   | /users/self/avatar/update | Authentication                 |
| Fetch users          | GET    | /admin/users              | Authentication + Authorization |
| Fetch user by ID     | GET    | /admin/users/:userId      | Authentication + Authorization |
| Update user role     | PUT    | /admin/users/:userId      | Authentication + Authorization |
| Delete user          | DELETE | /admin/users/:userId      | Authentication + Authorization |
| Fetch other admins   | GET    | /admin/admins             | Authentication + Authorization |
| Admin self demote    | PUT    | /admin/self               | Authentication + Authorization |
| Admin self delete    | DELETE | /admin/self               | Authentication + Authorization |

### Address Routes

| Action              | Method | Route                         | Access Requirements |
| :------------------ | :----- | :---------------------------- | :------------------ |
| Fetch addresses     | GET    | /addresses                    | Authentication      |
| Add new address     | POST   | /addresses                    | Authentication      |
| Fetch address by ID | GET    | /addresses/:addressId         | Authentication      |
| Update address      | PUT    | /addresses/:addressId         | Authentication      |
| Delete address      | DELETE | /addresses/:addressId         | Authentication      |
| Set default address | PUT    | /addresses/:addressId/default | Authentication      |

### Cart Routes

| Action                | Method | Route        | Access Requirements |
| :-------------------- | :----- | :----------- | :------------------ |
| Fetch cart            | GET    | /cart        | Authentication      |
| Add item to cart      | POST   | /cart/add    | Authentication      |
| Remove item from cart | PUT    | /cart/remove | Authentication      |
| Update item quantity  | PUT    | /cart/update | Authentication      |
| Move item to wishlist | PUT    | /cart/move   | Authentication      |
| Clear cart            | PUT    | /cart/clear  | Authentication      |

### Wishlist Routes

| Action                    | Method | Route            | Access Requirements |
| :------------------------ | :----- | :--------------- | :------------------ |
| Fetch wishlist            | GET    | /wishlist        | Authentication      |
| Add item to wishlist      | PUT    | /wishlist/add    | Authentication      |
| Remove item from wishlist | PUT    | /wishlist/remove | Authentication      |
| Move item to cart         | PUT    | /wishlist/move   | Authentication      |
| Clear wishlist            | PUT    | /wishlist/clear  | Authentication      |

### Product Routes

| Action                    | Method | Route                              | Access Requirements            |
| :------------------------ | :----- | :--------------------------------- | :----------------------------- |
| Fetch products            | GET    | /products                          | None                           |
| Fetch product by ID       | GET    | /products/:productId               | None                           |
| Admin fetch products      | GET    | /admin/products                    | Authentication + Authorization |
| Add new product           | POST   | /admin/products                    | Authentication + Authorization |
| Admin fetch product by ID | GET    | /admin/products/:productId         | Authentication + Authorization |
| Update product details    | POST   | /admin/products/:productId         | Authentication + Authorization |
| Delete product            | DELETE | /admin/products/:productId         | Authentication + Authorization |
| Restore deleted product   | PUT    | /admin/products/:productId/restore | Authentication + Authorization |

### Category Routes

| Action               | Method | Route                         | Access Requirements            |
| :------------------- | :----- | :---------------------------- | :----------------------------- |
| Fetch categories     | GET    | /categories                   | None                           |
| Fetch category by ID | GET    | /categories/:categoryId       | None                           |
| Fetch all categories | GET    | /admin/categories             | Authentication + Authorization |
| Add new category     | POST   | /admin/categories             | Authentication + Authorization |
| Update category      | POST   | /admin/categories/:categoryId | Authentication + Authorization |

### Brand Routes

| Action            | Method | Route                  | Access Requirements            |
| :---------------- | :----- | :--------------------- | :----------------------------- |
| Fetch brands      | GET    | /brands                | None                           |
| Fetch brand by ID | GET    | /brands/:brandId       | None                           |
| Fetch all brands  | GET    | /admin/brands          | Authentication + Authorization |
| Add new brand     | POST   | /admin/brands          | Authentication + Authorization |
| Update brand      | POST   | /admin/brands/:brandId | Authentication + Authorization |

### Coupon Routes

| Action                | Method | Route                               | Access Requirements            |
| :-------------------- | :----- | :---------------------------------- | :----------------------------- |
| Fetch valid coupons   | GET    | /coupons                            | Authentication                 |
| Check coupon validity | GET    | /coupons/validity                   | Authentication                 |
| Admin fetch coupons   | GET    | /admin/coupons                      | Authentication + Authorization |
| Create new coupon     | POST   | /admin/coupons                      | Authentication + Authorization |
| Fetch coupon by ID    | GET    | /admin/coupons/:couponId            | Authentication + Authorization |
| Update coupon details | PUT    | /admin/coupons/:couponId            | Authentication + Authorization |
| Delete coupon         | DELETE | /admin/coupons/:couponId            | Authentication + Authorization |
| Activate coupon       | PUT    | /admin/coupons/:couponId/activate   | Authentication + Authorization |
| Deactivate coupon     | PUT    | /admin/coupons/:couponId/deactivate | Authentication + Authorization |

### Order Routes

| Action                  | Method | Route                    | Access Requirements            |
| :---------------------- | :----- | :----------------------- | :----------------------------- |
| Fetch orders            | GET    | /orders                  | Authentication                 |
| Create new order        | POST   | /orders                  | Authentication                 |
| Fetch order by ID       | GET    | /orders/:orderId         | Authentication                 |
| Confirm order           | PUT    | /orders/:orderId/confirm | Authentication                 |
| Cancel order            | PUT    | /orders/:orderId/cancel  | Authentication                 |
| Admin fetch orders      | GET    | /admin/orders            | Authentication + Authorization |
| Admin fetch order by ID | GET    | /admin/orders/:orderId   | Authentication + Authorization |
| Update order status     | PUT    | /admin/orders/:orderId   | Authentication + Authorization |
| Delete order            | DELETE | /admin/orders/:orderId   | Authentication + Authorization |

### Review Routes

| Action                | Method | Route                        | Access Requirements |
| :-------------------- | :----- | :--------------------------- | :------------------ |
| Fetch product reviews | GET    | /products/:productId/reviews | None                |
| Add product review    | POST   | /products/:productId/reviews | Authentication      |
| Fetch review by ID    | GET    | /reviews/:reviewId           | Authentication      |
| Update product review | PUT    | /reviews/:reviewId           | Authentication      |
