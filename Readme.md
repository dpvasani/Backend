# YouTweet Backend

## Introduction

This project is a **YouTweet** backend that integrates YouTube-like functionalities with a Twitter-style tweet system. It includes essential features like user management, video uploading, playlist creation, and more. Explore the API documentation for in-depth details.

<!-- https://documenter.getpostman.com/view/28570926/2s9YsNdVwW -->

## Important Links

| Content           | Link                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| API Documentation | [Click here](https://documenter.getpostman.com/view/26810555/2sAXqp8j2D) |
| Model Diagram     | [Click here](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)       |

## Features

### User Management

- User registration, login, logout, and password reset
- Profile management (avatar, cover image, details)
- Watch history tracking

### Video Management

- Uploading and publishing videos
- Video search, sorting
- Video editing and deletion
- Control over video visibility (publish/un publish)

### Tweet Management

- Tweet creation and publishing
- Viewing and managing user tweets
- Tweet updates and deletion

### Subscription Management

- Subscribe to channels
- View subscriber and subscription lists

### Playlist Management

- Create, update, and delete playlists
- Add or remove videos from playlists
- View user-specific playlists

### Like Management

- Like/unlike videos, comments, and tweets
- View liked videos

### Comment Management

- Add, update, and delete comments on videos

### Dashboard

- View channel statistics (views, subscribers, videos, likes)
- Access and manage uploaded videos

### Health Check

- Health check endpoint to ensure backend functionality

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Cloudinary** (for image and video storage, requires an account)

## Figma

[Figma Prototype](https://www.figma.com/proto/V0Jj1loPHpOro3PSScJjV9/YouTweet?node-id=1-38943&node-type=canvas&t=0aqiTaBG2V3Pcdm4-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)



## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dpvasani/Backend.git
   ```

2. **Install dependencies:**

   ```bash
   cd Backend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and populate it using the `.env.sample` file as a reference.

4. **Start the server:**

   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to submit pull requests or open issues.

---

Let me know if you'd like to adjust any part of the file!

Copyright © All Right Reserved By Darshan Vasani
