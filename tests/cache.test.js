const apiKeyCache = require("../config/cache");

describe("apiKeyCache", () => {
  beforeEach(() => {
    apiKeyCache.flushAll(); // Clear the cache before each test
  });

  test("should set and get a cache item", () => {
    apiKeyCache.set("testKey", "testValue");
    const value = apiKeyCache.get("testKey");
    expect(value).toBe("testValue");
  });

  test("should return undefined for a non-existent key", () => {
    const value = apiKeyCache.get("nonExistentKey");
    expect(value).toBeUndefined();
  });

  test("should delete a cache item", () => {
    apiKeyCache.set("testKey", "testValue");
    apiKeyCache.del("testKey");
    const value = apiKeyCache.get("testKey");
    expect(value).toBeUndefined();
  });

  test("should expire a cache item after TTL", (done) => {
    apiKeyCache.set("testKey", "testValue", 1); // Set TTL to 1 second
    setTimeout(() => {
      const value = apiKeyCache.get("testKey");
      expect(value).toBeUndefined();
      done();
    }, 1100); // Wait slightly longer than 1 second
  });

  test("should flush all cache items", () => {
    apiKeyCache.set("key1", "value1");
    apiKeyCache.set("key2", "value2");
    apiKeyCache.flushAll();
    expect(apiKeyCache.get("key1")).toBeUndefined();
    expect(apiKeyCache.get("key2")).toBeUndefined();
  });
});
