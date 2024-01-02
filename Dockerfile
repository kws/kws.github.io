FROM rubylang/ruby:2.7

RUN git config --global --add safe.directory /app

RUN echo '#!/bin/bash\n\
bundle install\n\
bundle exec jekyll serve --host 0.0.0.0 "$@"\n\
' > /usr/local/bin/serve

RUN echo '#!/bin/bash\n\
bundle install\n\
bundle exec jekyll build "$@"\n\
' > /usr/local/bin/build

RUN chmod +x /usr/local/bin/serve /usr/local/bin/build

VOLUME /app
WORKDIR /app

EXPOSE 4000