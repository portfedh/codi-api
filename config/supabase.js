const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing supabaseUrl credentials");
}
if (!supabaseKey) {
  throw new Error("Missing supabaseKey credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
