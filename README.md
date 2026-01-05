# Interactive JSON-Powered Resume

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made with: HTML, CSS, JS](https://img.shields.io/badge/Made%20with-HTML%2C%20CSS%2C%20JS-orange.svg)](https://developer.mozilla.org/)
[![GitHub Stars](https://img.shields.io/github/stars/adnaanaeem/adnaanaeem.github.io?style=social)](https://github.com/adnaanaeem/adnaanaeem.github.io/stargazers)

A simple, modern, and feature-rich online resume template that is dynamically powered by a single `resume.json` file. Perfect for developers who want a professional online presence without the hassle of frameworks or build tools.

### [View the Live Demo](https://adnaanaeem.github.io/)

![Live Resume Screenshot](social_card.png)
*(This project uses the `social_card.png` as its preview image. You should create your own!)*

---
## ✨ Key Features

*   **Single Source of Truth**: All resume data is managed in one clean `resume.json` file.
*   **Easy Editing with the Resume Editor**: Use our companion web tool to fill out a simple form and generate your `resume.json` file automatically—no manual coding required!
*   **Fully Responsive**: Looks great on desktop, tablet, and mobile devices.
*   **Dark Mode**: A sleek, modern dark theme that can be toggled by the user.
*   **Interactive Menu**: A Floating Action Button (FAB) provides easy access to all features.
*   **Download as PDF**: Generate and download a pixel-perfect PDF of the resume.
*   **ATS-Friendly Mode**: Toggle the profile picture off for a clean, Applicant Tracking System (ATS) optimized layout.
*   **SEO & Social Sharing Ready**: Includes all necessary meta tags for great search engine results and rich link previews.
*   **Zero Dependencies**: Built with pure HTML, CSS, and JavaScript.

## 🚀 Getting Started

Follow these simple steps to set up your own personal resume.

### Step 1: Fork the Repository

Click the "Fork" button at the top-right of this page to copy this project to your own GitHub account.

### Step 2: Add Your Information

You have two options to add your personal information. Using the editor is recommended for its simplicity and to avoid syntax errors.

#### Option A: The Easy Way (Recommended) - Use the Resume Editor

The editor provides a user-friendly interface to generate your `resume.json` file without ever touching the code.

1.  **Go to the Resume Editor**: **[https://adnaanaeem.github.io/editor.html]**
2.  **Fill out the form** with all your personal details, experience, skills, etc.
3.  Click the **"Generate & Download JSON"** button.
4.  Rename the downloaded file to `resume.json`.
5.  In your forked GitHub repository, upload this new `resume.json` file, replacing the existing one.

#### Option B: The Manual Way - Edit `resume.json` Directly

If you are comfortable with JSON, you can directly edit the `resume.json` file. This gives you full control and is great for quick updates.

*   **`meta`**: Contains all data for SEO and social sharing cards. Update the titles, descriptions, and URLs here.
*   **`name`, `title`**: Your full name and professional title.
*   **`contact`**: Your contact details.
*   **`sectionOrder`**: **Important!** This array controls the order of the sections on your resume. You can re-arrange or remove sections by editing this list.
*   **`summary`, `experience`, `skills`, `projects`, `education`**: These sections contain the main content of your resume. Follow the existing structure to add your own items.

### Step 3: Replace Personal Assets

*   **`profile.jpg`**: Replace this with your own professional headshot.
*   **`social-card.jpg`**: This is the image that appears when you share your link. Create a 1200x630 pixel image with your name, title, and photo. A free tool like Canva is perfect for this.

### Step 4: Deploy to GitHub Pages

This project is optimized for deployment on GitHub Pages.

1.  **Rename Your Repository**: For the best results, rename your forked repository to `yourusername.github.io` (replace `yourusername` with your actual GitHub username).
2.  **Enable GitHub Pages**:
    *   Go to your repository's **Settings** tab.
    *   Navigate to the **Pages** section on the left.
    *   Under "Build and deployment," select the source as **Deploy from a branch**.
    *   Choose the `main` (or `master`) branch and the `/ (root)` folder.
    *   Click **Save**.
3.  **Done!** Your resume will be live at `https://yourusername.github.io/` within a few minutes.

## 🛠️ Technology Stack

*   **HTML5**
*   **CSS3** (with Flexbox and Grid for layout)
*   **JavaScript (ES6+)**
*   **html2pdf.js**: For PDF generation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/adnaanaeem/adnaanaeem.github.io/issues).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details. You are free to use, modify, and distribute this template as you see fit.

## 🙏 Acknowledgments

*   A huge thank you to the creators of [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for making client-side PDF generation so accessible.