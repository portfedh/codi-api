/**
 * @fileoverview Jest setup file to configure test environment.
 * This file sets up dummy environment variables needed for testing
 * to prevent errors when modules try to access credentials during import.
 */

// Set dummy Supabase credentials for testing
// These are only used when tests run and are never used in production
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key-1234567890';

// Set any other required environment variables for testing
process.env.NODE_ENV = 'test';
