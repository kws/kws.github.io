# Jekyll Website

The website for <https://k-si.com>

## Pre-requisites

Install [rbenv](https://github.com/rbenv/rbenv#installation)

Install Ruby 2.7:

```bash
rbenv install 2.7.8

rbenv local 2.7.8
```

You are now ready to build the site. Change into the docs directory.

```bash

bundle install

bundle exec jekyll serve
```

That's it. You're done.

## Developing with Docker

If you don't want to install Ruby on your machine, you can use Docker to run the site locally.

```bash
docker build . -t jekyll

docker run --rm -it -v $(pwd):/app -p 4000:4000 jekyll serve
```

That's it. You're done.
