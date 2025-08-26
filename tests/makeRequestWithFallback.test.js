const {
  makeRequestWithFallback,
} = require("../controllers/utils/makeRequestWithFallback");
const axios = require("axios");

jest.mock("axios");

describe("makeRequestWithFallback", () => {
  const primaryUrl = "https://primary.example.com";
  const secondaryUrl = "https://secondary.example.com";
  const requestData = { key: "value" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return response from the primary URL if it succeeds", async () => {
    const primaryResponse = { data: "Primary success" };
    axios.post.mockResolvedValueOnce(primaryResponse);

    const result = await makeRequestWithFallback(
      primaryUrl,
      secondaryUrl,
      requestData
    );

    expect(result).toEqual(primaryResponse);
    expect(axios.post).toHaveBeenCalledWith(
      primaryUrl,
      requestData,
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should return response from the secondary URL if the primary fails", async () => {
    const secondaryResponse = { data: "Secondary success" };
    axios.post.mockRejectedValueOnce(new Error("Primary failed"));
    axios.post.mockResolvedValueOnce(secondaryResponse);

    const result = await makeRequestWithFallback(
      primaryUrl,
      secondaryUrl,
      requestData
    );

    expect(result).toEqual(secondaryResponse);
    expect(axios.post).toHaveBeenCalledWith(
      primaryUrl,
      requestData,
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledWith(
      secondaryUrl,
      requestData,
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it("should throw an error if both primary and secondary URLs fail", async () => {
    axios.post.mockRejectedValueOnce(new Error("Primary failed"));
    axios.post.mockRejectedValueOnce(new Error("Secondary failed"));

    await expect(
      makeRequestWithFallback(primaryUrl, secondaryUrl, requestData)
    ).rejects.toThrow(
      "Both requests failed. Primary error: Primary failed, Secondary error: Secondary failed"
    );

    expect(axios.post).toHaveBeenCalledWith(
      primaryUrl,
      requestData,
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledWith(
      secondaryUrl,
      requestData,
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it("should throw a timeout error if both URLs timeout", async () => {
    const timeoutError = new Error("timeout of 3000ms exceeded");
    axios.post.mockRejectedValueOnce(timeoutError);
    axios.post.mockRejectedValueOnce(timeoutError);

    await expect(
      makeRequestWithFallback(primaryUrl, secondaryUrl, requestData, { timeout: 3000 })
    ).rejects.toThrow(
      "Both requests failed. Primary error: timeout of 3000ms exceeded, Secondary error: timeout of 3000ms exceeded"
    );

    expect(axios.post).toHaveBeenCalledWith(
      primaryUrl,
      requestData,
      expect.objectContaining({ timeout: 3000 })
    );
    expect(axios.post).toHaveBeenCalledWith(
      secondaryUrl,
      requestData,
      expect.objectContaining({ timeout: 3000 })
    );
    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});
