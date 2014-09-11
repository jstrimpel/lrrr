[![Build Status](https://travis-ci.org/jstrimpel/lrrr.svg?branch=master)](https://travis-ci.org/jstrimpel/lrrr)

## A command line utility for creating LazoJS applications

Open for discussion. Working [design doc](https://github.com/jstrimpel/lrrr/wiki/Design-Doc). 
This is an application generator NOT another package manager!

> Ruler of the planet Omicron Persei 8!

### Roadmap
The features described in this document will be released as follows.

> This is a working roadmap.

#### 0.1.0

* Default template support only; template specification not supported
* CLI
* Supported commands: `create app`, `add component`, `add model`, `add collection`

#### 0.2.0

* `file://` support for local templates
* `lrrr.json` dependencies support
* Supported commands: 0.1.0 commands + `add util`

#### 0.3.0

* `git://` support for github.com

#### 0.4.0

* `http(s)://` support hosted templates
* Internal `git://` support

#### 0.5.0

* Initializers
