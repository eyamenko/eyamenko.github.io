---
title: Automatically formatting your .NET projects
date: '2019-09-29T07:34:53.585Z'
description: Every programmer has its own coding style preferences, but software development teams should have a well defined standards. It makes it easier to maintain the project, read the code, review pull requests, etc. Team mates join and leave. If there is no common ground, projects start looking like a collection of unrelated things...
---

Every programmer has its own coding style preferences, but software development teams should have a well defined standards. It makes it easier to maintain the project, read the code, review pull requests, etc. Team mates join and leave. If there is no common ground, projects start looking like a collection of unrelated things.

To solve this issue, community created a wide variety of tools. For instance, there is an awesome project called [Prettier](https://prettier.io/). It formats, or how they call it — _prettifies_, certain files. Unfortunately, it doesn’t support .NET languages, but don’t get upset. There is something out there that can help us keep our .NET codebases consistent.

Kind people from Microsoft created a handy dotnet tool - [dotnet-format](https://github.com/dotnet/format). It reads style preferences from an [.editorconfig](https://editorconfig.org/) file and formats files accordingly. As a bonus, Visual Studio supports _.editorconfig_ rules as well and can apply them when you format the code manually. Looks like we’ve got everything in place now, we can relax and stop worrying about style preferences and formatting. The solution/project can be initially formatted by the _dotnet-format_ and then, before committing a change, each developer will have to make sure they format their change in Visual Studio manually. There is one little problem here though, people tend to forget things. We can do better. We can automate it.

.NET Core 3.0 introduced a concept of [local dotnet tools](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-0#local-tools). It’s similar to local executable _npm_ scripts. We can install the _dotnet-format_ as a local tool and then make it format staged files when someone commits the code.

1. Create a dotnet tools manifest file: `dotnet new tool-manifest`
2. Install the _dotnet-format_: `dotnet tool install dotnet-format`
3. Add an _.editorconfig_ file to the root of the project. I suggest to use [Roslyn team’s config file](https://github.com/dotnet/roslyn/blob/master/.editorconfig) as a base.
4. Initialize an _npm_ project: `yarn init`
5. Install the following _npm_ packages as dev dependencies: `yarn add husky lint-staged --dev`
6. Configure _husky_ to run _lint-staged_ as a pre-commit _git_ hook. Add the following to _package.json_:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged -r"
  }
}
```

7. The last step is to configure _lint-staged_ to format our staged files and then stage them back. Create a _.lintstagedrc.js_ file with the below content:

```javascript
module.exports = {
  'src/**/*.cs': filenames => [
    `dotnet dotnet-format --files ${filenames.join(',')}`,
    `git add ${filenames.join(' ')}`,
  ],
};
```

That’s it. I’ve created a [template repository](https://github.com/eyamenko/dotnet-core-template-repository), which includes everything I’ve mentioned above; and can be used as a starting point when creating new .NET Core repositories. Happy coding!
