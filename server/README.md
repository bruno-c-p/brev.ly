# Description and Requirements
In this back-end project, an API will be developed to manage URL shortening.

## Features and Rules
- [x]  It should be possible to create a link
    - [x]  It should not be possible to create a link with a poorly formatted shortened URL
    - [x]  It should not be possible to create a link with an already existing shortened URL
    
- [x]  It should be possible to delete a link
- [ ]  It should be possible to list all registered URLs
- [ ]  It should be possible to obtain the original URL through a shortened URL
- [ ]  It should be possible to increment the number of accesses to a link

- [ ]  It should be possible to export the created links in a CSV
    - [ ]  The CSV should be accessible via a CDN (Amazon S3, Cloudflare R2, etc)
    - [ ]  A random and unique name should be generated for the file
    - [ ]  It should be possible to perform the listing efficiently
    - [ ]  The CSV should have fields such as original URL, shortened URL, access count, and creation date.

- [x] It should build a `Dockerfile` following best practices:
    - [x] It should use multi-stage builds to minimize image size
    - [x] It should run as a non-root user for security
    - [x] It should only include production dependencies
    - [x] It should use a distroless base image for the final stage
    - [x] It should properly expose the application port
