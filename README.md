# @lib/codec

This is a collection of fast, compact and portable codecs for handling string data especially in browsers.
Node.js frequently has more efficient, native implementations that should be used when possible.

These are extensively commented and designed to work together with consistent interfaces.

Every codec is published as a separate micropackage in the `@lib` namespace, and also collectively
in a single package `@lib/codec`.

The archive formats Zip and Tar feature no compression and are a convenient minimalistic way to
save multiple locally generated files using the correct names, directory structure and permissions.
Zip is also the wrapper used by common document formats such as `docx` and `xlsx`.

This monorepo is structured according to [boennemann/alle](#) to use minimal tooling.

The codecs were developed to support the [RequireX](#) in-browser JavaScript development toolchain.

Detailed usage instructions are listed in the documentation of each codec:

- [Binary](#)
- [Base64](#)
- [Base64-VLQ](#)
- [CRC32](#)
- [UTF-8](#)
- [Tar](#)
- [Zip](#)
