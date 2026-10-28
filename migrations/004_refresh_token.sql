
CREATE TABLE refreshToken(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    token TEXT NOT NULL,

    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE,

    expires_at DATE NOT NULL,

    created_at DATE NOT NULL DEFAULT NOW()
);