-- Create function to auto-create user_preferences when user is created
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default user preferences for the new user
    INSERT INTO "user_preferences" (
        id,
        "userId",
        "recentTracksVisible",
        "drawerAutoOpen",
        theme,
        "maxHistoryItems",
        "showCoverArt",
        "autoMarkFavorites",
        "createdAt",
        "updatedAt"
    ) VALUES (
        -- Generate cuid for preferences ID (simple approach using random string)
        'pref_' || substr(md5(random()::text), 1, 24),
        NEW.id,
        true,      -- recentTracksVisible default
        false,     -- drawerAutoOpen default  
        'system',  -- theme default
        100,       -- maxHistoryItems default
        true,      -- showCoverArt default
        false,     -- autoMarkFavorites default
        NOW(),     -- createdAt
        NOW()      -- updatedAt
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create user_preferences on user insert
CREATE TRIGGER trigger_create_user_preferences
    AFTER INSERT ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION create_user_preferences();