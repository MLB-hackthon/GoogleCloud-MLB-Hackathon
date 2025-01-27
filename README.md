# Google Cloud x MLB Hackathon

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#Technologies-Used)
- [How to Run the Project](#how-to-run-the-project)
- [Team Members](#team-members)

## Project Overview  

This project is designed to give sports fans a personalized experience by allowing them to follow their favorite teams, players, or leagues. The system delivers audio, video, and text-based digests of the latest sports highlights and expert commentary on a regular schedule. It also supports multilingual users with options for English, Spanish, and Japanese, ensuring a wider reach for sports enthusiasts globally.  

---

## Key Features 

- **Personalized Selections**: Fans can select teams, players, or leagues to follow.  
- **Content Delivery**: Digest updates delivered via audio, video, or text formats.  

---

## Technologies Used  

- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Node.js, Express  

---

## How to Run the Project  

1. Clone the repository:  

```
   git clone https://github.com/wuqiujie/Google-Cloud-x-MLB-Hackathon.git  
```

### 2. Install Dependencies

Make sure you have Node.js and npm installed. Then, install dependencies:

   ```
npm install
   ```

 ### 3.Run the Application 

Start the application locally: 
    ```
    npm start
    ```

## Team Members

* [Jiayuan Huang](https://github.com/oliverh32)
* [Hangzheng Lin](https://github.com/LinHangzheng)
* [Kristin Wu](https://github.com/wuqiujie)

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit .env with your configuration values

3. Install dependencies:
   ```bash
   npm install
   ```

4. The application will automatically load the correct configuration based on NODE_ENV:
   - Development: `NODE_ENV=development` (default)
   - Production: `NODE_ENV=production`
   - Testing: `NODE_ENV=testing`
