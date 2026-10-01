ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS daily_math_goal integer NOT NULL DEFAULT 5;

ALTER TABLE public.user_preferences
DROP CONSTRAINT IF EXISTS user_preferences_daily_math_goal_range;

ALTER TABLE public.user_preferences
ADD CONSTRAINT user_preferences_daily_math_goal_range
CHECK (daily_math_goal BETWEEN 1 AND 30);