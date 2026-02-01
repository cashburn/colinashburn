# CashburnStarterAngular

A template for a monorepo Angular application with multiple environments, deployed as an Azure Static Web App using GitHub Actions and Terraform, integrating CI code coverage checks, ESLint, Prettier, and Husky for code quality and formatting.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

# Features

This starter template includes the following features:

### Architecture

- **Monorepo** structure with separate `@cashburn/app` application and `@cashburn/core` library
- **Environment-specific configuration** system (`AppConfigStore`) that loads config from JSON files based on environment

### Code Quality & Formatting

- **ESLint** with `angular-eslint` for Angular-specific linting rules
    - **simple-import-sort** plugin for automatic import sorting
- **Prettier** integrated with ESLint via `eslint-config-prettier` for code formatting
- **Husky** with `lint-staged` for pre-commit hooks that run ESLint and Prettier
- **EditorConfig** for consistent code style across editors
- **VSCode** configuration with recommended extensions and settings

### Testing

- **Vitest** as the test runner (replaces Jasmine/Karma)
- **@vitest/coverage-v8** for code coverage reporting
- **JUnit** test reporting format for CI/CD integration

### CI (Continuous Integration)

- **GitHub Actions** workflow (`/.github/workflows/ci-cd.yml`) runs on pull requests and pushes
- **Unit testing** with Vitest for both app and core library projects
- **Code coverage** reporting with `@vitest/coverage-v8` and JUnit XML output
- **Coverage comparison** on PRs against main branch baseline
- **Terraform validation** (init, validate, fmt check) to ensure IaC is correct
- **Build validation** to ensure the application compiles successfully

### CD (Continuous Deployment)

- **GitHub Actions** deployment workflow (`/.github/workflows/deploy-template.yml`)
- **[Azure Static Web Apps](#azure-static-web-apps)** deployment with [multi-environment](#multiple-environments) support
- **Terraform** for [Infrastructure as Code](#terraform-azure-iac-infra) to manage Azure resources
- Automatic deployment on push to main branch (sequential: dev -> prod)
- Manual deployment via workflow_dispatch for specific environments
- **[GitHub repository settings](#terraform-github-repository-settings-github-settings)** managed via Terraform
- Custom domain support configured in Terraform

## Multiple Environments

This project supports multiple deployment environments configured via GitHub Environments and Terraform:

- **dev** - Development environment for testing changes
- **prod** - Production environment for live deployment

### Deployment Flow

- **Pull Requests**: CI runs (tests, build, validation) but no deployment
- **Push to main**: Sequential deployment - dev deploys first, then prod (only after dev succeeds)
- **Manual dispatch**: Can deploy to a specific environment or all environments

### Environment Configuration

Each environment has its own Terraform configuration:

- Environment variables stored in GitHub Environment secrets (`AZURE_CLIENT_ID`, `ARM_TENANT_ID`, `ARM_SUBSCRIPTION_ID`)
- Terraform variable files: `/infra/env/{env}.tfvars`
- Terraform backend configs: `/infra/env/backend.{env}.config`
- Application config files: `/projects/cashburn/app/config/config.{env}.json`

The application loads the appropriate config JSON file at runtime based on the environment name set in the Angular environment files.

## Terraform GitHub Repository Settings (`/github-settings`)

This project stores GitHub Repository Settings and Rulesets in a Terraform configuration in the `/github-settings` folder. Whenever the `/github-settings` files are updated, a GitHub Action Workflow (`/.github/workflows/apply-github-settings.yml`) is triggered, that updates the Repository Settings to the latest Terraform configuration.

The base configuration was added from another starter project, [cashburn-starter-tf-github-settings](https://github.com/cashburn/cashburn-starter-tf-github-settings), where more details can be found.

**For this to work, you must set up a GitHub PAT or create a GitHub App, following the instructions in the repo above.**

_Note: The workflow will attempt to recreate new GitHub Rulesets each time it is run (because no state file is saved). If you wish to make updates to the Repo Settings/Rulesets, **delete** all the GitHub Rulesets first, and then the workflow will recreate them using the latest configuration._

## Terraform Azure IaC (`/infra`)

The Azure IaC for this project is managed by a Terraform configuration in the `/infra` folder. The infrastructure is deployed as part of the `/.github/workflows/ci-cd.yml` workflow, with Terraform steps in the `/.github/workflows/deploy-template.yml` file.

The base configuration was added from another starter project, [cashburn-starter-tf](https://github.com/cashburn/cashburn-starter-tf), where more details can be found.

## Azure Static Web Apps

The project is hosted using Azure Static Web Apps. Configuration is deployed as part of the [Terraform Azure IaC](#terraform-azure-iac-infra) configuration, and the `/dist` folder is uploaded to the Static Web App in the `/.github/workflows/deploy-template.yml` file.

# Steps to use this in your project

**Important: If you use this starter project, you MUST update these files especially!!!**

- `/.github/CODEOWNERS` -
  CODEOWNERS requires that any updates in specific folders get approved by a particular person. It is provided as an example, but you MUST change it for security reasons. And I'm guessing you don't want every CI/CD change in your repo to require approval from `@cashburn` :wink:
- `/infra/env/dev.tfvars` - You MUST use your own custom domain name (if you have one)
- `/infra/env/prod.tfvars` - You MUST use your own custom domain name (if you have one)
    - If you do NOT have a Custom Domain name, comment out the `custom_domain` resource in the `/infra/main.tf` file
- `/infra/backend.dev.config` - You MUST use a different storage_account_name
- `/infra/backend.prod.config` - You MUST use a different storage_account_name

## Option 1 - Use the GitHub template

`cashburn-starter-angular` is a public template on GitHub. On the repo homepage, there should be a button on the right that says "Use this template".

1. Click `Use this template` -> `Create a new repository`
2. Clone the new repo
3. Rename the project folders from `cashburn` to `myapp`
    1. `projects/cashburn/app` -> `projects/myapp/app`
    2. `projects/cashburn/core` -> `projects/myapp/core`
4. Find and replace `cashburn` with your app name prefix (Ex. `myapp`)
    1. `angular.json`
        1. All the project names/directories
    2. `package.json`
        1. Library names
    3. `tsconfig.json`
        1. Library names/directories
    4. `.github/workflows/deploy-template.yml`
        1. Library names
    5. `/projects/myapp/app/src/index.html`
        1. App Title
    6. `/projects/myapp/app/src/app/app.config.ts`
        1. Imports
    7. `/projects/myapp/app/src/app/app.spec.ts`
        1. Imports
    8. `/projects/myapp/app/src/app/app.ts`
        1. App Title
    9. `/projects/myapp/app/src/app/shell/shell.spec.ts`
        1. Imports
    10. `/projects/myapp/app/src/app/shell/shell.ts`
        1. Imports
    11. `/projects/myapp/core/ng-package.json`
        1. Destination folder
    12. `/projects/myapp/core/package.json`
        1. Library name
5. Run `npm install`
6. Continue to [Set up infra](#set-up-infra) section

## Option 2 - Create a new repo and copy files

1. Clone this repository (to copy files from later)
2. Create a new Angular repo
    1. `ng new myapp-starter-test --create-application=false`
3. `ng new myapp-starter-test --create-application=false`
4. `ng generate application @myapp/app`
    1. Choose SCSS
5. `ng generate library @myapp/core`
6. `npm install --save-dev @vitest/coverage-v8 angular-eslint eslint eslint-config-prettier eslint-plugin-simple-import-sort husky lint-staged npm-run-all-next prettier typescript-eslint vitest`
7. `ng add @angular/material`
8. Copy files from `cashburn-starter-angular`
    1. Copy the generic files from `cashburn-starter-angular`
        1. .editorconfig
        2. .gitignore
        3. .eslint.config.js
        4. `.vscode/`
            1. Along with all its contents
        5. `.husky/`
            1. Along with at least the `pre-commit` file

        ```bash
        cp -r ../cashburn-starter-angular/.editorconfig ../cashburn-starter-angular/.gitignore ../cashburn-starter-angular/eslint.config.js ../cashburn-starter-angular/.vscode ../cashburn-starter-angular/.husky .
        ```

    2. Copy the Angular projects from `cashburn-starter-angular`
        1. `projects/cashburn/app` -> `projects/myapp/app`
        2. `projects/cashburn/core` -> `projects/myapp/core`

        ```bash
        cp -r ../cashburn-starter-angular/projects/cashburn/app ./projects/myapp/
        cp -r ../cashburn-starter-angular/projects/cashburn/core ./projects/myapp/
        ```

    3. Copy the `angular.json` file from `cashburn-starter-angular` (or copy just the project configurations; we mostly need the coverage/eslint/environment file replacements)
        1. `cp ../cashburn-starter-angular/angular.json .`
    4. Copy the `tsconfig.json` file from `cashburn-starter-angular` (or just copy the `compilerOptions.paths` field)
        1. `cp ../cashburn-starter-angular/tsconfig.json .`

    5. Copy these sections from the `/package.json`:
        1. `scripts`
        2. `prettier`
        3. `engines` - Replace this with whichever version of NodeJs you would like to use
        4. `lint-staged`
    6. Find and replace from `cashburn` to `myapp`. Changes should be in:
        1. `/angular.json`
            1. All the project names/directories
            2. **You'll want to change the `cli.analytics` field back if you had it set in your app**
        2. `/projects/myapp/app/src/index.html`
            1. App Title
        3. `/projects/myapp/app/src/app/app.config.ts`
            1. Imports
        4. `/projects/myapp/app/src/app/app.spec.ts`
            1. Imports
        5. `/projects/myapp/app/src/app/app.ts`
            1. App Title
        6. `/projects/myapp/app/src/app/shell/shell.spec.ts`
            1. Imports
        7. `/projects/myapp/app/src/app/shell/shell.ts`
            1. Imports
        8. `/projects/myapp/core/ng-package.json`
            1. Destination folder
        9. `/projects/myapp/core/package.json`
            1. Library name
    7. Copy `/infra`
    8. Copy `/.github`
        1. **Replace `cashburn` with `myapp` in `.github/workflows/deploy-template.yml`**
    9. Copy `.vscode`
    10. Copy `github-settings`
    11. Run `npm run prettier:fix`
    12. Continue to [Set up infra](#set-up-infra) section

## Set up infra

1. Update `/infra` folder
    1. Configure all values in these files. Reference [cashburn-starter-tf](https://github.com/cashburn/cashburn-starter-tf) for more details on each config value.
        1. `/infra/env/backend.*.config`
        2. `/infra/env/*.tfvars`
2. Run Bootstrap script to set up Azure infrastructure, using guidance from [cashburn-starter-tf](https://github.com/cashburn/cashburn-starter-tf?tab=readme-ov-file#run-bootstrap-script)
3. Add GitHub Actions Repository variables
    1. AZURE_CLIENT_ID
    2. AZURE_TENANT_ID
    3. AZURE_SUSCRIPTION_ID
4. Generate GH_PAT for [cashburn-starter-tf-github-settings](https://github.com/cashburn/cashburn-starter-tf-github-settings)
    1. Add it as a GitHub Actions Repository secret
5. Update CODEOWNERS file

# Running Locally

1. Run `npm install` in the project root directory to install all software dependencies
2. Run `npm start`

# Unit Tests

1. Run `ng test {projectName}` locally to run unit tests for one Angular project in watch mode
2. Run `npm run test:ci` to run unit tests for the Angular projects specified in the `/package.json`
    1. Note: If you add additional Angular projects, these must be added as individual `tests:{projectName}` scripts in the `/package.json`
    2. The `test:ci` script runs all `tests:*` scripts instead of just running one `ng test` to allow for multiple `coverage` folders. Currently with the Angular implementation of Vitest, `ng test` for all projects will generate only one `coverage` folder for all projects, so results for one project get overwritten by the other.
    3. The `test:ci` script runs the `tests:*` scripts in series (`run-s`) instead of parallel (`run-p`) because there is currently a race condition in the Angular implementation of Vitest and coverage may not be generated intermittently when running multiple dependent projects in parallel. If this becomes a significant performance bottleneck, it could be reassessed in the future.

# Project Structure

```
cashburn-starter-angular/
├── .github/                        # GitHub Actions workflows
├── .husky/                         # Git hooks configuration for linting/formatting
├── .vscode/                        # VSCode workspace settings
├── github-settings/                # Terraform for GitHub Repository Settings (see below)
├── infra/                          # Terraform Azure IaC (see below)
├── projects/                       # Monorepo projects
│   └── cashburn/
│       ├── app/                    # Main Angular application
│       │   ├── config/             # Environment-specific config JSON files
│       │   ├── public/             # Static assets
│       │   └── src/
│       │       ├── app/            # Application components, routes, config
│       │       ├── environments/   # Angular environment files
│       │       ├── index.html
│       │       ├── main.ts
│       │       └── styles.scss
│       └── core/                   # Shared library
│           └── src/
│               └── lib/
│                   └── app-config/ # App configuration service
```

# Steps to get here

1. `ng new cashburn-starter-angular --create-application=false`
    1. Select Gemini
2. Add `.editorconfig` changes
3. `ng add angular-eslint`
4. Add Prettier
    1. `npm install --save-dev prettier`
    2. `npm install --save-dev eslint-config-prettier`
    3. Add eslint-config-prettier to eslint.config.js
    4. Add VSCode Prettier/ESLint extensions
    5. Add `.vscode/settings.json`
5. Run Prettier
    1. Add eslint/prettier scripts to package.json
    2. Run `npm run prettier:fix`
6. `ng generate application @cashburn/app`
    1. SCSS
7. Update .gitignore
8. Add Husky/Lint-Staged with Prettier
9. Add `eslint-plugin-simple-import-sort`
    1. `npm install --save-dev eslint-plugin-simple-import-sort`
    2. Add plugin/rules to eslint.config.js
10. Add code coverage and junit test reporting
    1. Add `test:ci` script
    2. `npm install --save-dev @vitest/coverage-v8`
11. Add CI/CD from [cashburn-starter-tf](https://github.com/cashburn/cashburn-starter-tf) project
    1. Copy `/infra` folder
    2. Run `/infra/setup.ps1` for NPD
    3. Add NPD env vars to GitHub Environment Variables
    4. Run `/infra/setup.ps1` for Prod
    5. Add Prod env vars to GitHub Prod environment
    6. Add reviewer for Prod env
12. Add SWA to Terraform
13. Deploy to Azure
14. Add Custom Domain
    1. Set `app_url` in `*.tfvars`
    2. In Azure, go to your newly created Static Web App and under `Custom Domains` get the TXT validation record (it should say "Validating")
    3. In your DNS hosting platform, add a TXT record for the Azure Static Web App Custom Domain validation
    4. Wait at least 15 mins; in Azure, the Custom Domain should now say "Validated"
    5. In your DNS hosting platform, add a CNAME record for the subdomain (or `www`) pointing to the `{random}.azurestaticapps.net` url output in your Terraform Apply logs
15. Add GitHub Repository Settings using [cashburn-starter-tf-github-settings](https://github.com/cashburn/cashburn-starter-tf-github-settings)
    1. Follow all instructions:
    2. Generate a PAT for only this repo, with:
        1. Administration - Read & Write
        2. Contents - Read
    3. Add the PAT as a Repository secret
    4. Push the changes
16. `ng generate library @cashburn/core`
    1. Update build script in package.json
17. `ng generate component --project @cashburn/app shell`
18. `ng generate component --project @cashburn/core AppConfig`
19. Update settings.json to add eslint errors as warnings
20. `ng add @angular/material --project @cashburn/app`
21. Create AppConfig
    1. `ng generate interface app-config/models/app-config --project @cashburn/core`
    2. `ng generate service app-config/app-config`
