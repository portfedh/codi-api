/**
 * @fileoverview Configuration for Supabase client.
 * This file initializes and exports a Supabase client instance for interacting
 * with the Supabase backend.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

/**
 * Supabase URL from environment variables.
 * @type {string}
 * @throws Will throw an error if the SUPABASE_URL environment variable is not set.
 */
const supabaseUrl = process.env.SUPABASE_URL;

/**
 * Supabase Service Role Key from environment variables.
 * @type {string}
 * @throws Will throw an error if the SUPABASE_SERVICE_ROLE_KEY environment variable is not set.
 */
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing supabaseUrl credentials");
}
if (!supabaseKey) {
  throw new Error("Missing supabaseKey credentials");
}

/**
 * Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
