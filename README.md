# QUICK SEND

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Postman Documentation](#postman-documentation)
- [Schema](#schema)

## Introduction

Using Paystack API to topup wallet, and send funds to other users, using username.

## Features

- **User Registration:** Create users instantly using email.
- **Automatic Wallet Creation:** A Wallet is automatically generated for each user with the last 10 digits of the phonumber as an account number.

## Technologies Used

- **Node.js:** JavaScript runtime for server-side development.
- **Express.js:** Web framework for building APIs.
- **Sequelize:** ORM for interacting with MySQL databases using Node.js.
- **MySQL:** Relational database for data storage.

## Prerequisites

Ensure you have the following installed before setting up the project:

- [Node.js and npm](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) or any compatible relational database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lekkss/wallet.git
   ```

## Usage

3. Add a .env file following .env.example file example with the values of each variable

4. Install necessary packages and Start the app:

   ```bash
   npm install
   npm start
   ```

   The server will run on http://localhost:5000 by default

## API Endpoints

| Routes                                    | Description                    | Auth roles |
| ----------------------------------------- | ------------------------------ | ---------- |
| [POST] &nbsp; /api/v1/auth/register       | Create a new account           | none       |
| [POST] &nbsp; /api/v1/auth/login          | User sign in                   | none       |
| [POST] &nbsp; /api/v1/auth/logout         | Logout a user                  | User       |
| [POST] &nbsp; /api/v1/wallet/topup        | Get link for paystack topup    | User       |
| [POST] &nbsp; /api/v1/wallet/verify       | Verify payment after topup     | User       |
| [POST] &nbsp; /api/v1/wallet/transfer     | Transfer funds to another user | User       |
| [POST] &nbsp; /api/v1/wallet/transactions | Get user transactions          | User       |
| [POST] &nbsp; /api/v1/user/pin            | Create transfer pin            | User       |
| [POST] &nbsp; /api/v1/user                | Get user account               | User       |

## Postman Documentation

https://documenter.getpostman.com/view/11912759/2s9YsRdV67

## Schema

![test_bank drawio](https://github.com/lekkss/wallet/assets/54916682/cb293151-42cc-454a-894b-1a9069d5c97a)
