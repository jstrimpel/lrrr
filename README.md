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
lrrr create app [target]
```

#### Add Component
This will create a new LazoJS component. `target` is the application directory. The component will be created in the application
`components` directory.

```shell
lrrr add component -n=cmp_name [-r=owner/repo-name] [-c][-v] [target]
```

#### Add Model
This will create a new LazoJS model or collection. `target` is the application directory. The component will be created in the application
`models` directory.

```shell
lrrr add model -n=m_name -t=m|c [-s] [-r=owner/repo-name] [target]
```

#### Add Server Utility
This will create a new LazoJS server. `target` is the application directory. The component will be created in the application
`server` directory or if a path is provided to a component it will be used.

```shell
lrrr add util -n=s_name [-s] [-r=owner/repo-name] [target]
```

### Template Repo Conventions
Template repos should be prefixed with "lrrr-". Templates should contain a `package.json`. An optional `lrrr.json` file can be used to specify creation and add instructions.
