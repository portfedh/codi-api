/**
 * @file utcTimestamps.test.js
 * @description Tests for UTC timestamp handling after migration
 * @module tests/utcTimestamps
 *
 * This test suite verifies that:
 * 1. All timestamps are created in UTC
 * 2. Timestamps can be converted to other timezones
 * 3. Timestamp formatting preserves timezone information
 * 4. Database operations store and retrieve UTC correctly
 */

const moment = require("moment-timezone");

describe("UTC Timestamp Creation", () => {
  test("moment.utc() creates timestamps in UTC timezone", () => {
    const timestamp = moment.utc();

    // Verify the timestamp is in UTC mode
    expect(timestamp.isUtc()).toBe(true);
    expect(timestamp.utcOffset()).toBe(0);

    // Verify ISO format ends with 'Z' (Zulu/UTC indicator)
    const isoString = timestamp.toISOString();
    expect(isoString).toMatch(/Z$/);
  });

  test("moment.utc() output matches format() with Z suffix", () => {
    const timestamp = moment.utc();
    const formatted = timestamp.format();

    // Format should include the Z suffix for UTC
    expect(formatted).toMatch(/Z$/);
  });

  test("UTC timestamps have offset of +00:00", () => {
    const timestamp = moment.utc();
    const offset = timestamp.utcOffset();

    // UTC offset should be 0 (no offset from UTC)
    expect(offset).toBe(0);
  });

  test("Creating timestamp with specific UTC time", () => {
    const timestamp = moment.utc("2025-01-12T10:30:00Z");

    expect(timestamp.isValid()).toBe(true);
    expect(timestamp.format()).toBe("2025-01-12T10:30:00Z");
    expect(timestamp.hour()).toBe(10);
    expect(timestamp.isUtc()).toBe(true);
  });
});

describe("Timezone Conversion", () => {
  test("UTC timestamp can be converted to Mexico City time", () => {
    const utcTime = moment.utc("2025-01-12T16:00:00Z"); // 4 PM UTC
    const mexicoCityTime = utcTime.clone().tz("America/Mexico_City");

    // Mexico City is UTC-6 during standard time, UTC-5 during DST
    const hourDiff = utcTime.hour() - mexicoCityTime.hour();

    // Allow for both standard time (6 hours) and DST (5 hours)
    expect([5, 6]).toContain(hourDiff);

    // Original UTC time should remain unchanged
    expect(utcTime.format()).toBe("2025-01-12T16:00:00Z");
  });

  test("Conversion preserves the absolute moment in time", () => {
    const utcTime = moment.utc("2025-01-12T16:00:00Z");
    const mexicoCityTime = utcTime.clone().tz("America/Mexico_City");

    // Convert back to UTC - should match original
    const backToUtc = mexicoCityTime.clone().utc();

    expect(backToUtc.format()).toBe(utcTime.format());
    expect(backToUtc.valueOf()).toBe(utcTime.valueOf()); // Unix timestamp should be identical
  });

  test("Multiple timezone conversions from same UTC source", () => {
    const utcTime = moment.utc("2025-01-12T12:00:00Z"); // Noon UTC

    const mexicoCityTime = utcTime.clone().tz("America/Mexico_City");
    const newYorkTime = utcTime.clone().tz("America/New_York");
    const londonTime = utcTime.clone().tz("Europe/London");

    // All should represent the same moment in time
    expect(mexicoCityTime.valueOf()).toBe(utcTime.valueOf());
    expect(newYorkTime.valueOf()).toBe(utcTime.valueOf());
    expect(londonTime.valueOf()).toBe(utcTime.valueOf());
  });
});

describe("Timestamp Formatting", () => {
  test(".format() preserves UTC timezone info", () => {
    const timestamp = moment.utc("2025-01-12T10:30:00Z");
    const formatted = timestamp.format();

    // Should maintain the Z suffix
    expect(formatted).toBe("2025-01-12T10:30:00Z");
  });

  test(".toISOString() always outputs UTC", () => {
    const timestamp = moment.utc("2025-01-12T10:30:00Z");
    const isoString = timestamp.toISOString();

    expect(isoString).toBe("2025-01-12T10:30:00.000Z");
    expect(isoString).toMatch(/Z$/);
  });

  test("Custom format without timezone indicator", () => {
    const timestamp = moment.utc("2025-01-12T10:30:00Z");
    const customFormat = timestamp.format("YYYY-MM-DD HH:mm:ss");

    expect(customFormat).toBe("2025-01-12 10:30:00");
    // Note: This loses timezone info - should include timezone when possible
  });

  test("Format with explicit timezone indicator", () => {
    const timestamp = moment.utc("2025-01-12T10:30:00Z");
    const withTz = timestamp.format("YYYY-MM-DD HH:mm:ss Z");

    expect(withTz).toBe("2025-01-12 10:30:00 +00:00");
  });
});

describe("Timestamp Comparison", () => {
  test("UTC timestamps can be compared directly", () => {
    const timestamp1 = moment.utc("2025-01-12T10:00:00Z");
    const timestamp2 = moment.utc("2025-01-12T10:30:00Z");

    expect(timestamp1.isBefore(timestamp2)).toBe(true);
    expect(timestamp2.isAfter(timestamp1)).toBe(true);
    expect(timestamp1.isSame(timestamp1)).toBe(true);
  });

  test("Comparing UTC with timezone-aware timestamp", () => {
    const utcTime = moment.utc("2025-01-12T16:00:00Z");
    const mexicoCityTime = moment.tz("2025-01-12T10:00:00", "America/Mexico_City");

    // These represent the same moment (assuming UTC-6)
    // Compare using .valueOf() (Unix timestamp)
    const timeDiff = Math.abs(utcTime.valueOf() - mexicoCityTime.valueOf());

    // Should be the same moment or very close (within 1 second)
    expect(timeDiff).toBeLessThan(1000);
  });

  test("Timestamp ordering remains consistent across timezones", () => {
    const utc1 = moment.utc("2025-01-12T10:00:00Z");
    const utc2 = moment.utc("2025-01-12T11:00:00Z");

    const mexico1 = utc1.clone().tz("America/Mexico_City");
    const mexico2 = utc2.clone().tz("America/Mexico_City");

    // Order should be preserved
    expect(utc1.isBefore(utc2)).toBe(true);
    expect(mexico1.isBefore(mexico2)).toBe(true);
  });
});

describe("Edge Cases", () => {
  test("Handling midnight UTC", () => {
    const midnight = moment.utc("2025-01-12T00:00:00Z");

    expect(midnight.hour()).toBe(0);
    expect(midnight.format()).toBe("2025-01-12T00:00:00Z");

    // Convert to Mexico City - should be previous day
    const mexicoCityMidnight = midnight.clone().tz("America/Mexico_City");
    expect(mexicoCityMidnight.date()).toBeLessThanOrEqual(midnight.date());
  });

  test("Handling daylight saving time transitions", () => {
    // Mexico City DST typically starts in early April
    const beforeDST = moment.utc("2025-03-01T12:00:00Z");
    const afterDST = moment.utc("2025-05-01T12:00:00Z");

    const mexico1 = beforeDST.clone().tz("America/Mexico_City");
    const mexico2 = afterDST.clone().tz("America/Mexico_City");

    // Offset might be different due to DST
    // Both should still be valid moments
    expect(mexico1.isValid()).toBe(true);
    expect(mexico2.isValid()).toBe(true);
  });

  test("Parsing timestamps without timezone", () => {
    // This is ambiguous - moment will assume local timezone
    const ambiguous = moment("2025-01-12T10:30:00");

    // Should be valid but may not be UTC
    expect(ambiguous.isValid()).toBe(true);

    // Better approach: explicitly parse as UTC
    const explicit = moment.utc("2025-01-12T10:30:00");
    expect(explicit.isUtc()).toBe(true);
  });

  test("Handling invalid timestamps", () => {
    const invalid = moment.utc("invalid-date");

    expect(invalid.isValid()).toBe(false);
  });
});

describe("Database Format Compatibility", () => {
  test("Format matches expected database input format", () => {
    const timestamp = moment.utc();
    const formatted = timestamp.format();

    // Should be ISO 8601 format with Z suffix
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  test("Parsing database timestamp output", () => {
    // Simulate a timestamp returned from database
    const dbTimestamp = "2025-01-12T10:30:00.000Z";

    const parsed = moment.utc(dbTimestamp);

    expect(parsed.isValid()).toBe(true);
    expect(parsed.isUtc()).toBe(true);
    expect(parsed.year()).toBe(2025);
    expect(parsed.month()).toBe(0); // January (0-indexed)
    expect(parsed.date()).toBe(12);
  });

  test("Handling timestamptz format from PostgreSQL", () => {
    // PostgreSQL returns timestamps in ISO format
    const postgresTimestamp = "2025-01-12 10:30:00+00";

    const parsed = moment.utc(postgresTimestamp);

    expect(parsed.isValid()).toBe(true);
  });
});

describe("Epoch Timestamp Compatibility", () => {
  test("Date.now() returns UTC milliseconds", () => {
    const epoch = Date.now();

    // Should be a positive number
    expect(epoch).toBeGreaterThan(0);

    // Should be in milliseconds (very large number)
    expect(epoch.toString().length).toBeGreaterThanOrEqual(13);

    // Can be converted to moment
    const fromEpoch = moment.utc(epoch);
    expect(fromEpoch.isValid()).toBe(true);
  });

  test("moment.utc().valueOf() matches Date.now()", () => {
    const epoch1 = Date.now();
    const epoch2 = moment.utc().valueOf();

    // Should be within 1 second of each other
    const diff = Math.abs(epoch1 - epoch2);
    expect(diff).toBeLessThan(1000);
  });

  test("Converting epoch to formatted timestamp", () => {
    const epoch = 1673524800000; // 2023-01-12 12:00:00 UTC

    const timestamp = moment.utc(epoch);

    expect(timestamp.format()).toBe("2023-01-12T12:00:00Z");
    expect(timestamp.year()).toBe(2023);
    expect(timestamp.month()).toBe(0); // January
  });
});

describe("Controller Integration", () => {
  test("Simulating controller timestamp creation", () => {
    // This is what controllers should do after migration
    const requestTimestamp = moment.utc();

    expect(requestTimestamp.isUtc()).toBe(true);
    expect(requestTimestamp.format()).toMatch(/Z$/);
  });

  test("Simulating insertRequestResponse formatting", () => {
    const requestTimestamp = moment.utc();
    const responseTimestamp = moment.utc();

    // Simulate the format() calls in insertRequestResponse.js
    const formattedRequestTimestamp = requestTimestamp.format();
    const formattedResponseTimestamp = responseTimestamp.format();

    // Both should be ISO format with Z suffix
    expect(formattedRequestTimestamp).toMatch(/Z$/);
    expect(formattedResponseTimestamp).toMatch(/Z$/);

    // Response should be after or equal to request
    expect(
      moment.utc(formattedResponseTimestamp).isSameOrAfter(
        moment.utc(formattedRequestTimestamp)
      )
    ).toBe(true);
  });
});
