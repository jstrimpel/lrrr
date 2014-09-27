[![Build Status](https://travis-ci.org/jstrimpel/lrrr.svg?branch=master)](https://travis-ci.org/jstrimpel/lrrr)

## A command line utility for creating LazoJS applications

Open for discussion. Working [design doc](https://github.com/jstrimpel/lrrr/wiki/Design-Doc). 
This is an application generator NOT another package manager!

> Ruler of the planet Omicron Persei 8!

### Getting Started

Install lrrr.
```shell
npm install -g lrrr
```

Create a Lazo application.
```shell
lrrr create app my-app
```

Start application. Be sure to install [Lazo](https://github.com/walmartlabs/lazojs) if you haven't 
done so already, `npm install -g --production lazo`.
```shell
lazo start my-app
```

Open browser, [http://localhost:8080/](http://localhost:8080/).

Supported [Commands](https://github.com/jstrimpel/lrrr/wiki/Design-Doc#api): 
add model|collection|component, create app  

### Roadmap
The features described in this document will be released as follows.

> This is a working roadmap.

#### 0.1.0 - _*RELEASED*_

* Default template support only; template specification not supported
* CLI
* Supported commands: `create app`, `add component`, `add model`, `add collection`

#### 0.2.0 - _*RELEASED*_

* `file://` protocol support for adding templates
* Supported commands: 0.1.0 commands + `add template`
* Finalized `lrrr.json` contract
* -r resource name support for specifying template component, model, or collection

#### 0.3.0

* `git://` protocol support for adding templates
* `lrrr.json` dependencies support

#### 0.4.0

* `http(s)://` protocol support for adding templates

#### 0.5.0

* Initializers
