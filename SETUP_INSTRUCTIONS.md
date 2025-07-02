# 🚀 PHP/XAMPP Setup Instructions for TarpPrint

## Step-by-Step Setup Guide

### Step 1: Install XAMPP
1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP on your computer
3. Start **Apache** and **MySQL** services from XAMPP Control Panel

### Step 2: Create Project Folder
1. Navigate to your XAMPP installation directory
2. Go to `htdocs` folder (usually `C:\xampp\htdocs\` on Windows)
3. Copy the `php-backend` folder from this project into `htdocs`

### Step 3: Setup Database
1. Open your browser and go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Create a new database named `tarpaulin_printing`
3. Import the SQL schema from `php-backend/database/schema.sql`
   - Click on the database name
   - Go to "Import" tab
   - Choose the `schema.sql` file
   - Click "Go"

### Step 4: Configure Database Connection
1. Open `php-backend/config/database.php`
2. Update database credentials if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Usually empty for XAMPP
   define('DB_NAME', 'tarpaulin_printing');
   ```

### Step 5: Test PHP Backend
1. Open browser and go to [http://localhost/php-backend](http://localhost/php-backend)
2. You should see the PHP backend dashboard
3. Check if database connection is successful (green checkmark)

### Step 6: Start React Frontend
1. In your project root directory, run:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173)

### Step 7: Test Authentication
1. Go to [http://localhost:5173/php-login](http://localhost:5173/php-login)
2. Use demo accounts:
   - **Admin**: admin@tarpprint.com / password123
   - **Customer**: customer@example.com / password123
3. Login should redirect to dashboard

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login.php` | User login |
| POST | `/api/auth/register.php` | User registration |
| GET | `/api/auth/session.php` | Get current session |
| POST | `/api/auth/logout.php` | User logout |

## 🎯 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tarpprint.com | password123 |
| Staff | staff@tarpprint.com | password123 |
| Customer | customer@example.com | password123 |

## 🔍 Troubleshooting

### Database Connection Issues
- Make sure MySQL is running in XAMPP
- Check database name and credentials
- Verify the database was created successfully

### CORS Issues
- Make sure React app is running on `http://localhost:5173`
- PHP backend should be accessible at `http://localhost/php-backend`

### File Permissions
- Ensure XAMPP has proper file permissions
- On Windows, run XAMPP as administrator if needed

## 🌐 Deployment

### For Production:
1. Upload `php-backend` folder to your web server
2. Create MySQL database and import schema
3. Update database credentials in `config/database.php`
4. Update CORS settings for your domain
5. Build React app and deploy to hosting service

## 📁 Project Structure

```
php-backend/
├── api/
│   └── auth/
│       ├── login.php
│       ├── register.php
│       ├── session.php
│       └── logout.php
├── config/
│   └── database.php
├── database/
│   └── schema.sql
└── index.php
```

## 🔐 Security Features

- Password hashing with PHP's `password_hash()`
- Session token authentication
- CORS protection
- SQL injection prevention with PDO prepared statements
- Input validation and sanitization

## 📊 Database Tables

- `users` - User accounts and profiles
- `materials` - Printing materials catalog
- `orders` - Customer orders
- `user_sessions` - Authentication sessions

Your PHP/XAMPP authentication system is now ready! 🎉