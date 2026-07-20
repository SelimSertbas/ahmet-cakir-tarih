-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    video_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'video',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on video_id
CREATE INDEX IF NOT EXISTS videos_video_id_idx ON videos(video_id);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at);

-- Add RLS policies
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON videos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow read access for anonymous users
CREATE POLICY "Allow read access for anonymous users" ON videos
    FOR SELECT
    TO anon
    USING (true); 