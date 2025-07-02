# Tarpaulin Printing Business Management System
## System Specification Requirements Document (SSRD)

## 1. Introduction

### 1.1 Purpose of the Document
This document defines the functional and non-functional specifications of the **Tarpaulin Printing Business Management System**. It serves as a comprehensive guide for developers, analysts, testers, and stakeholders, detailing user roles, core modules, system behavior, and e-commerce functionality tailored for the tarpaulin printing industry.

### 1.2 Project Overview
This system streamlines the tarpaulin printing business by providing customers with an online ordering platform featuring template selection, multiple payment methods, and service rating capabilities. It equips staff with a comprehensive job management dashboard for order processing, inventory management, and customer communication.

### 1.3 Definitions and Acronyms
| Acronym | Definition |
|---------|------------|
| SSRD | System Specification Requirements Document |
| GUI | Graphical User Interface |
| DB | Database (Supabase PostgreSQL) |
| CRUD | Create, Read, Update, Delete |
| RBAC | Role-Based Access Control |
| RLS | Row Level Security (Supabase) |
| API | Application Programming Interface |
| PWA | Progressive Web Application |

## 2. User Roles and Descriptions

### 2.1 Administrator
- **Access Level**: Full system access
- **Responsibilities**: 
  - Manage all system settings and configurations
  - User management and role assignments
  - Financial reporting and analytics
  - Template and pricing management
  - System maintenance and backups

### 2.2 Staff/Employee
- **Access Level**: Operational functions
- **Responsibilities**:
  - Process and manage customer orders
  - Update job statuses and production workflow
  - Handle customer communications
  - Manage inventory and materials
  - Generate operational reports

### 2.3 Customer/Client
- **Access Level**: Personal account and ordering
- **Responsibilities**:
  - Browse and select design templates
  - Place and customize orders
  - Upload design files
  - Make payments through various methods
  - Track order progress
  - Rate and review services

## 3. System Modules and Functional Specifications

### 3.1 User Account Management Module
**Purpose**: Manage user authentication and authorization using Supabase Auth

**Functions**:
- User registration with email verification
- Secure login/logout with session management
- Role-based access control (Customer, Staff, Admin)
- Password reset and recovery via email
- Social authentication (Google, Facebook) - optional
- Account deactivation and reactivation

**Supabase Integration**:
- Uses Supabase Auth for authentication
- User profiles stored in `users` table
- RLS policies for data security

### 3.2 Design Template Management Module
**Purpose**: Provide customers with pre-designed templates for quick ordering

**Functions**:
- Browse template gallery by category (Business, Events, Promotions, etc.)
- Template preview with customization options
- Template search and filtering
- Custom template upload by customers
- Template rating and popularity tracking
- Admin template management (add/edit/delete)

**Template Categories**:
- Business Signage
- Event Banners
- Promotional Materials
- Birthday/Celebration
- Political Campaigns
- Real Estate
- Custom Designs

### 3.3 Order Management Module
**Purpose**: Handle the complete order lifecycle from placement to delivery

**Functions**:
- Interactive order form with real-time pricing
- Template selection and customization
- File upload with format validation
- Order review and confirmation
- Order tracking with status updates
- Order history and reordering
- Bulk order management for businesses

**Order Statuses**:
- Pending (awaiting confirmation)
- Processing (design review/preparation)
- Printing (in production)
- Quality Check
- Ready for Pickup/Delivery
- Completed
- Cancelled

### 3.4 Payment Integration Module
**Purpose**: Secure payment processing with multiple Filipino payment methods

**Supported Payment Methods**:
- **GCash** (Primary mobile wallet)
- **PayMaya/Maya** (Digital wallet)
- **Bank Transfer** (BPI, BDO, Metrobank, etc.)
- **Cash on Delivery/Pickup**
- **Credit/Debit Cards** (Visa, Mastercard)
- **PayPal** (for international customers)

**Functions**:
- Secure payment gateway integration
- Payment confirmation and receipt generation
- Installment options for large orders
- Payment status tracking
- Refund processing
- Payment analytics and reporting

### 3.5 Rating and Review System Module
**Purpose**: Collect customer feedback to improve service quality

**Functions**:
- 5-star rating system for completed orders
- Written review submission
- Photo upload for completed work showcase
- Review moderation by staff
- Public review display on website
- Rating analytics and insights
- Response system for staff to address concerns

**Rating Categories**:
- Overall Satisfaction
- Print Quality
- Design Accuracy
- Delivery Time
- Customer Service
- Value for Money

### 3.6 Inventory Management Module
**Purpose**: Track materials, supplies, and equipment in real-time

**Functions**:
- Material stock tracking (vinyl types, inks, etc.)
- Automatic low-stock alerts
- Supplier management and purchase orders
- Cost tracking and pricing updates
- Equipment maintenance scheduling
- Inventory reports and analytics

**Inventory Categories**:
- Printing Materials (Vinyl, Canvas, Mesh)
- Inks and Consumables
- Hardware (Grommets, Ropes, Stands)
- Equipment (Printers, Cutters, Laminators)

### 3.7 Communication and Notification Module
**Purpose**: Facilitate communication between customers and staff

**Functions**:
- Real-time order status notifications
- In-app messaging system
- Email notifications for important updates
- SMS notifications (optional)
- Push notifications for mobile users
- Customer support chat system

### 3.8 Reports and Analytics Module
**Purpose**: Generate insights for business decision-making

**Report Types**:
- Sales reports (daily, weekly, monthly)
- Customer analytics and behavior
- Popular templates and designs
- Payment method preferences
- Staff performance metrics
- Inventory turnover reports
- Customer satisfaction scores

**Export Formats**:
- PDF for formal reports
- Excel for data analysis
- CSV for data import/export

### 3.9 Content Management Module
**Purpose**: Manage website content and business information

**Functions**:
- Homepage content management
- Pricing table updates
- FAQ and help section management
- Terms of service and privacy policy
- Promotional banner management
- SEO content optimization

### 3.10 Audit Trail Management Module
**Purpose**: Maintain system security and compliance

**Functions**:
- User activity logging
- Order modification tracking
- Payment transaction logs
- System access monitoring
- Data backup and recovery logs
- Security incident reporting

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **Response Time**: System must respond within 2 seconds for standard operations
- **Scalability**: Support 500+ concurrent users during peak hours
- **Availability**: 99.9% uptime with minimal maintenance windows
- **Load Time**: Pages must load within 3 seconds on 3G connections

### 4.2 Security Requirements
- **Authentication**: Multi-factor authentication for admin accounts
- **Authorization**: Role-based access control with Supabase RLS
- **Data Protection**: End-to-end encryption for sensitive data
- **Payment Security**: PCI DSS compliance for payment processing
- **Backup**: Automated daily backups with point-in-time recovery
- **Audit Trail**: Comprehensive logging of all system activities

### 4.3 Usability Requirements
- **User Interface**: Modern, intuitive design following Material Design principles
- **Mobile Responsiveness**: Fully functional on smartphones and tablets
- **Accessibility**: WCAG 2.1 AA compliance for users with disabilities
- **Language Support**: English and Filipino language options
- **Digital Literacy**: Designed for users with basic smartphone skills

### 4.4 Compatibility Requirements
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile OS**: iOS 12+, Android 8+
- **Screen Sizes**: 320px to 4K resolution support
- **Internet**: Optimized for 3G/4G/5G connections

## 5. Data Requirements

### 5.1 Database Overview
The system uses **Supabase PostgreSQL** database with the following characteristics:
- Real-time subscriptions for live updates
- Row Level Security (RLS) for data protection
- Automatic API generation
- Built-in authentication integration
- Edge functions for serverless computing

### 5.2 Core Database Tables

#### 5.2.1 Users Table
```sql
users (
  id: uuid (primary key),
  email: text (unique),
  name: text,
  role: enum ('customer', 'staff', 'admin'),
  phone: text,
  address: text,
  avatar_url: text,
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### 5.2.2 Templates Table
```sql
templates (
  id: uuid (primary key),
  name: text,
  description: text,
  category: text,
  preview_url: text,
  file_url: text,
  price_modifier: decimal,
  is_active: boolean,
  rating_average: decimal,
  usage_count: integer,
  created_by: uuid (foreign key),
  created_at: timestamp
)
```

#### 5.2.3 Orders Table
```sql
orders (
  id: uuid (primary key),
  customer_id: uuid (foreign key),
  order_number: text (unique),
  template_id: uuid (foreign key, nullable),
  width: decimal,
  height: decimal,
  quantity: integer,
  material_id: uuid (foreign key),
  design_notes: text,
  file_url: text,
  file_name: text,
  status: enum,
  total_price: decimal,
  is_paid: boolean,
  payment_method: text,
  payment_reference: text,
  delivery_address: text,
  delivery_date: date,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### 5.2.4 Materials Table
```sql
materials (
  id: uuid (primary key),
  name: text,
  description: text,
  price_per_sqm: decimal,
  stock_quantity: integer,
  minimum_stock: integer,
  supplier_info: jsonb,
  is_available: boolean,
  created_at: timestamp
)
```

#### 5.2.5 Reviews Table
```sql
reviews (
  id: uuid (primary key),
  order_id: uuid (foreign key),
  customer_id: uuid (foreign key),
  overall_rating: integer (1-5),
  quality_rating: integer (1-5),
  service_rating: integer (1-5),
  delivery_rating: integer (1-5),
  review_text: text,
  photos: text[],
  is_approved: boolean,
  staff_response: text,
  created_at: timestamp
)
```

#### 5.2.6 Payments Table
```sql
payments (
  id: uuid (primary key),
  order_id: uuid (foreign key),
  amount: decimal,
  payment_method: text,
  payment_reference: text,
  payment_status: enum ('pending', 'completed', 'failed', 'refunded'),
  gateway_response: jsonb,
  processed_at: timestamp,
  created_at: timestamp
)
```

#### 5.2.7 Inventory Table
```sql
inventory (
  id: uuid (primary key),
  item_name: text,
  category: text,
  current_stock: integer,
  minimum_stock: integer,
  unit_cost: decimal,
  supplier_id: uuid,
  last_restocked: timestamp,
  created_at: timestamp
)
```

#### 5.2.8 Messages Table
```sql
messages (
  id: uuid (primary key),
  order_id: uuid (foreign key),
  sender_id: uuid (foreign key),
  recipient_id: uuid (foreign key),
  message_type: enum ('text', 'image', 'file'),
  content: text,
  file_url: text,
  is_read: boolean,
  created_at: timestamp
)
```

#### 5.2.9 Audit Logs Table
```sql
audit_logs (
  id: uuid (primary key),
  user_id: uuid (foreign key),
  action: text,
  table_name: text,
  record_id: uuid,
  old_values: jsonb,
  new_values: jsonb,
  ip_address: inet,
  user_agent: text,
  created_at: timestamp
)
```

## 6. Integration Requirements

### 6.1 Payment Gateway Integration
- **GCash API**: For mobile wallet payments
- **PayMaya API**: For digital wallet transactions
- **PayPal SDK**: For international payments
- **Bank APIs**: For direct bank transfers

### 6.2 Notification Services
- **Email**: Supabase Edge Functions with SendGrid/Resend
- **SMS**: Twilio or local SMS providers
- **Push Notifications**: Firebase Cloud Messaging

### 6.3 File Storage
- **Supabase Storage**: For design files and templates
- **CDN**: For fast global content delivery
- **Image Processing**: Automatic optimization and resizing

## 7. Demo Accounts and Test Data

### 7.1 Demo User Accounts
```
Administrator:
- Email: admin@tarpprint.com
- Password: admin123
- Role: admin

Staff Member:
- Email: staff@tarpprint.com
- Password: staff123
- Role: staff

Customer:
- Email: customer@example.com
- Password: customer123
- Role: customer
```

### 7.2 Sample Templates
- Business signage templates
- Event banner designs
- Promotional material layouts
- Birthday celebration themes
- Political campaign templates

### 7.3 Test Payment Methods
- Test GCash account for development
- PayPal sandbox environment
- Mock bank transfer scenarios

## 8. Deployment and Maintenance

### 8.1 Deployment Strategy
- **Frontend**: Vercel/Netlify deployment
- **Backend**: Supabase cloud hosting
- **CDN**: Global content delivery network
- **Monitoring**: Real-time performance tracking

### 8.2 Maintenance Schedule
- **Daily**: Automated backups and health checks
- **Weekly**: Performance optimization and updates
- **Monthly**: Security audits and feature updates
- **Quarterly**: System architecture review

This specification provides a comprehensive framework for developing a modern, e-commerce-style tarpaulin printing management system that leverages Supabase's capabilities while meeting the specific needs of the Filipino market.