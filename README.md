# release-dis

## A tool to streamline releases
* Creates a git tag
* Uploads the release to an s3 bucket
* Generates a html file to list the releases

## Usage

You **must** create a file config/release.json


For example
```javascript
{
  "bucket": "release-dis",
  "region": "us-east-1",
  "aws_access_key_id": "ABC123XYZ",
  "aws_secret_access_key": "B16QIYeNzYnZy"
  "release_template": "config/release.html",
  "release_files": "config/**/*"
}
```

