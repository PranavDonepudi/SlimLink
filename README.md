# SlimLink URL Shortener

## Project Overview
SlimLink is a simple URL shortening service built using React for the frontend. Users can input long URLs, and the app will generate a shortened URL. The project currently includes a responsive, user-friendly interface with a NavBar, input field for the long URL, and functionality to display the shortened URL.

## Features
- **Responsive Design**: The app layout adjusts to different screen sizes using Bootstrap.
- **URL Input**: Users can enter long URLs, which will be shortened (currently simulated in the frontend).
- **Shortened URL Display**: The app displays the shortened URL after submission.
- **NavBar**: Includes navigation links for "About Us", "Plans", and "Login".
- **Logo**: Displays a custom logo in the NavBar and above the main heading.

## Screenshots
<img width="1400" alt="image" src="https://github.com/user-attachments/assets/e1298266-d847-4876-aa80-6d27fca6dc44">
<img width="1400" alt="image" src="https://github.com/user-attachments/assets/f2a4b6df-ca09-4dfe-925e-b1b6c8c1146d">
<img width="1400" alt="image" src="https://github.com/user-attachments/assets/5f298c40-6605-47b1-b5a6-df90165244f8">




## Tech Stack
- **React**: Frontend library used to build a responsive and interactive UI.
- **Bootstrap**: Used for styling and creating a responsive layout.
- **HTML/CSS**: Custom styling for elements like the logo and NavBar.
- **Firebase**: Google-backed platform that help for User Login Authentication.
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

## Roadmap
- **Backend Integration**: Currently, the URL shortening process is simulated. The next step is to integrate with a backend service to handle URL shortening.
- **User Authentication**: Add login functionality to allow users to manage their shortened URLs.
- **Plans**: Introduce different plans for users with additional features (e.g., analytics, custom domains).

## Contributing
We welcome contributions! Please feel free to submit pull requests or open issues.
