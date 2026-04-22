# Bidzen - Online Auction Platform

A comprehensive online auction platform that connects buyers and sellers in a secure, user-friendly environment. Bidzen enables users to create, bid on, and manage auctions with real-time updates, secure payments, and comprehensive user management.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [User Journey](#user-journey)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Bidzen is a full-stack auction platform designed to modernize the traditional auction experience. It provides a seamless interface for users to participate in online auctions, whether they're looking to sell valuable items or find unique purchases at competitive prices.

### Core Value Proposition

- **Accessibility**: 24/7 access to auctions from anywhere
- **Transparency**: Real-time bidding history and auction status
- **Security**: Secure authentication and payment processing
- **User Experience**: Intuitive interface with responsive design
- **Scalability**: Built to handle high traffic and concurrent users

## Problem Statement

Traditional auction platforms often suffer from:
- Complex user interfaces that deter new users
- Limited accessibility and poor mobile experience
- Lack of real-time updates and notifications
- Inadequate security measures
- Difficult onboarding processes

Bidzen addresses these issues by providing a modern, user-centric auction experience with:
- Clean, intuitive interface design
- Fully responsive web application
- Real-time bidding and notifications
- Robust security and authentication
- Streamlined registration and listing processes

## User Journey

### New User Registration
1. **Sign Up**: Users create accounts with email verification
2. **Profile Setup**: Complete personal information and preferences
3. **Email Verification**: Confirm account via verification link
4. **First Login**: Access dashboard and explore platform features

### Seller Journey
1. **Create Auction**: List items with detailed descriptions, images, and pricing
2. **Set Auction Parameters**: Choose start/end times, starting bid, and auction type
3. **Manage Active Auctions**: Monitor bids, answer questions, and manage listings
4. **Complete Transactions**: Handle payments, shipping, and feedback
5. **View Analytics**: Track sales performance and auction history

### Buyer Journey
1. **Browse Auctions**: Search and filter available items
2. **Place Bids**: Participate in real-time bidding
3. **Track Auctions**: Monitor bid status and receive notifications
4. **Win Auctions**: Complete payment and arrange delivery
5. **Leave Feedback**: Rate sellers and provide reviews

### Admin Journey
1. **Platform Oversight**: Monitor all platform activities
2. **User Management**: Manage user accounts and permissions
3. **Content Moderation**: Review and moderate auction listings
4. **Dispute Resolution**: Handle conflicts and user complaints
5. **Analytics & Reports**: Access platform metrics and insights

## Key Features

### Authentication & Authorization
- **User Registration**: Email-based signup with verification
- **Secure Login**: JWT-based authentication with refresh tokens
- **Role-Based Access**: Buyer, Seller, and Admin roles with specific permissions
- **Password Management**: Secure password reset and change functionality

### Auction Management
- **Create Listings**: Detailed item descriptions with image uploads
- **Auction Types**: Standard auctions with configurable parameters
- **Scheduled Auctions**: Set future start times for strategic listings
- **Real-time Updates**: Live bid tracking and status updates
- **Auction Management**: Edit, pause, or cancel active auctions

### Bidding System
- **Real-time Bidding**: Instant bid placement and updates
- **Bid History**: Complete bidding history transparency
- **Automatic Notifications**: Email alerts for bid updates and auction endings
- **Bid Validation**: Prevent invalid bids and ensure fair competition
- **Watchlist**: Save favorite auctions for easy tracking

### User Dashboard
- **Seller Dashboard**: Manage listings, track sales, view analytics
- **Buyer Dashboard**: Track bids, view won auctions, manage payments
- **Admin Dashboard**: Platform oversight and user management
- **Profile Management**: Update personal information and preferences

### Payment & Transactions
- **Secure Payments**: Integration with payment gateways
- **Transaction History**: Complete record of all financial activities
- **Refund Management**: Handle refunds and disputes
- **Payment Notifications**: Automated payment status updates

### Feedback & Ratings
- **User Reviews**: Two-way feedback system
- **Rating System**: Star-based ratings for users
- **Reputation Scores**: Aggregate reputation metrics
- **Feedback Moderation**: Admin oversight for review quality

### Search & Discovery
- **Advanced Search**: Filter by category, price, location, and more
- **Featured Auctions**: Highlight premium listings
- **Category Navigation**: Organized browsing by item categories
- **Recommendation Engine**: Personalized auction suggestions

### Notifications & Communication
- **Real-time Alerts**: Instant notifications for bid updates
- **Email Notifications**: Regular updates and auction summaries
- **In-App Messaging**: Direct communication between users
- **System Announcements**: Platform-wide notifications

## Technical Architecture

### System Design
Bidzen follows a **microservices-inspired architecture** with clear separation between frontend and backend:

```
Frontend (React/Vite)  <--->  Backend API (Node.js/Express)  <--->  Database (MongoDB)
```

### Key Architectural Patterns
- **RESTful API**: Clean, stateless API design
- **JWT Authentication**: Secure token-based authentication
- **Component-Based UI**: Reusable React components
- **State Management**: React Context and custom hooks
- **Database Design**: MongoDB with Mongoose ODM
- **File Storage**: Cloud-based image storage
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging for monitoring

### Security Architecture
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Token-based CSRF prevention
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Sensitive data encryption at rest and in transit

## Technology Stack

### Frontend Technologies
- **React 18**: Modern UI framework with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **React Hot Toast**: Notification system
- **Lucide React**: Icon library
- **Zustand**: Lightweight state management
- **React Hook Form**: Form management with validation

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling and validation
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing and security
- **Joi**: Data validation library
- **Multer**: File upload handling
- **Nodemailer**: Email sending functionality
- **Cloudinary**: Cloud-based image storage

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting and consistency
- **Git**: Version control system
- **NPM**: Package management
- **Vercel**: Frontend deployment platform
- **Heroku/Railway**: Backend deployment options

### Testing & Quality
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **Cypress**: End-to-end testing framework
- **Postman**: API testing and documentation

## Project Structure

```
bidzen/
|
+-- bidzen-frontend/
|   +-- public/
|   +-- src/
|   |   +-- components/
|   |   |   +-- ui/          # Reusable UI components
|   |   |   +-- shared/      # Shared application components
|   |   |   +-- auction/     # Auction-specific components
|   |   |   +-- feedback/    # Feedback system components
|   |   +-- pages/
|   |   |   +-- public/      # Public pages (home, login, register)
|   |   |   +-- buyer/       # Buyer-specific pages
|   |   |   +-- seller/      # Seller-specific pages
|   |   |   +-- admin/       # Admin-specific pages
|   |   +-- api/             # API service functions
|   |   +-- hooks/           # Custom React hooks
|   |   +-- stores/          # State management
|   |   +-- utils/           # Utility functions
|   |   +-- styles/          # Global styles and CSS
|   +-- package.json
|   +-- vite.config.js
|
+-- bidzen-backend/
|   +-- src/
|   |   +-- controllers/     # Route controllers
|   |   +-- models/          # Database models
|   |   +-- routes/          # API routes
|   |   +-- middleware/      # Custom middleware
|   |   +-- utils/           # Utility functions
|   |   +-- config/          # Configuration files
|   |   +-- scripts/         # Database scripts
|   +-- uploads/             # File upload directory
|   +-- package.json
|   +-- server.js
|
+-- docs/                    # Documentation files
+-- README.md
+-- .gitignore
```

## Installation & Setup

### Prerequisites
- **Node.js** (v20.19+ or v22.12+)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control
- **Code editor** (VS Code recommended)

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd bidzen-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd bidzen-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bidzen
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Seed database** (optional)
   ```bash
   node scripts/createAdmin.js
   ```

### Production Deployment

#### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Backend (Heroku/Railway)
1. Connect repository to deployment platform
2. Set environment variables
3. Configure MongoDB Atlas for production
4. Deploy and scale as needed

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/auctions` - Get user's auctions
- `GET /users/bids` - Get user's bid history

### Auction Management
- `GET /auctions` - Get all auctions (with filtering)
- `GET /auctions/:id` - Get specific auction details
- `POST /auctions` - Create new auction
- `PUT /auctions/:id` - Update auction
- `DELETE /auctions/:id` - Delete auction
- `POST /auctions/:id/bids` - Place bid on auction

### Admin Endpoints
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id` - Update user status
- `GET /admin/auctions` - Get all auctions
- `PUT /admin/auctions/:id/resolve` - Resolve flagged auction

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Contributing

We welcome contributions to the Bidzen platform! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code patterns and conventions

### Bug Reports
- Use GitHub Issues for bug reports
- Include detailed reproduction steps
- Provide environment details
- Add relevant screenshots if applicable

### Feature Requests
- Submit feature requests via GitHub Issues
- Describe the use case and benefits
- Consider implementation complexity
- Discuss with maintainers before starting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@bidzen.com
- Documentation: [docs.bidzen.com](https://docs.bidzen.com)

## Acknowledgments

- Thanks to all contributors who helped build this platform
- Special thanks to the open-source community for the amazing tools and libraries
- Inspired by modern e-commerce and auction platforms
- Built with passion for creating better online marketplaces

---

**Bidzen** - Where Every Bid Matters!
