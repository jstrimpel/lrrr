## A command line utility for quickly creating LazoJS applications

Open for discussion.

> Ruler of the planet Omicron Persei 8!

### Require
Lrrr will be able to be included by other node modules. For instance LazoJS will include Lrrr and allow for default
resource creation, e.g.,

```shell
lazo create app
```

### Proposed API
Lrrr will consume templates stored in github repos. These templates will be downloaded as needed and used to create
the specified resources. A default set of templates will ship with Lrrr.

> High level API. Details will be fleshed out after the general concept has been vetted.

#### Create Application
This will create a new LazoJS application.

```shell
lrrr create app [dest]
```

#### Add Component
This will create a new LazoJS component. `dest` is the application directory. The component will be created in the application `components` directory.

```shell
# -c controller if one exists in the template
# -v view if one exists in the template
# -c controller if one exists in the template
# -r repo which contains component template
lrrr add component [-c][-v][-r owner/repo-name] cmp_name [dest]
```

#### Add Model
This will create a new LazoJS model. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
lrrr add model [-s][-r owner/repo-name] model_name [app_dest]
```

#### Add Collection
This will create a new LazoJS model or collection. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
lrrr add collection [-s][-r owner/repo-name] collection_name [app_dest]
```

#### Add Server Utility
This will create a new LazoJS server. `target` is the application directory. The component will be created in the application
`server` directory or if a path is provided to a component it will be used.

```shell
lrrr add util [-r owner/repo-name] util_name [app_dest]
```

### Template Repo Conventions
Template repos should be prefixed with "lrrr-". Templates should contain a `package.json`. An optional `lrrr.json` file can be used to specify creation and add instructions.
