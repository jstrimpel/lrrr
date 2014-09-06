## A command line utility for quickly creating LazoJS applications

Open for discussion. Working document. This is an application generator NOT another package manager!

> Ruler of the planet Omicron Persei 8!

### Require
Lrrr can be included by other node modules. For instance LazoJS will include Lrrr and allow for default
resource creation, e.g.,

```shell
lazo create app
```

###  API
Lrrr consumes templates. A default set of templates will ship with Lrrr.

#### Create Application
Creates a new LazoJS application.

```shell
lrrr create app [dest]
```

#### Add Component
Creates a new LazoJS component. `dest` is the application directory. The component will be created in the application `components` directory.

```shell
# -c controller if one exists in the template
# -v view if one exists in the template
# -c controller if one exists in the template
# -t template source
lrrr add component [-c][-v][-t template] [cmp_name] [dest]
```

#### Add Model
Creates a new LazoJS model. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
# -s syncher
# -t template source
lrrr add model [-s][-t template] [model_name] [app_dest]
```

#### Add Collection
Creates a new LazoJS model or collection. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
# -s syncher
# -t template source
lrrr add collection [-s][-t template] [collection_name] [app_dest]
```

#### Add Route
Creates a new application route.

```shell
# -l component layout
# -a component action
lrrr add route [-l layout][-a action] component
```

#### Add Server Utility
Creates a new LazoJS server. `target` is the application directory. The component will be created in the application `server` directory or if a path is provided to a component it will be used.

```shell
# -t template source
lrrr add util [-t template] [util_name] [app_dest]
```

### Initializers
Command line only wizards for creating resources such as LazoJS [`conf.json`](https://github.com/walmartlabs/lazojs/wiki/Configuration#confjson). Initializers could also be used for adding resources that require configuration, e.g., `lrrr add model -t git://jstrimpel/lrr-stuff/model:thing`, could launch a configuration wizard.

* TBD

### Template Conventions
Templates should contain a `package.json`. An optional `lrrr.json` file can be used to specify creation and add instructions. The template contents should be contained in a `template` directory at the root of the template source.

### lrrr.json
`lrrr.json` is an optional temaple source file that contains intructions for lrrr to follow when generating resources from the template.

```javascript
{
    "app": {
        "app": {
            "files": "*"
        },
        "components": {
            "hello": {
                "files": [
                    "views/index.hbs"
                ],
                "dependencies": {
                  "models": ["hello"]
                }
            }
        }
    }
}
```

### Template Resolution
Templates are resolved using `protocol://resource`. 

* `file://path`
* `git://owner/repo`
* `http(s)://location`

### Roadmap
The feature described in this document will be released as follows.

> This is a working roadmap.

#### 0.1.0

* Default template support only

#### 0.2.0 

* `file://` support for local templates

#### 0.3.0 

* `git://` support for github.com 

#### 0.4.0 

* `http(s)://` support hosted templates
* Internal `git://` support

#### 0.5.0 

* Initializers
