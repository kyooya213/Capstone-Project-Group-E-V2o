-- Audit Trail Database Schema
-- Add this to your existing database

-- Create audit_trail table
CREATE TABLE IF NOT EXISTS audit_trail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Add indexes for better performance
CREATE INDEX idx_audit_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_action ON audit_trail(action);
CREATE INDEX idx_audit_table ON audit_trail(table_name);
CREATE INDEX idx_audit_created_at ON audit_trail(created_at);

-- Insert sample audit data for testing
INSERT INTO audit_trail (user_id, user_name, action, table_name, record_id, new_values, ip_address, user_agent) VALUES
(1, 'Admin User', 'CREATE', 'orders', 1, '{"order_number": "TP-250101-ABCD", "status": "pending", "total_price": 1500}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'Staff User', 'UPDATE', 'orders', 1, '{"status": "processing"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(3, 'Sample Customer', 'CREATE', 'orders', 2, '{"order_number": "TP-250101-EFGH", "status": "pending", "total_price": 2000}', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'),
(1, 'Admin User', 'UPDATE', 'users', 3, '{"role": "customer", "is_active": true}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'Staff User', 'DELETE', 'orders', 5, '{"order_number": "TP-250101-IJKL", "status": "cancelled"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');