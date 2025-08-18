-- Create storage bucket for avatar uploads
-- Run this in your Supabase SQL editor

-- Create the avatars bucket (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatars" ON storage.objects;

-- Create storage policy to allow authenticated users to upload avatars
-- This policy checks for Clerk user_id in the JWT token
CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND (auth.jwt() ->> 'sub') IS NOT NULL
);

-- Create storage policy to allow public access to view avatars
CREATE POLICY "Allow public access to view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Create storage policy to allow users to update their own avatars
-- This policy checks for Clerk user_id in the JWT token
CREATE POLICY "Allow users to update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND (auth.jwt() ->> 'sub') IS NOT NULL
);

-- Create storage policy to allow users to delete their own avatars
-- This policy checks for Clerk user_id in the JWT token
CREATE POLICY "Allow users to delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND (auth.jwt() ->> 'sub') IS NOT NULL
);
