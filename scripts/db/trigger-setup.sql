-- PostgreSQL trigger for AuthRateLimit cleanup
-- Date: 2025-08-26 19:50
-- Purpose: Universal cleanup coverage for Prisma Studio and direct SQL operations
-- Race Condition Note: BEFORE DELETE trigger prevents race conditions by executing atomically within transaction

CREATE OR REPLACE FUNCTION cleanup_auth_rate_limits()
RETURNS TRIGGER AS $$
BEGIN
    -- User delete edildiğinde AuthRateLimit cleanup yap     
    DELETE FROM auth_rate_limits
    WHERE identifier = 'email_' || OLD.email
       OR identifier = 'email_activation_' || OLD.email;     

    RAISE NOTICE 'Database Trigger: Cleaned up AuthRateLimit for email: %', OLD.email;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Comment for rollback: If race conditions occur, drop trigger with:
-- DROP TRIGGER IF EXISTS user_delete_cleanup ON users;
-- DROP FUNCTION IF EXISTS cleanup_auth_rate_limits();

-- Trigger'ı user table'a bağla
CREATE TRIGGER user_delete_cleanup
    BEFORE DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_auth_rate_limits();