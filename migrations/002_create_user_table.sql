
CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE NOT NULL,
    
    passwordHash TEXT,

    role VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK(role IN ('USER', 'ADMIN')),
    
    isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,
    
    twoFactorEnabled BOOLEAN NOT NULL DEFAULT FALSE,

    twoFactorSecret TEXT,

    tokenVersion INTEGER DEFAULT 0,

    resetPasswordToken TEXT,

    resetPasswordExpires DATE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);