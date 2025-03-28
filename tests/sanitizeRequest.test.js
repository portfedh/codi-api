const { sanitizeRequest } = require("../middleware/sanitizeRequest");

describe("sanitizeRequest middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {};
    next = jest.fn();
  });

  test("should call next function", () => {
    sanitizeRequest(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("should sanitize strings in req.body", () => {
    req.body = {
      name: '<script>alert("XSS")</script>John<b>Doe</b>',
      email: 'john@example.com<script>alert("XSS")</script>',
    };

    sanitizeRequest(req, res, next);

    expect(req.body.name).toBe("JohnDoe");
    expect(req.body.email).toBe("john@example.com");
  });

  test("should sanitize strings in req.params", () => {
    req.params = {
      id: '123<script>alert("XSS")</script>',
      slug: "hello-<b>world</b>",
    };

    sanitizeRequest(req, res, next);

    expect(req.params.id).toBe("123");
    expect(req.params.slug).toBe("hello-world");
  });

  test("should sanitize strings in req.query", () => {
    req.query = {
      search: '<script>alert("XSS")</script>keyword',
      filter: "<i>important</i>",
    };

    sanitizeRequest(req, res, next);

    expect(req.query.search).toBe("keyword");
    expect(req.query.filter).toBe("important");
  });

  test("should handle nested objects", () => {
    req.body = {
      user: {
        name: '<script>alert("XSS")</script>John<b>Doe</b>',
        address: {
          street: "<i>123 Main St</i>",
          city: "<b>New York</b>",
        },
      },
      items: [{ name: "<script>item1</script>" }, { name: "<b>item2</b>" }],
    };

    sanitizeRequest(req, res, next);

    expect(req.body.user.name).toBe("JohnDoe");
    expect(req.body.user.address.street).toBe("123 Main St");
    expect(req.body.user.address.city).toBe("New York");
    expect(req.body.items[0].name).toBe("");
    expect(req.body.items[1].name).toBe("item2");
  });

  test("should handle empty or null values", () => {
    req.body = {
      emptyString: "",
      nullValue: null,
      undefinedValue: undefined,
    };

    sanitizeRequest(req, res, next);

    expect(req.body.emptyString).toBe("");
    expect(req.body.nullValue).toBeNull();
    expect(req.body.undefinedValue).toBeUndefined();
  });

  test("should properly handle HTML entities", () => {
    req.body = {
      html: "< > & \" '",
    };

    sanitizeRequest(req, res, next);

    // The implementation first removes < > and then encodes the rest
    expect(req.body.html).toBe(" &amp; &quot; &#x27;");
  });

  // Additional tests to improve branch coverage for lines 5-15

  test("should handle case when req.body is undefined", () => {
    req.body = undefined;

    sanitizeRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    // Should not throw an error
  });

  test("should handle case when req.params is undefined", () => {
    req.params = undefined;

    sanitizeRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    // Should not throw an error
  });

  test("should handle case when req.query is undefined", () => {
    req.query = undefined;

    sanitizeRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    // Should not throw an error
  });

  test("should handle complex objects with arrays", () => {
    req.body = {
      tags: ["<script>bad</script>", "<b>bold</b>", "normal"],
      nested: {
        arrays: [
          ["<i>item1</i>", "<strong>item2</strong>"],
          ["<script>item3</script>"],
        ],
      },
    };

    sanitizeRequest(req, res, next);

    expect(req.body.tags[0]).toBe("");
    expect(req.body.tags[1]).toBe("bold");
    expect(req.body.tags[2]).toBe("normal");
    expect(req.body.nested.arrays[0][0]).toBe("item1");
    expect(req.body.nested.arrays[0][1]).toBe("item2");
    expect(req.body.nested.arrays[1][0]).toBe("");
  });

  test("should handle HTML tags with attributes", () => {
    req.body = {
      content: '<a href="javascript:alert(1)">Click me</a>',
      style: '<div style="color:red">Styled text</div>',
    };

    sanitizeRequest(req, res, next);

    expect(req.body.content).toBe("Click me");
    expect(req.body.style).toBe("Styled text");
  });
});
