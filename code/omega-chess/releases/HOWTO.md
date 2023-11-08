# Omega Chess release notes

This is how to write a release note for Omega Chess:

Every file should start with metadata in the following format:

```
---
title: "Release Title"
description: "Release description."
version: "0.1.0"
---
```

The title should be the name of the release, the description should be a short description of the release, and the version should be the version of the release.

After the metadata, you can write the release notes in Markdown format.

> Note: The filename must match the regular expression
>
> ```
> /^(alpha|hotfix|release)-[0-9]+\.[0-9]+\.[0-9]+\.md$/g
> ```
>
> for the release notes to be picked up by the release script.
>
> E.g **hotfix-1.2.3.md** is a valid filename, but **update-1.2.md** is not.
>
>In addition, the title of the Release should also match the >filename, but with the dashes replaced with spaces.
>
>E.g. **Hotfix 1.2.3** is a valid title, but **Update 1.2** is not.
