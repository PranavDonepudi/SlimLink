# SlimLink URL Shortener

## Project Overview
SlimLink is a simple URL shortening service built using React for the frontend. Users can input long URLs, and the app will generate a shortened URL. SlimLink is designed to simplify link sharing by transforming long URLs into concise, shareable links while offering detailed analytics. This platform include an intuitive frontend interface for receiving user input URLs and a robust backend that processes requests. Users can track clicks, analyze geolocation through IP addresses, and identify device types that accessing their links, all through a user-friendly dashboard. With its seamless integration of frontend and backend systems, SlimLink provides a comprehensive process for efficient URL management and insightful usage tracking.

## Features
- **Simplicity  Design**: The app layout adjusts to different screen sizes using Bootstrap to enhence user experience.
- **URL Input & Validation Check**: Users can enter long URLs, and the the algorhtim will auto detect whether input URL is valid.
- **Shortened URL Display**: The app displays the shortened URL after submission.
- **Analytics Dashboard**: Users can monitor link traffic, including the total number of clicks, geolocation data (via IP addresses), and the types of devices accessing the link.
- **User Authentication**: A secure login system enables users to create accounts, log in, and manage their activity.
- **Session Auto Expiration** : Users will automatic log off after reaching time limit while ensuring security and privacy.
- **Traffic Control**: The app limits the number of clicks on shortened URLs to prevent abuse and ensure fair usage. Ensures the algorithim remains stable under high traffic conditions by preventing excessive requests.

## Screenshots
### Home Page

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
    <img width="500" alt="image" src="https://github.com/user-attachments/assets/e1298266-d847-4876-aa80-6d27fca6dc44" style="width: 500; height: auto;">
    <img width="500" alt="image" src="https://github.com/user-attachments/assets/f2a4b6df-ca09-4dfe-925e-b1b6c8c1146d" style="width: 500; height: auto;">
</div>


### Login Page
<img width="1400" alt="image" src="https://github.com/user-attachments/assets/5f298c40-6605-47b1-b5a6-df90165244f8">




## Tech Stack
- **React**: Frontend library used to build a responsive and interactive UI.
- **Bootstrap**: Used for styling and creating a responsive layout.
- **HTML/CSS**: Custom styling for elements like the logo NavBar, pagesize, layout.
- **Firebase**: High secure for User Login Authentication and allow user login via Google platform.
- **Bigtable**: Store data include URL(Origional & Shortened) Analysis(Clicks, Geographic location, device type, IP.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js**: You can download and install Node.js [here](https://nodejs.org/).
- **Git**: You can download and install Git [here](https://git-scm.com/).

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/slimlink-url-shortener.git
    cd slimlink-url-shortener
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server (cd to both frontend and backend folder):
    ```bash
    npm start
    ```
    The app will run at `http://localhost:3000`.

## Usage
1. **Enter a long URL**: In the input field, type the URL you want to shorten and press "Shorten URL".
2. **View the shortened URL**: After submission, a shortened version of the URL will appear below the form.
3. **Check Analysis**: Enter URL(Origional or Shortned), Then click Check Analytics button, a analyiss recod window will pop up with all analysis record.
4. **Creat Accout**: Click "Login" button on top right conor on the navigation bar, Then, click Create one here to create an account.
5. **Login**: Click Login button on top right conor on the navigation bar, Enter Email and password. Or Click "Login with Google" to login with your google account.


## Contributing
We welcome contributions! Please feel free to submit pull requests or open issues.
