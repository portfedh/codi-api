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

    // sanitize-html properly encodes special characters
    // < and > are encoded to prevent any potential tag interpretation
    expect(req.body.html).toBe("&lt; &gt; &amp; \" '");
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

    // sanitize-html uses a proper HTML parser that handles nested tags correctly
    // Malformed outer brackets are encoded, making output safe
    expect(req.body.nestedScript).toBe("&lt;&gt;");
    expect(req.body.nestedDiv).toBe("&lt;content&gt;");
    expect(req.body.doubleNested).toBe("&lt;&lt;&gt;&gt;"); // Three brackets each side
    expect(req.body.complexNested).toBe("&gt;alert('xss')"); // HTML parser handles complex nesting

    // Verify no executable script tags remain in any output
    expect(req.body.nestedScript).not.toContain("<script");
    expect(req.body.complexNested).not.toContain("<script");
  });

  test("should prevent GitHub CodeQL incomplete sanitization vulnerability", () => {
    req.body = {
      // The exact attack pattern from GitHub's security warning
      // Input: <scrip<script>is removed</script>t>alert(123)</script>
      // Single-pass regex would produce: <script>alert(123)</script> (vulnerable!)
      // sanitize-html uses proper HTML parser to handle this safely
      githubExample: "<scrip<script>is removed</script>t>alert(123)</script>",

      // Additional similar patterns
      variation1: "<scri<script>foo</script>pt>alert(1)</script>",
      variation2: "<<script>bar</script>script>alert(2)</script>",
    };

    sanitizeRequest(req, res, next);

    // sanitize-html properly parses HTML and removes all valid script tags
    // Any remaining text is safe (no executable scripts)
    // Verify NO executable <script> tags remain in output
    expect(req.body.githubExample).not.toContain("<script");
    expect(req.body.variation1).not.toContain("<script");
    expect(req.body.variation2).not.toContain("<script");

    // Verify angle brackets in output are encoded (safe)
    expect(req.body.githubExample).toContain("&gt;");
    expect(req.body.variation1).toContain("&gt;");
    expect(req.body.variation2).toContain("&gt;");

    // The output is safe text, not executable code
    expect(req.body.githubExample).toBe("is removedt&gt;alert(123)");
    expect(req.body.variation1).toBe("foopt&gt;alert(1)");
    expect(req.body.variation2).toBe("&lt;script&gt;alert(2)"); // Angle brackets encoded = safe
  });

  test("should prevent script tag bypass with whitespace in closing tag", () => {
    req.body = {
      // CodeQL warning: regex doesn't match </script > with whitespace
      // This allows XSS bypass via malformed closing tags with regex-based approaches
      // sanitize-html's HTML parser handles these correctly
      spaceBeforeClosing: '<script>alert("xss")</script >',
      multipleSpaces: '<script>alert("xss")</script  >',
      tabBeforeClosing: '<script>alert("xss")</script\t>',
      mixedWhitespace: '<script>alert("xss")</script \t >',
      nestedWithSpace: '<<script>inner</script >script>alert(1)</script >',
    };

    sanitizeRequest(req, res, next);

    // sanitize-html properly handles script tags with whitespace in closing tags
    // All script tags are removed, output is safe
    expect(req.body.spaceBeforeClosing).toBe("");
    expect(req.body.multipleSpaces).toBe("");
    expect(req.body.tabBeforeClosing).toBe("");
    expect(req.body.mixedWhitespace).toBe("");

    // Nested case - malformed outer structure is encoded safely
    expect(req.body.nestedWithSpace).not.toContain("<script");
    expect(req.body.nestedWithSpace).toBe("&lt;script&gt;alert(1)");
  });
});
