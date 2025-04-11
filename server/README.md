# Description and Requirements
In this back-end project, an API will be developed to manage URL shortening.

## Features and Rules
- [ ]  It should be possible to create a link
    - [ ]  It should not be possible to create a link with a poorly formatted shortened URL
    - [ ]  It should not be possible to create a link with an already existing shortened URL
- [ ]  It should be possible to delete a link
- [ ]  It should be possible to obtain the original URL through a shortened URL
- [ ]  It should be possible to list all registered URLs
- [ ]  It should be possible to increment the number of accesses to a link
- [ ]  It should be possible to export the created links in a CSV
    - [ ]  The CSV should be accessible via a CDN (Amazon S3, Cloudflare R2, etc)
    - [ ]  A random and unique name should be generated for the file
    - [ ]  It should be possible to perform the listing efficiently
    - [ ]  The CSV should have fields such as original URL, shortened URL, access count, and creation date.

## Docker
For this back-end project, you should build a `Dockerfile`, following best practices, which will be responsible for generating the application image.
