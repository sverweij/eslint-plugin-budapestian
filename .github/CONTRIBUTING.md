## Contributing

So you want to contribute to eslint-plugin-budapestian? We already love you! :heart:

To make this as easy as possible for you, here's some simple guidelines:

### FAQ

It might be a solution to your issue already exists. eslint-plugin-budapestian has
a [FAQ](../doc/faq.md) that might help you out.

### Reporting issues

- All **issues** are **welcome**.
  - These include bug reports, questions, feature requests and enhancement
    proposals
  - [GitHub's issue tracker](https://github.com/sverweij/eslint-plugin-budapestian/issues)
    is the easiest way to submit them.
- In turn, we try to **respond within a week**.  
  This might or might not include an actual code fix.
- If there's something that doesn't fit an issue, feel free to contact us on
  mastodon [@mcmeadow@mstdn.social](https://mstdn.social/@mcmeadow)

### Contributing code

- We prefer well documented
  **[pull requests](https://help.github.com/articles/creating-a-pull-request/)**
  based on the most recent version of the **main** branch.
- Code quality
  - Additions pass eslint and dependency-cruiser (as configured for this repo)
  - Mocha tests prove your code does what it intends.
  - Your code does not introduce regressions - `npm run check:full` and a build/
    check on the configured ci's proves this.
  - Code style (you know, petty things like indentations, where brackets go,
    how variables & parameters are named) fits in with the current code base.
- Plan to do something drastic?  
  Leave an [issue](https://github.com/sverweij/eslint-plugin-budapestian/issues/new)
  on GitHub, so we can talk about it.
- eslint-plugin-budapestian is released with a [code of conduct](../CODE_OF_CONDUCT.md), adapted
  from the [contributor covenant](http://contributor-covenant.org/).

### Legal

- the code you add will be subject to
  [the MIT license](../LICENSE), just like the rest of eslint-plugin-budapestian
- the code you add is your own original work
