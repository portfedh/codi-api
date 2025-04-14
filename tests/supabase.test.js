const { createClient } = require("@supabase/supabase-js");
const mockEnv = require("dotenv").config;
jest.mock("@supabase/supabase-js");
jest.mock("dotenv");

describe("Supabase Configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should initialize Supabase client with valid environment variables", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "example-key";

    const supabase = require("../config/supabase");
    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "example-key"
    );
    expect(supabase).toBeDefined();
  });

  it("should throw an error if SUPABASE_URL is missing", () => {
    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "example-key";

    expect(() => require("../config/supabase")).toThrow(
      "Missing supabaseUrl credentials"
    );
  });

  it("should throw an error if SUPABASE_SERVICE_ROLE_KEY is missing", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => require("../config/supabase")).toThrow(
      "Missing supabaseKey credentials"
    );
  });
});
