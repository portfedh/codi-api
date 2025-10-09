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

  test("should prevent nested tag bypass vulnerability", () => {
    req.body = {
      // Nested tags that would bypass single-pass sanitization
      nestedScript: "<<script>alert(1)</script>>",
      nestedDiv: "<<div>content</div>>",
      doubleNested: "<<<script>alert('xss')</script>>>",
      complexNested: "<script<script>>alert('xss')</script>",
    };

    sanitizeRequest(req, res, next);

    // All nested tags should be completely removed
    // The multi-pass approach prevents bypass attacks
    expect(req.body.nestedScript).toBe("");
    expect(req.body.nestedDiv).toBe("content&gt;");
    expect(req.body.doubleNested).toBe("&gt;");
    expect(req.body.complexNested).toBe("");
  });

  test("should prevent GitHub CodeQL incomplete sanitization vulnerability", () => {
    req.body = {
      // The exact attack pattern from GitHub's security warning
      // Input: <scrip<script>is removed</script>t>alert(123)</script>
      // Single-pass would produce: <script>alert(123)</script> (vulnerable!)
      // Multi-pass correctly removes all script tags
      githubExample: "<scrip<script>is removed</script>t>alert(123)</script>",

      // Additional similar patterns
      variation1: "<scri<script>foo</script>pt>alert(1)</script>",
      variation2: "<<script>bar</script>script>alert(2)</script>",
    };

    sanitizeRequest(req, res, next);

    // All script tags and content should be completely removed
    // The loop prevents reconstituted script tags
    expect(req.body.githubExample).toBe("");
    expect(req.body.variation1).toBe("");
    expect(req.body.variation2).toBe("");
  });

  test("should prevent script tag bypass with whitespace in closing tag", () => {
    req.body = {
      // CodeQL warning: regex doesn't match </script > with whitespace
      // This allows XSS bypass via malformed closing tags
      spaceBeforeClosing: '<script>alert("xss")</script >',
      multipleSpaces: '<script>alert("xss")</script  >',
      tabBeforeClosing: '<script>alert("xss")</script\t>',
      mixedWhitespace: '<script>alert("xss")</script \t >',
      nestedWithSpace: '<<script>inner</script >script>alert(1)</script >',
    };

    sanitizeRequest(req, res, next);

    // All script tags should be removed, regardless of whitespace in closing tag
    expect(req.body.spaceBeforeClosing).toBe("");
    expect(req.body.multipleSpaces).toBe("");
    expect(req.body.tabBeforeClosing).toBe("");
    expect(req.body.mixedWhitespace).toBe("");
    expect(req.body.nestedWithSpace).toBe("");
  });
});
