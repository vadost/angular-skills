# Angular Skills

![Angular Skills banner](assets/angular-skills-banner.jpg)

Reusable Angular coding rules and skills for Angular projects.

This repository provides a CLI that copies a ready-to-use `.angular-skills` directory into any project.

## Install In Another Project

Run this command from the root of the project where you want to add Angular Skills:

```bash
npx github:vadost/angular-skills
```

After running it, the target project will contain:

```text
.angular-skills/
  rules/
  skills/
```

The command copies the files from this repository into the current working directory.

## Existing `.angular-skills` Directory

By default, the command does not overwrite an existing `.angular-skills` directory:

```bash
npx github:vadost/angular-skills
```

To replace an existing copy, run:

```bash
npx github:vadost/angular-skills --force
```

## Output Structure

After installation, the target project will receive this structure:

```text
.angular-skills/
  rules/
    guidelines.md
  skills/
    angular-developer/
      SKILL.md
      references/
    angular-new-app/
      SKILL.md
    best-practices.md
```
