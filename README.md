## A command line utility for quickly creating LazoJS applications

Open for discussion. Working document.

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
# -t template source
lrrr add component [-c][-v][-t template] [cmp_name] [dest]
```

#### Add Model
This will create a new LazoJS model. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
# -s syncher
# -t template source
lrrr add model [-s][-t template] [model_name] [app_dest]
```

#### Add Collection
This will create a new LazoJS model or collection. `dest` is the application directory. The component will be created in the application
`models` directory.

```shell
# -s syncher
# -t template source
lrrr add collection [-s][-t template] [collection_name] [app_dest]
```

#### Add Server Utility
This will create a new LazoJS server. `target` is the application directory. The component will be created in the application
`server` directory or if a path is provided to a component it will be used.

```shell
# -t template source
lrrr add util [-t template] [util_name] [app_dest]
```

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

#### 0.1.0

* Default template support only
* Commands: 
